import {
  copyFile,
  mkdir,
  readDir,
  remove,
  rename,
} from "@tauri-apps/plugin-fs";
import { type BaseDirectory, join } from "@tauri-apps/api/path";
import { ROOT_DIR } from "@/constants/rootDir";
import { useCallback, useState } from "react";
import { NOTES_PATH } from "@/constants/notesPath";
import { readJson, writeJson } from "@/utils/jsonHelpers";
import { useHiveStore } from "@/stores/useHiveStore";
import {
  type TreeNode,
  addNode,
  removeNode,
  //findNode,
  //traverseDFS,
  filterNodes,
  renameNode,
} from "@/utils/treeHelpers";
import { EMPTY_NOTE } from "./index.preset";
import { appendJson } from "@/utils/nodeHelpers";

interface FileInfo {
  name: string;
  path: string;
  dirPath: string;
  isDirectory: boolean;
  isSymLink: boolean;
  isFile: boolean;
}

// Our FileTreeNode now implements the generic TreeNode interface
export type FileTreeNode = TreeNode<FileInfo>;

export const useFileExplorer = () => {
  const [nodes, setNodes] = useState<FileTreeNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<FileTreeNode>();
  const hiveName = useHiveStore((state) => state.hiveName);

  const createFileNode = useCallback(
    (info: FileInfo, children: FileTreeNode[] = []): FileTreeNode => ({
      value: info,
      children,
    }),
    [],
  );

  const buildDirectoryTree = useCallback(
    async (
      currentPath: string,
      baseDir: BaseDirectory = ROOT_DIR,
    ): Promise<FileTreeNode[]> => {
      try {
        const entries = await readDir(currentPath, { baseDir });

        const nodes = await Promise.all(
          entries.map(async (entry) => {
            if (!entry.isDirectory && !entry.name.endsWith(".json")) {
              return null;
            }

            const fullPath = await join(currentPath, entry.name);

            const fileInfo: FileInfo = {
              name: entry.name,
              path: fullPath,
              dirPath: currentPath,
              isDirectory: entry.isDirectory,
              isFile: entry.isFile,
              isSymLink: entry.isSymlink,
            };

            if (entry.isDirectory) {
              const children = await buildDirectoryTree(fullPath, baseDir);
              return createFileNode(fileInfo, children);
            }

            return createFileNode(fileInfo);
          }),
        );
        return nodes.filter((node): node is FileTreeNode => node !== null);
      } catch (error) {
        console.error("Error building directory tree:", error);
        return [];
      }
    },
    [createFileNode],
  );

  const removeNodeByPath = useCallback(async (path: string): Promise<void> => {
    try {
      await remove(path, { baseDir: ROOT_DIR, recursive: true });

      setNodes((currentNodes) =>
        removeNode(currentNodes, (info) => info.path === path),
      );
    } catch (error) {
      console.error(`Error removing node at path ${path}:`, error);
      throw error;
    }
  }, []);

  const addNewNode = useCallback(
    async <TContent>(
      parentPath: string,
      nodeName: string,
      opts?: Partial<{ isDirectory: boolean; content: TContent }>,
    ): Promise<void> => {
      try {
        const defaultOpts = {
          isDirectory: false,
          content: EMPTY_NOTE as TContent,
        };
        const finalOpts = { ...defaultOpts, ...opts };

        const fullPath = await join(parentPath, nodeName);

        const newFileInfo: FileInfo = {
          name: finalOpts.isDirectory ? nodeName : `${nodeName}.json`,
          path: finalOpts.isDirectory ? fullPath : `${fullPath}.json`,
          dirPath: parentPath,
          isDirectory: finalOpts.isDirectory,
          isFile: !finalOpts.isDirectory,
          isSymLink: false,
        };

        await createNewNoteOrDir(parentPath, nodeName, {
          isDirectory: finalOpts.isDirectory,
          content: finalOpts.isDirectory,
        });

        // synchronize with the tree structure
        const newNode = createFileNode(newFileInfo);
        setNodes((currentNodes) =>
          addNode(currentNodes, (info) => info.path === parentPath, newNode),
        );
      } catch (error) {
        console.error("Error adding node:", error);
        throw error;
      }
    },
    [createFileNode],
  );

  const searchFileTree = useCallback(
    (searchTerm: string, options: { matchCase?: boolean } = {}) => {
      return filterNodes(nodes, (info) => {
        const nodeName = options.matchCase
          ? info.name
          : info.name.toLowerCase();
        const term = options.matchCase ? searchTerm : searchTerm.toLowerCase();
        return nodeName.includes(term);
      });
    },
    [nodes],
  );

  const getJsonFiles = useCallback(() => {
    return filterNodes(
      nodes,
      (info) => info.isFile && info.name.endsWith(".json"),
    );
  }, [nodes]);

  const getTreeStatistics = useCallback(() => {
    const stats = {
      totalFiles: 0,
      totalDirectories: 0,
      maxDepth: 0,
    };

    const calculateDepth = (node: FileTreeNode, currentDepth: number) => {
      stats.maxDepth = Math.max(stats.maxDepth, currentDepth);

      if (node.value.isFile) {
        stats.totalFiles++;
      } else if (node.value.isDirectory) {
        stats.totalDirectories++;
      }

      node.children?.forEach((child) =>
        calculateDepth(child, currentDepth + 1),
      );
    };

    nodes.forEach((node) => calculateDepth(node, 0));

    return stats;
  }, [nodes]);

  const initializeFileTree = useCallback(async () => {
    const initPath = await join(hiveName, NOTES_PATH);
    const builtNodes = await buildDirectoryTree(initPath, ROOT_DIR);

    setNodes(builtNodes);
  }, [hiveName, buildDirectoryTree]);

  const saveNote = async <TContent>(
    node?: FileTreeNode,
    content?: TContent,
  ) => {
    if (!content || !node) return;

    await writeJson<TContent>(
      node.value.dirPath,
      node.value.name,
      content,
      ROOT_DIR,
    );
  };

  const readNote = async <TContent>(path: string) => {
    const noteContent = await readJson<TContent>(path, ROOT_DIR);

    return noteContent;
  };

  const createNewNoteOrDir = async <TContent>(
    location: string,
    name: string,
    opts?: Partial<{ isDirectory: boolean; content: TContent }>,
  ) => {
    const defaultOpts = { isDirectory: false, content: EMPTY_NOTE as TContent };
    const finalOpts = { ...defaultOpts, ...opts };

    if (finalOpts?.isDirectory) {
      await mkdir(await join(location, name), {
        baseDir: ROOT_DIR,
        recursive: true,
      });
      return;
    }

    await writeJson<TContent>(location, name, finalOpts.content, ROOT_DIR);
  };

  const renameNodeAndNoteOrDir = useCallback(
    async (node: FileTreeNode, name: string) => {
      const oldPath = node.value.path;
      const newName = node.value.isDirectory ? name : appendJson(name);
      const newPath = await join(node.value.dirPath, newName);

      try {
        await rename(oldPath, newPath, {
          oldPathBaseDir: ROOT_DIR,
          newPathBaseDir: ROOT_DIR,
        });
      } catch (errors) {
        console.error("Error renaming the node: ", errors);
        throw errors;
      }

      setNodes((currentNodes) =>
        renameNode(currentNodes, (info) => info.name === node.value.name, {
          ...node.value,
          name: newName,
          path: newPath,
        }),
      );
    },
    [],
  );

  const copyNote = async (
    sourceNode: FileTreeNode,
    destinationNode: FileTreeNode,
  ) => {
    try {
      await copyFile(
        sourceNode.value.path,
        await join(destinationNode.value.path, sourceNode.value.name),
        {
          fromPathBaseDir: ROOT_DIR,
          toPathBaseDir: ROOT_DIR,
        },
      );
    } catch (errors) {
      console.error("Error copying the node: ", errors);
      throw errors;
    }
  };

  const moveNote = async (
    sourceNode: FileTreeNode,
    destinationNode: FileTreeNode,
  ) => {
    try {
      await copyNote(sourceNode, destinationNode);
      await removeNodeByPath(sourceNode.value.path);
      const newTreeNodes = await buildDirectoryTree(
        await join(hiveName, NOTES_PATH),
        ROOT_DIR,
      );
      setNodes(() => newTreeNodes);
    } catch (errors) {
      console.error("Error moving the note: ", errors);
      throw errors;
    }
  };

  return {
    nodes,
    setNodes,
    selectedNode,
    setSelectedNode,
    buildDirectoryTree,
    removeNodeByPath,
    addNewNode,
    searchFileTree,
    getJsonFiles,
    getTreeStatistics,
    initializeFileTree,
    saveNote,
    readNote,
    createNewNoteOrDir,
    renameNodeAndNoteOrDir,
    moveNote,
  };
};

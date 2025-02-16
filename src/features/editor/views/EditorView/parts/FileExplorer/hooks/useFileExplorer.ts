import { create, mkdir, readDir, remove } from "@tauri-apps/plugin-fs";
import { type BaseDirectory, join, sep } from "@tauri-apps/api/path";
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
  findNode,
} from "@/utils/treeHelpers";
import { EMPTY_NOTE } from "./index.preset";

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
    location: string,
    name: string,
    content?: TContent,
  ) => {
    if (!content) return;
    const fullPath = await join(location, name);
    const foundNode = findNode(nodes, (info) => info.path === fullPath);

    if (foundNode?.value.isFile) {
      await writeJson<TContent>(location, name, content, ROOT_DIR);
      return;
    }

    await createNewNoteOrDir(location, name, { isDirectory: false, content });
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
  };
};

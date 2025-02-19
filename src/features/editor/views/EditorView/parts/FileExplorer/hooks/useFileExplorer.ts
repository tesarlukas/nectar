import { copyFile, mkdir, remove, rename } from "@tauri-apps/plugin-fs";
import { join } from "@tauri-apps/api/path";
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
  changeNodeValues,
} from "@/utils/treeHelpers";
import { EMPTY_NOTE } from "../index.preset";
import { appendJson } from "@/utils/nodeHelpers";
import { buildDirectoryTree, createFileNode } from "../utils";

export interface FileInfo {
  name: string;
  path: string;
  dirPath: string;
  isDirectory: boolean;
  isSymLink: boolean;
  isFile: boolean;
}

// FileTreeNode now implements the generic TreeNode interface
export type FileTreeNode = TreeNode<FileInfo>;

export const useFileExplorer = () => {
  const [nodes, setNodes] = useState<FileTreeNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<FileTreeNode>();
  const hiveName = useHiveStore((state) => state.hiveName);

  const initializeFileTree = useCallback(async () => {
    const initPath = await join(hiveName, NOTES_PATH);
    const builtNodes = await buildDirectoryTree(initPath, ROOT_DIR);

    setNodes(builtNodes);
  }, [hiveName]);

  // checked, question is if it wouldn't be better to just build the whole tree
  // anew
  const addNewNode = useCallback(
    async <TContent>(
      location: string,
      nodeName: string,
      opts?: Partial<{ isDirectory: boolean; content: TContent }>,
    ): Promise<void> => {
      try {
        const defaultOpts = {
          isDirectory: false,
          content: EMPTY_NOTE as TContent,
        };
        const finalOpts = { ...defaultOpts, ...opts };

        const fullPath = await join(location, nodeName);

        const newFileInfo: FileInfo = {
          name: finalOpts.isDirectory ? nodeName : appendJson(nodeName),
          path: finalOpts.isDirectory ? fullPath : appendJson(fullPath),
          dirPath: location,
          isDirectory: finalOpts.isDirectory,
          isFile: !finalOpts.isDirectory,
          isSymLink: false,
        };

        await createNewNoteOrDir(location, nodeName, {
          isDirectory: finalOpts.isDirectory,
          content: finalOpts.isDirectory,
        });

        // synchronize with the tree structure
        const newNode = createFileNode(newFileInfo);
        setNodes((currentNodes) =>
          addNode(
            currentNodes,
            (info) => info.path === newNode.value.dirPath,
            newNode,
          ),
        );
      } catch (error) {
        console.error("Error adding node:", error);
      }
    },
    [],
  );

  const removeNodeByPath = useCallback(async (path: string): Promise<void> => {
    try {
      await remove(path, { baseDir: ROOT_DIR, recursive: true });

      setNodes((currentNodes) =>
        removeNode(currentNodes, (info) => info.path === path),
      );
    } catch (error) {
      console.error(`Error removing node at path ${path}:`, error);
    }
  }, []);

  // checked and is straightforward
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

  // straightforward
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
        changeNodeValues(
          currentNodes,
          (info) => info.name === node.value.name,
          {
            ...node.value,
            name: newName,
            path: newPath,
          },
        ),
      );
    },
    [],
  );

  /** The function does not modify the tree because it is used with move as well */
  const copyNote = async (node: FileTreeNode, targetNode: FileTreeNode) => {
    try {
      await copyFile(
        node.value.path,
        await join(targetNode.value.path, node.value.name),
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

  const moveNote = async (node: FileTreeNode, targetNode: FileTreeNode) => {
    if (
      node.value.path === (await join(targetNode.value.path, node.value.name))
    ) {
      return;
    }

    try {
      await copyNote(node, targetNode);
      await removeNodeByPath(node.value.path);
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

  // unused for now
  const searchFileTree = useCallback(
    (
      nodes: FileTreeNode[],
      searchTerm: string,
      options: { matchCase?: boolean } = {},
    ) => {
      return filterNodes(nodes, (info) => {
        const nodeName = options.matchCase
          ? info.name
          : info.name.toLowerCase();
        const term = options.matchCase ? searchTerm : searchTerm.toLowerCase();
        return nodeName.includes(term);
      });
    },
    [],
  );

  // unused for now
  const getJsonFiles = useCallback(() => {
    return filterNodes(
      nodes,
      (info) => info.isFile && info.name.endsWith(".json"),
    );
  }, [nodes]);

  // unused for now
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

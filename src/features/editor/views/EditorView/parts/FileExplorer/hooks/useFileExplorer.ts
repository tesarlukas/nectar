import { mkdir, readDir, remove } from "@tauri-apps/plugin-fs";
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
} from "@/utils/treeHelpers";
import { EMPTY_NOTE } from "./index.preset";

interface FileInfo {
  name: string;
  path: string;
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
    async (
      parentPath: string,
      nodeName: string,
      isDirectory: boolean,
    ): Promise<void> => {
      try {
        const fullPath = await join(parentPath, nodeName);

        const newFileInfo: FileInfo = {
          name: nodeName,
          path: fullPath,
          isDirectory,
          isFile: !isDirectory,
          isSymLink: false,
        };

        // Create the file/directory in the filesystem
        if (isDirectory) {
          console.log("adding directory at", fullPath);
          await mkdir(fullPath, { baseDir: ROOT_DIR, recursive: true });
          // Add directory creation logic here
        } else {
          console.log("adding note at", parentPath);
          //await addNewNote(parentPath.split(), nodeName)
        }

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

    console.log('builtNodes', builtNodes)
    setNodes(builtNodes);
  }, [hiveName, buildDirectoryTree]);

  const saveNote = async <TContent>(
    location: string[],
    name: string,
    content?: TContent,
  ) => {
    if (!content) return;

    await writeJson<TContent>(
      [hiveName, NOTES_PATH, ...location],
      name,
      content,
      ROOT_DIR,
    );
  };

  const readNote = async <TContent>(path: string) => {
    const noteContent = await readJson<TContent>(path, ROOT_DIR);

    return noteContent;
  };

  const addNewNote = async (location: string[], name: string) => {
    saveNote(location, name, EMPTY_NOTE);
  };

  return {
    nodes,
    setNodes,
    selectedNode,
    setSelectedNode,
    buildDirectoryTree,
    removeNodeByPath,
    addNode: addNewNode,
    searchFileTree,
    getJsonFiles,
    getTreeStatistics,
    initializeFileTree,
    saveNote,
    readNote,
    addNewNote,
  };
};

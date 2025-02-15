import { readDir, remove } from "@tauri-apps/plugin-fs";
import { type BaseDirectory, join } from "@tauri-apps/api/path";
import { ROOT_DIR } from "@/constants/rootDir";
import { useCallback, useState } from "react";
import type { FileTreeNode } from "../types";
import { readJson, writeJson } from "@/utils/jsonHelpers";
import { useHiveStore } from "@/stores/useHiveStore";
import { NOTES_PATH } from "@/constants/notesPath";

export const useFileExplorer = () => {
  const [nodes, setNodes] = useState<FileTreeNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<FileTreeNode>();
  const hiveName = useHiveStore((state) => state.hiveName);

  const buildDirectoryTree = useCallback(
    async (
      currentPath: string,
      baseDir: BaseDirectory = ROOT_DIR,
    ): Promise<FileTreeNode[]> => {
      try {
        // Read the current directory
        const entries = await readDir(currentPath, { baseDir });

        // Process each entry
        const nodes = await Promise.all(
          entries.map(async (entry) => {
            if (!entry.isDirectory && !entry.name.endsWith(".json")) {
              return null;
            }
            // Create the full path for this entry
            const fullPath = await join(currentPath, entry.name);

            // Create the node
            const node: FileTreeNode = {
              name: entry.name,
              path: fullPath,
              isDirectory: entry.isDirectory,
              isSymLink: entry.isSymlink,
              isFile: entry.isFile,
            };

            // If it's a directory, recursively get its children
            if (entry.isDirectory) {
              node.children = await buildDirectoryTree(fullPath, baseDir);
            }

            return node;
          }),
        );

        return nodes.filter((node) => node !== null);
      } catch (error) {
        console.error("Error building directory tree:", error);
        return [];
      }
    },
    [],
  );

  const readNote = async <TContent>(path: string) => {
    const noteContent = await readJson<TContent>(path, ROOT_DIR);

    return noteContent;
  };

  const saveNote = async <TContent>(content?: TContent) => {
    if (!content) return;

    await writeJson<TContent>(
      [hiveName, NOTES_PATH],
      "first_note",
      content,
      ROOT_DIR,
    );
  };

  const initializeFileTree = useCallback(async () => {
    const initPath = await join(hiveName, NOTES_PATH);

    const builtNodes = await buildDirectoryTree(initPath, ROOT_DIR);

    setNodes(builtNodes);
  }, [hiveName, setNodes, buildDirectoryTree]);

  const removeNode = useCallback(
    async (
      currentNodes: FileTreeNode[],
      path: string,
    ): Promise<FileTreeNode[]> => {
      const nodeIndex = currentNodes.findIndex((node) => node.path === path);

      // if the node under the specified path is in this level, then remove it
      // from both the filesystem and from the tree structure
      if (nodeIndex !== -1) {
        try {
          await remove(path, { baseDir: ROOT_DIR, recursive: true });

          return currentNodes.filter((_, index) => index !== nodeIndex);
        } catch (errors) {
          console.error(`Error removing node at path ${path}:`, errors);
        }
      }

      // if the node is not under the specified path, proceed recursively with
      // the children of the node
      return await Promise.all(
        currentNodes.map(async (node) => {
          if (node.isDirectory && node.children) {
            const updatedChildrenNodes = await removeNode(node.children, path);
            return {
              ...node,
              children: updatedChildrenNodes,
            };
          }

          return node;
        }),
      );
    },
    [nodes, setNodes],
  );

  return {
    nodes,
    setNodes,
    selectedNode,
    setSelectedNode,
    buildDirectoryTree,
    readNote,
    saveNote,
    removeNode,
    initializeFileTree,
  };
};

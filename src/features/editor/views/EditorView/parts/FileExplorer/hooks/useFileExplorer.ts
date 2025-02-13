import { readDir } from "@tauri-apps/plugin-fs";
import { type BaseDirectory, join } from "@tauri-apps/api/path";
import { ROOT_DIR } from "@/constants/rootDir";
import { useCallback } from "react";
import type { FileTreeNode } from "../types";

export const useFileExplorer = () => {
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

  return {
    buildDirectoryTree,
  };
};

import { readDir, type BaseDirectory } from "@tauri-apps/plugin-fs";
import type { FileInfo, FileTreeNode } from "../hooks/useFileExplorer";
import { ROOT_DIR } from "@/constants/rootDir";
import { join } from "@tauri-apps/api/path";

export const createFileNode = (
  info: FileInfo,
  children: FileTreeNode[] = [],
): FileTreeNode => ({
  value: info,
  children,
});

export const buildDirectoryTree = async (
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
};

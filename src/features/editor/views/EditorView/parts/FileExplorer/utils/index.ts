import { exists, readDir, type BaseDirectory } from "@tauri-apps/plugin-fs";
import type { FileInfo, FileTreeNode } from "../hooks/useFileExplorer";
import { ROOT_DIR } from "@/constants/rootDir";
import { join } from "@tauri-apps/api/path";
import { nanoid } from "nanoid";
import { appendJson, stripJson } from "@/utils/nodeHelpers";

export const createFileNode = (
  info: FileInfo,
  children: FileTreeNode[] = [],
): FileTreeNode => {
  const nodeId = nanoid();

  return {
    nodeId: nodeId,
    value: info,
    children,
  };
};

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

export const getNewUniqueFilePath = async (
  location: string,
  name: string,
  attempt = 1,
): Promise<string> => {
  const fullPath = await join(location, name);

  if (await exists(fullPath, { baseDir: ROOT_DIR })) {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const match = stripJson(name)!.match(/^(.*?)(?:\s*\((\d+)\))?$/);

    if (match) {
      const baseName = match[1].trim();
      const currentNumber = match[2] ? Number.parseInt(match[2], 10) : 0;
      const nextNumber = currentNumber + 1;
      // NOTE: thanks to this here the attempt does not really matter but whatever
      const newName = appendJson(`${baseName} (${nextNumber})`);
      return getNewUniqueFilePath(location, newName, attempt + 1);
    }

    const newName = appendJson(`${stripJson(name)} (${attempt})`);
    return getNewUniqueFilePath(location, newName, attempt + 1);
  }
  return fullPath;
};

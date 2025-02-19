import type { FileTreeNode } from "@/features/editor/views/EditorView/parts/FileExplorer/hooks/useFileExplorer";

export const appendJson = (value: string) => {
  return value.endsWith(".json") ? value : `${value}.json`;
};

export const stripJson = (value?: string) => {
  return value?.substring(0, value.lastIndexOf("."));
};

/** HOF */
export const sortNodes = (sortOrder: "asc" | "desc") => {
  return (node1: FileTreeNode, node2: FileTreeNode) => {
    // Directories first
    if (node1.value.isDirectory && !node2.value.isDirectory) return -1;
    if (!node1.value.isDirectory && node2.value.isDirectory) return 1;

    // Alphabetical or Reverse Alphabetical order based on sortOrder
    const comparison = node1.value.name.localeCompare(node2.value.name);
    return sortOrder === "asc" ? comparison : -comparison;
  };
};

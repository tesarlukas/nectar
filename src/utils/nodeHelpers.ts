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
    // Primary criterion: directories always come before files
    if (node1.value.isDirectory !== node2.value.isDirectory) {
      return node1.value.isDirectory ? -1 : 1;
    }

    // Secondary criterion: alphabetical sort within each group
    const comparison = node1.value.name.localeCompare(node2.value.name);
    return sortOrder === "asc" ? comparison : -comparison;
  };
};

/**
 * Sorts FileTreeNode array by explicitly separating directories and files
 * Directories are always placed before files, with both groups sorted alphabetically
 * @param nodes The array of FileTreeNode to sort
 * @param sortOrder The sort direction, either 'asc' for ascending or 'desc' for descending
 * @returns The sorted array
 */
export const sortFileTreeNodes = (
  nodes: FileTreeNode[],
  sortOrder: "asc" | "desc" = "asc",
): FileTreeNode[] => {
  // Split nodes into directories and files
  const directories: FileTreeNode[] = [];
  const files: FileTreeNode[] = [];

  // Categorize each node
  nodes.forEach((node) => {
    if (node.value.isDirectory) {
      directories.push(node);
    } else {
      files.push(node);
    }
  });

  // Sort directories alphabetically
  const sortedDirectories = directories.sort((a, b) => {
    const nameA = a.value.name.toLowerCase();
    const nameB = b.value.name.toLowerCase();
    return sortOrder === "asc"
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  });

  // Sort files alphabetically
  const sortedFiles = files.sort((a, b) => {
    const nameA = a.value.name.toLowerCase();
    const nameB = b.value.name.toLowerCase();
    return sortOrder === "asc"
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  });

  // Combine sorted directories and files, with directories first
  return [...sortedDirectories, ...sortedFiles];
};

/**
 * Recursively sorts a file tree with directories always before files
 * @param nodes The array of FileTreeNode to sort
 * @param sortOrder The sort direction, either 'asc' for ascending or 'desc' for descending
 * @returns The sorted array with sorted children
 */
export const sortFileTreeRecursive = (
  nodes: FileTreeNode[],
  sortOrder: "asc" | "desc" = "asc",
): FileTreeNode[] => {
  // First sort the current level
  const sortedNodes = sortFileTreeNodes(nodes, sortOrder);

  // Then recursively sort children of each node
  return sortedNodes.map((node) => {
    if (node.children && node.children.length > 0) {
      return {
        ...node,
        children: sortFileTreeRecursive(node.children, sortOrder),
      };
    }
    return node;
  });
};

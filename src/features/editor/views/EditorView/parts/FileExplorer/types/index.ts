export interface FileTreeNode {
  name: string;
  path: string;
  isDirectory: boolean;
  isFile: boolean;
  isSymLink: boolean;
  children?: FileTreeNode[];
}

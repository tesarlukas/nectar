import {
  FileExplorerNode,
  type FileExplorerNodeProps,
} from "./parts/FileExplorerNode";
import { FileExplorerToolbar } from "./parts/FileExplorerToolbar";
import type { FileTreeNode } from "./types";

interface FileExplorerProps
  extends Pick<FileExplorerNodeProps, "onDelete" | "onNodeClick">,
    Pick<FileExplorerToolbar, "onRefresh"> {
  nodes: FileTreeNode[];
  selectedNode?: FileTreeNode;
}

export const FileExplorer = ({
  nodes,
  selectedNode,
  onNodeClick,
  onDelete,
  onRefresh,
}: FileExplorerProps) => {
  return (
    <div className="h-full p-2">
      <FileExplorerToolbar onRefresh={onRefresh} />
      {nodes.map((node) => (
        <FileExplorerNode
          key={node.path}
          node={node}
          onNodeClick={onNodeClick}
          selectedPath={selectedNode?.path}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

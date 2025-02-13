import { FileExplorerNode } from "./parts/FileExplorerNode";
import type { FileTreeNode } from "./types";

interface FileExplorerProps {
  nodes: FileTreeNode[];
  selectedNode?: FileTreeNode;
  onNodeClick: (node: FileTreeNode) => void;
}

export const FileExplorer = ({
  nodes,
  selectedNode,
  onNodeClick,
}: FileExplorerProps) => {
  return (
    <div className="h-full p-2">
      {nodes.map((node) => (
        <FileExplorerNode
          key={node.path}
          node={node}
          onNodeClick={onNodeClick}
          selectedPath={selectedNode?.path}
        />
      ))}
    </div>
  );
};

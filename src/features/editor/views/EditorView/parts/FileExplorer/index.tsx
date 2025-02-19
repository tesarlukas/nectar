import {
  FileExplorerNode,
  type FileExplorerNodeProps,
} from "./parts/FileExplorerNode";
import { FileExplorerToolbar } from "./parts/FileExplorerToolbar";
import type { FileTreeNode } from "./hooks/useFileExplorer";

interface FileExplorerProps
  extends Pick<
      FileExplorerNodeProps,
      "onDelete" | "onNodeClick" | "onCreateFile" | "onCreateDir" | "onRename" | "onMove"
    >,
    Pick<FileExplorerToolbar, "onRefresh"> {
  nodes: FileTreeNode[];
  selectedNode?: FileTreeNode;
}

export const FileExplorer = ({
  nodes,
  selectedNode,
  onNodeClick,
  onRename,
  onDelete,
  onRefresh,
  onCreateFile,
  onCreateDir,
  onMove,
}: FileExplorerProps) => {
  return (
    <div className="h-full p-2">
      <FileExplorerToolbar onRefresh={onRefresh} />
      {nodes.map((node) => (
        <FileExplorerNode
          key={node.value.path}
          node={node}
          selectedPath={selectedNode?.value.path}
          onNodeClick={onNodeClick}
          onRename={onRename}
          onDelete={onDelete}
          onCreateFile={onCreateFile}
          onCreateDir={onCreateDir}
          onMove={onMove}
        />
      ))}
    </div>
  );
};

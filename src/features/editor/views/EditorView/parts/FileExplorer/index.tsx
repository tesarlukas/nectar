import {
  FileExplorerNode,
  type FileExplorerNodeProps,
} from "./parts/FileExplorerNode";
import { FileExplorerToolbar } from "./parts/FileExplorerToolbar";
import type { FileTreeNode } from "./hooks/useFileExplorer";

interface FileExplorerProps
  extends Pick<
      FileExplorerNodeProps,
      "onDelete" | "onNodeClick" | "onCreateFile" | "onCreateDir"
    >,
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
  onCreateFile,
  onCreateDir,
}: FileExplorerProps) => {
  return (
    <div className="h-full p-2">
      <FileExplorerToolbar onRefresh={onRefresh} />
      {nodes.map((node) => (
        <FileExplorerNode
          key={node.value.path}
          node={node}
          onNodeClick={onNodeClick}
          selectedPath={selectedNode?.value.path}
          onDelete={onDelete}
          onCreateFile={onCreateFile}
          onCreateDir={onCreateDir}
        />
      ))}
    </div>
  );
};

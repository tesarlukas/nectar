import { useState, useEffect } from "react";
import { useFileExplorer } from "./hooks/useFileExplorer";
import { FileExplorerNode } from "./parts/FileExplorerNode";
import type { FileTreeNode } from "./types";
import { join } from "@tauri-apps/api/path";
import { NOTES_PATH } from "@/constants/notesPath";
import { useHiveStore } from "@/stores/useHiveStore";
import { ROOT_DIR } from "@/constants/rootDir";

interface FileExplorerProps {
  onNoteClick?: (path: string) => void;
}

export const FileExplorer = ({ onNoteClick }: FileExplorerProps) => {
  const hiveName = useHiveStore((state) => state.hiveName);
  const [nodes, setNodes] = useState<FileTreeNode[]>([]);
  const { buildDirectoryTree, readNote } = useFileExplorer();
  const [selectedNode, setSelectedNode] = useState<FileTreeNode>();

  const handleOnNodeClick = async (node: FileTreeNode) => {
    setSelectedNode(node);
    if (node.isFile) {
      const noteContent = await readNote(node.path);
      onNoteClick?.(noteContent);
    }
  };

  useEffect(() => {
    const initializeFileTree = async () => {
      const initPath = await join(hiveName, NOTES_PATH);

      const builtNodes = await buildDirectoryTree(initPath, ROOT_DIR);

      setNodes(builtNodes);
    };

    initializeFileTree();
  }, []);

  return (
    <div className="h-full p-2">
      {nodes.map((node) => (
        <FileExplorerNode
          key={node.path}
          node={node}
          onNodeClick={handleOnNodeClick}
          selectedPath={selectedNode?.path}
        />
      ))}
    </div>
  );
};

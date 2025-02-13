import { useState, useEffect } from "react";
import { useFileExplorer } from "./hooks/useFileExplorer";
import { FileExplorerNode } from "./parts/FileExplorerNode";
import type { FileTreeNode } from "./types";
import { join } from "@tauri-apps/api/path";
import { NOTES_PATH } from "@/constants/notesPath";
import { useHiveStore } from "@/stores/useHiveStore";
import { ROOT_DIR } from "@/constants/rootDir";

export const FileExplorer = () => {
  const hiveName = useHiveStore((state) => state.hiveName);
  const [nodes, setNodes] = useState<FileTreeNode[]>([]);
  const { buildDirectoryTree } = useFileExplorer();
  const [selectedPath, setSelectedPath] = useState<string>();

  const handleOnNodeClick = (node: FileTreeNode) => {
    setSelectedPath(node.path);
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
    <div className="h-full p-4">
      <span className="font-semibold">
        {nodes.map((node) => (
          <FileExplorerNode
            key={node.path}
            node={node}
            onNodeClick={handleOnNodeClick}
            selectedPath={selectedPath}
          />
        ))}
      </span>
    </div>
  );
};

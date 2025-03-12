import {
  FileExplorerNode,
  type FileExplorerNodeProps,
} from "./parts/FileExplorerNode";
import { FileExplorerToolbar } from "./parts/FileExplorerToolbar";
import type { FileTreeNode } from "./hooks/useFileExplorer";
import { forwardRef, useCallback, useMemo, useState } from "react";
import { NOTES_PATH } from "@/constants/notesPath";
import { sortNodes } from "@/utils/nodeHelpers";

interface FileExplorerProps
  extends Pick<
      FileExplorerNodeProps,
      | "onDelete"
      | "onNodeClick"
      | "onCreateFile"
      | "onCreateDir"
      | "onRename"
      | "onMove"
    >,
    Pick<FileExplorerToolbar, "onRefresh"> {
  nodes: FileTreeNode[];
  selectedNode?: FileTreeNode;
}

export const FileExplorer = forwardRef<HTMLDivElement, FileExplorerProps>(
  (
    {
      nodes,
      selectedNode,
      onNodeClick,
      onRename,
      onDelete,
      onRefresh,
      onCreateFile,
      onCreateDir,
      onMove,
    }: FileExplorerProps,
    ref,
  ) => {
    const notesNode = useMemo(
      () => nodes.filter((node) => node.value.name === NOTES_PATH)[0],
      [nodes],
    );

    const onCreateFileToolbar = (_: FileTreeNode, name: string) => {
      onCreateFile?.(notesNode, name);
    };

    const onCreateDirToolbar = (_: FileTreeNode, name: string) => {
      onCreateDir?.(notesNode, name);
    };

    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const renderNodes = useCallback(() => {
      return (notesNode?.children ?? [])
        .sort(sortNodes(sortOrder))
        .map((node) => (
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
        ));
    }, [notesNode, sortOrder, selectedNode]);

    return (
      <div className="h-full p-2" ref={ref} tabIndex={-1}>
        <FileExplorerToolbar
          notesNode={notesNode}
          onRefresh={onRefresh}
          onCreateFile={onCreateFileToolbar}
          onCreateDir={onCreateDirToolbar}
          sortOrder={sortOrder}
          onToggleSortOrder={() =>
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
          }
        />
        {renderNodes()}
      </div>
    );
  },
);

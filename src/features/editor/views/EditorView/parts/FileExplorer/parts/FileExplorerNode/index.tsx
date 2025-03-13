import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FileText,
  Copy,
  Trash,
  FileEdit,
  FilePlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import type { FileTreeNode } from "../../hooks/useFileExplorer";
import { CreateNodeInput, RenameNodeInput } from "../NodeInput";

export interface FileExplorerNodeProps {
  node: FileTreeNode;
  depth?: number;
  onNodeClick?: (node: FileTreeNode) => void;
  selectedPath?: string;
  onRename?: (node: FileTreeNode, name: string) => void;
  onDelete?: (node: FileTreeNode) => void;
  onCopy?: (node: FileTreeNode) => void;
  onCreateFile?: (parentNode: FileTreeNode, name: string) => void;
  onCreateDir?: (parentNode: FileTreeNode, name: string) => void;
  onMove?: (node: FileTreeNode, targetNode: FileTreeNode) => void;
}

export const FileExplorerNode = ({
  node,
  depth = 0,
  onNodeClick,
  selectedPath,
  onRename,
  onDelete,
  onCopy,
  onCreateFile,
  onCreateDir,
  onMove,
}: FileExplorerNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren =
    node.value.isDirectory && node.children && node.children.length > 0;
  const isSelected = node.value.path === selectedPath;

  const [createInput, setCreateInput] = useState<{
    isOpen: boolean;
    type: "file" | "directory";
  } | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isDropTarget, setIsDropTarget] = useState(false);

  const handleMainClick = (e: React.MouseEvent) => {
    // Only handle main click if it's not right click
    if (e.button !== 2) {
      if (hasChildren) {
        setIsExpanded(!isExpanded);
      }
      onNodeClick?.(node);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();

    // forbid moving directories
    if (node.value.isDirectory) return;

    setIsDragging(true);

    // store the source node
    e.dataTransfer.setData("application/json", JSON.stringify(node));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Only allow dropping into directories
    if (node.value.isDirectory) {
      setIsDropTarget(true);
      // Expand folder after hovering for a short time
      if (!isExpanded) {
        const expandTimeout = setTimeout(() => setIsExpanded(true), 800);
        return () => clearTimeout(expandTimeout);
      }
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropTarget(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropTarget(false);

    // obtain the source node
    const sourceNode = JSON.parse(e.dataTransfer.getData("application/json"));

    onMove?.(sourceNode, node);
  };

  const [isRenaming, setIsRenaming] = useState(false);

  return (
    <div>
      <ContextMenu>
        <ContextMenuTrigger>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-full justify-start px-2 hover:bg-muted text-lg relative focus:bg-highlight",
              isSelected && "bg-muted",
              depth > 0 && "ml-4",
              isDragging && "opacity-50",
              isDropTarget && "bg-blue-100 dark:bg-blue-900",
            )}
            onClick={handleMainClick}
            draggable
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragEnd={() => setIsDragging(false)}
          >
            <div className="flex items-center w-full">
              {hasChildren ? (
                <div className="mr-1">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
              ) : (
                <div className="w-5" />
              )}
              {node.value.isDirectory ? (
                <Folder className="h-4 w-4 mr-2 text-blue-500" />
              ) : (
                <FileText className="h-4 w-4 mr-2 text-gray-500" />
              )}
              <span className="truncate">
                {node.value.isFile
                  ? node.value.name.substring(
                      0,
                      node.value.name.lastIndexOf("."),
                    )
                  : node.value.name}
              </span>
            </div>
          </Button>
          {isRenaming && (
            <RenameNodeInput
              type="file"
              node={node}
              depth={depth}
              onClose={() => setIsRenaming(false)}
              onRename={onRename}
            />
          )}

          {createInput && (
            <CreateNodeInput
              type={createInput.type}
              parentNode={node}
              depth={depth}
              onClose={() => setCreateInput(null)}
              onCreateFile={onCreateFile}
              onCreateDir={onCreateDir}
            />
          )}
        </ContextMenuTrigger>

        <ContextMenuContent
          className="w-48 text-xl"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {node.value.isDirectory && (
            <>
              <ContextMenuItem
                className="text-base"
                onClick={() => {
                  setCreateInput({
                    isOpen: true,
                    type: "file",
                  });
                }}
              >
                <FilePlus className="mr-2 h-4 w-4" />
                New File
              </ContextMenuItem>

              <ContextMenuItem
                className="text-base"
                onClick={() => {
                  setCreateInput({
                    isOpen: true,
                    type: "directory",
                  });
                }}
              >
                <FilePlus className="mr-2 h-4 w-4" />
                New Folder
              </ContextMenuItem>
              <ContextMenuSeparator />
            </>
          )}
          <ContextMenuItem
            className="text-base"
            onClick={() => setIsRenaming(true)}
          >
            <FileEdit className="mr-2 h-4 w-4" />
            Rename
          </ContextMenuItem>
          <ContextMenuItem className="text-base" onClick={() => onCopy?.(node)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            className="text-destructive text-base font-bold data-[highlighted]:bg-destructive"
            onClick={() => onDelete?.(node)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {isExpanded && hasChildren && (
        <div className="pl-2">
          {node.children?.map((childNode) => (
            <FileExplorerNode
              key={childNode.value.path}
              node={childNode}
              depth={depth + 1}
              onNodeClick={onNodeClick}
              selectedPath={selectedPath}
              onRename={onRename}
              onDelete={onDelete}
              onCopy={onCopy}
              onCreateFile={onCreateFile}
              onCreateDir={onCreateDir}
              onMove={onMove}
            />
          ))}
        </div>
      )}
    </div>
  );
};

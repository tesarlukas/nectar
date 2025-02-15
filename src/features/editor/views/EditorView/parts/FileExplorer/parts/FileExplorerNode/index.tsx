import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FileText,
  Copy,
  Trash,
  FileEdit,
  FolderPlus,
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
import type { FileTreeNode } from "../../types";

export interface FileExplorerNodeProps {
  node: FileTreeNode;
  depth?: number;
  onNodeClick?: (node: FileTreeNode) => void;
  selectedPath?: string;
  onRename?: (node: FileTreeNode) => void;
  onDelete?: (node: FileTreeNode) => void;
  onCopy?: (node: FileTreeNode) => void;
  onCreateFile?: (parentNode: FileTreeNode) => void;
  onCreateFolder?: (parentNode: FileTreeNode) => void;
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
  onCreateFolder,
}: FileExplorerNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren =
    node.isDirectory && node.children && node.children.length > 0;
  const isSelected = node.path === selectedPath;

  const handleMainClick = (e: React.MouseEvent) => {
    // Only handle main click if it's not right click
    if (e.button !== 2) {
      if (hasChildren) {
        setIsExpanded(!isExpanded);
      }
      onNodeClick?.(node);
    }
  };

  return (
    <div>
      <ContextMenu>
        <ContextMenuTrigger>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-full justify-start px-2 hover:bg-muted",
              isSelected && "bg-muted",
              depth > 0 && "ml-4",
            )}
            onClick={handleMainClick}
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
              {node.isDirectory ? (
                <Folder className="h-4 w-4 mr-2 text-blue-500" />
              ) : (
                <FileText className="h-4 w-4 mr-2 text-gray-500" />
              )}
              <span className="truncate text-base">
                {node.isFile
                  ? node.name.substring(0, node.name.lastIndexOf("."))
                  : node.name}
              </span>
            </div>
          </Button>
        </ContextMenuTrigger>

        <ContextMenuContent className="w-48 text-xl">
          {node.isDirectory && (
            <>
              <ContextMenuItem
                className="text-base"
                onClick={() => onCreateFile?.(node)}
              >
                <FilePlus className="mr-2 h-4 w-4" />
                New File
              </ContextMenuItem>
              <ContextMenuItem
                className="text-base"
                onClick={() => onCreateFolder?.(node)}
              >
                <FolderPlus className="mr-2 h-4 w-4" />
                New Folder
              </ContextMenuItem>
              <ContextMenuSeparator />
            </>
          )}
          <ContextMenuItem
            className="text-base"
            onClick={() => onRename?.(node)}
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
              key={childNode.path}
              node={childNode}
              depth={depth + 1}
              onNodeClick={onNodeClick}
              selectedPath={selectedPath}
              onRename={onRename}
              onDelete={onDelete}
              onCopy={onCopy}
              onCreateFile={onCreateFile}
              onCreateFolder={onCreateFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
};

import { useEffect, useState } from "react";
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
import type { FileTreeNode } from "../../hooks/useFileExplorer";
import { CreateNodeInput } from "../CreateNodeInput";

export interface FileExplorerNodeProps {
  node: FileTreeNode;
  depth?: number;
  onNodeClick?: (node: FileTreeNode) => void;
  selectedPath?: string;
  onRename?: (node: FileTreeNode) => void;
  onDelete?: (node: FileTreeNode) => void;
  onCopy?: (node: FileTreeNode) => void;
  onCreateFile?: (parentNode: FileTreeNode, name: string) => void;
  onCreateDir?: (parentNode: FileTreeNode, name: string) => void;
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
}: FileExplorerNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren =
    node.value.isDirectory && node.children && node.children.length > 0;
  const isSelected = node.value.path === selectedPath;

  const [createInput, setCreateInput] = useState<{
    isOpen: boolean;
    type: "file" | "directory";
  } | null>(null);

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
              "h-8 w-full justify-start px-2 hover:bg-muted text-lg relative",
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

import { useState } from "react";
import { ChevronRight, ChevronDown, Folder, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { FileTreeNode } from "../../types";

interface FileExplorerNodeProps {
  node: FileTreeNode;
  depth?: number;
  onNodeClick?: (node: FileTreeNode) => void;
  selectedPath?: string;
}

export const FileExplorerNode = ({
  node,
  depth = 0,
  onNodeClick,
  selectedPath,
}: FileExplorerNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren =
    node.isDirectory && node.children && node.children.length > 0;
  const isSelected = node.path === selectedPath;

  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 w-full justify-start px-2 hover:bg-muted",
          isSelected && "bg-muted",
          depth > 0 && "ml-4",
        )}
        onClick={() => {
          if (hasChildren) {
            setIsExpanded(!isExpanded);
          }
          onNodeClick?.(node);
        }}
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
            <div className="w-5" /> // Spacer for alignment
          )}

          {node.isDirectory ? (
            <Folder className="h-4 w-4 mr-2 text-blue-500" />
          ) : (
            <FileText className="h-4 w-4 mr-2 text-gray-500" />
          )}

          <span className="truncate text-lg">{node.name}</span>
        </div>
      </Button>

      {isExpanded && hasChildren && (
        <div className="pl-2">
          {node.children?.map((childNode) => (
            <FileExplorerNode
              key={childNode.path}
              node={childNode}
              depth={depth + 1}
              onNodeClick={onNodeClick}
              selectedPath={selectedPath}
            />
          ))}
        </div>
      )}
    </div>
  );
};

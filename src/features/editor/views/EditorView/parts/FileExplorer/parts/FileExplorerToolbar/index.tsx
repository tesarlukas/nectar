import {
  FilePlus,
  FolderPlus,
  RefreshCcw,
  SortAsc,
  SortDesc,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import type { FileTreeNode } from "../../hooks/useFileExplorer";
import { forwardRef, useState } from "react";
import { CreateNodeInput, FilterNodeInput } from "../NodeInput";
import { useShortcuts } from "@/features/shortcuts/hooks/useShortcuts";
import { ActionId } from "@/features/events/eventEmitter";
import { cn } from "@/lib/utils";
import { useEventListener } from "@/features/events/hooks/useEventListener";

export interface FileExplorerToolbar {
  notesNode: FileTreeNode;
  onRefresh: () => Promise<void>;
  onCreateFile?: (parentNode: FileTreeNode, name: string) => void;
  onCreateDir?: (parentNode: FileTreeNode, name: string) => void;
  sortOrder: "asc" | "desc";
  onToggleSortOrder: () => void;
  onFilter?: (query: string) => void;
  isFilterQuery: boolean;
  setFilterQuery: (query: string) => void;
}

export const FileExplorerToolbar = forwardRef<
  HTMLDivElement,
  FileExplorerToolbar
>(
  (
    {
      notesNode,
      onRefresh,
      onCreateFile,
      onCreateDir,
      sortOrder,
      onToggleSortOrder,
      onFilter,
      isFilterQuery,
      setFilterQuery,
    }: FileExplorerToolbar,
    ref,
  ) => {
    const [input, setInput] = useState<{
      isOpen: boolean;
      type: "file" | "directory" | "filter";
    } | null>(null);

    const handleCreateInput = (type: "file" | "directory" | "filter") => {
      setInput({
        isOpen: true,
        type,
      });
    };

    const isToolbarFocused = () => {
      const element = ref as React.RefObject<HTMLDivElement>;
      return document.activeElement === element.current;
    };

    useShortcuts(ActionId.CreateNewNote, () => handleCreateInput("file"), {
      enabled: isToolbarFocused,
    });
    useShortcuts(ActionId.CreateNewDir, () => handleCreateInput("directory"), {
      enabled: isToolbarFocused,
    });
    useShortcuts(ActionId.RefreshExplorer, () => onRefresh?.(), {
      enabled: isToolbarFocused,
    });
    useShortcuts(ActionId.ToggleSortOrder, () => onToggleSortOrder?.(), {
      enabled: isToolbarFocused,
    });
    useEventListener(ActionId.FilterNodes, () =>
      setInput({ type: "filter", isOpen: true }),
    );

    return (
      <>
        <div
          className="w-full border-b flex items-center gap-x-2 bg-background focus:bg-highlight py-1 px-2"
          // biome-ignore lint/a11y/noNoninteractiveTabindex: there is a need for this div to be interactive
          tabIndex={0}
          ref={ref}
        >
          {/* Left section - Actions */}
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      setInput({
                        isOpen: true,
                        type: "file",
                      })
                    }
                    tabIndex={-1}
                  >
                    <FilePlus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>New File</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      setInput({
                        isOpen: true,
                        type: "directory",
                      })
                    }
                    tabIndex={-1}
                  >
                    <FolderPlus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>New Folder</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-8 w-8", isFilterQuery && "bg-highlight")}
                    onClick={() => {
                      if (isFilterQuery) {
                        setFilterQuery("");
                      } else {
                        setInput({
                          type: "filter",
                          isOpen: true,
                        });
                      }
                    }}
                    tabIndex={-1}
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Filter Files</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={onRefresh}
                    tabIndex={-1}
                  >
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Refresh</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={onToggleSortOrder}
                    tabIndex={-1}
                  >
                    {sortOrder === "asc" ? (
                      <SortAsc className="h-4 w-4" />
                    ) : (
                      <SortDesc className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Sort Files</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Center section - Search */}
          {/*
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            className="pl-8 h-8"
          />
        </div>
      </div>
      */}

          {/* Right section - View toggle */}
          {/*
      <ToggleGroup type="single" defaultValue="list">
        <ToggleGroupItem value="grid" size="sm" className="h-8 w-8">
          <Grid className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="list" size="sm" className="h-8 w-8">
          <List className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
      */}
        </div>

        {input && input.type !== "filter" && (
          <CreateNodeInput
            type={input.type}
            parentNode={notesNode}
            depth={0}
            onClose={() => setInput(null)}
            onCreateFile={onCreateFile}
            onCreateDir={onCreateDir}
          />
        )}

        {input && input.type === "filter" && (
          <FilterNodeInput
            depth={0}
            onClose={() => setInput(null)}
            onFilter={onFilter}
          />
        )}
      </>
    );
  },
);

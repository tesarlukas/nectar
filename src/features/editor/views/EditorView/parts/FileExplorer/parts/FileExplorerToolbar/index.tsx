import {
  FilePlus,
  RefreshCcw,
  //Search,
  SortAsc,
  //Grid,
  //List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
//import { Input } from "@/components/ui/input";
//import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

export interface FileExplorerToolbar {
  onRefresh: () => Promise<void>;
}

export const FileExplorerToolbar = ({ onRefresh }: FileExplorerToolbar) => {
  return (
    <div className="w-full border-b p-2 flex items-center gap-2 bg-background">
      {/* Left section - Actions */}
      <div className="flex items-center gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
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
                onClick={onRefresh}
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Refresh</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <SortAsc className="h-4 w-4" />
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
  );
};

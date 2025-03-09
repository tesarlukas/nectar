import { useState, useCallback } from "react";
import { Search, Replace, ArrowUpDown, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

// Define search options interface
interface SearchOptions {
  matchCase: boolean;
  wholeWord: boolean;
  useRegex: boolean;
}

// Define search params interface
interface SearchParams {
  term: string;
  options: SearchOptions;
}

// Define replace params interface
interface ReplaceParams {
  searchTerm: string;
  replaceTerm: string;
  options: SearchOptions;
}

// Component props interface
interface SearchReplaceComponentProps {
  onSearch?: (params: SearchParams) => void;
  onReplace?: (params: ReplaceParams) => void;
  onReplaceAll?: (params: ReplaceParams) => void;
  onNext?: (params: SearchParams) => void;
  onPrevious?: (params: SearchParams) => void;
  totalMatches?: number;
  currentMatch?: number;
  className?: string;
}

export const SearchReplaceComponent = ({
  onSearch,
  onReplace,
  onReplaceAll,
  onNext,
  onPrevious,
  totalMatches = 0,
  currentMatch = 0,
  className = "",
}: SearchReplaceComponentProps) => {
  // State for search and replace
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [replaceTerm, setReplaceTerm] = useState<string>("");
  const [showReplace, setShowReplace] = useState<boolean>(false);
  const [advancedOpen, setAdvancedOpen] = useState<boolean>(false);

  // Search options
  const [matchCase, setMatchCase] = useState<boolean>(false);
  const [wholeWord, setWholeWord] = useState<boolean>(false);
  const [useRegex, setUseRegex] = useState<boolean>(false);

  // Handle search
  const handleSearch = useCallback(() => {
    if (!searchTerm) return;

    onSearch?.({
      term: searchTerm,
      options: {
        matchCase,
        wholeWord,
        useRegex,
      },
    });
  }, [searchTerm, matchCase, wholeWord, useRegex, onSearch]);

  // Handle next/previous match
  const handleNext = useCallback(() => {
    onNext?.({
      term: searchTerm,
      options: {
        matchCase,
        wholeWord,
        useRegex,
      },
    });
  }, [searchTerm, matchCase, wholeWord, useRegex, onNext]);

  const handlePrevious = useCallback(() => {
    onPrevious?.({
      term: searchTerm,
      options: {
        matchCase,
        wholeWord,
        useRegex,
      },
    });
  }, [searchTerm, matchCase, wholeWord, useRegex, onPrevious]);

  // Handle replace
  const handleReplace = useCallback(() => {
    onReplace?.({
      searchTerm,
      replaceTerm,
      options: {
        matchCase,
        wholeWord,
        useRegex,
      },
    });
  }, [searchTerm, replaceTerm, matchCase, wholeWord, useRegex, onReplace]);

  // Handle replace all
  const handleReplaceAll = useCallback(() => {
    onReplaceAll?.({
      searchTerm,
      replaceTerm,
      options: {
        matchCase,
        wholeWord,
        useRegex,
      },
    });
  }, [searchTerm, replaceTerm, matchCase, wholeWord, useRegex, onReplaceAll]);

  // Search on Enter key
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Replace on Enter key
  const handleReplaceKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleReplace();
    }
  };

  return (
    <div
      className={`p-4 border rounded-lg shadow-sm bg-background ${className}`}
    >
      <div className="space-y-3">
        {/* Search section */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
              onKeyDown={handleSearchKeyDown}
              placeholder="Search"
              className="pl-8"
            />
          </div>

          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={handlePrevious}
              disabled={!searchTerm || totalMatches === 0}
              title="Previous match"
            >
              <ArrowUpDown className="h-4 w-4 rotate-90" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={handleNext}
              disabled={!searchTerm || totalMatches === 0}
              title="Next match"
            >
              <ArrowUpDown className="h-4 w-4 -rotate-90" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReplace(!showReplace)}
            >
              {showReplace ? "Hide Replace" : "Replace"}
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={handleSearch}
              disabled={!searchTerm}
            >
              Search
            </Button>
          </div>
        </div>

        {/* Match count indicator */}
        {totalMatches > 0 && (
          <div className="text-xs text-muted-foreground flex justify-between items-center">
            <Badge variant="secondary" className="font-normal">
              {currentMatch} of {totalMatches} matches
            </Badge>
          </div>
        )}

        {/* Replace section */}
        {showReplace && (
          <div className="flex items-center gap-2 mt-2">
            <div className="relative flex-1">
              <Replace className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                value={replaceTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setReplaceTerm(e.target.value)
                }
                onKeyDown={handleReplaceKeyDown}
                placeholder="Replace with"
                className="pl-8"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleReplace}
              disabled={!searchTerm || totalMatches === 0}
            >
              Replace
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleReplaceAll}
              disabled={!searchTerm || totalMatches === 0}
            >
              Replace All
            </Button>
          </div>
        )}

        {/* Advanced options */}
        <Collapsible
          open={advancedOpen}
          onOpenChange={setAdvancedOpen}
          className="mt-2"
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex w-full justify-between p-2 h-auto"
            >
              <span className="text-xs">Advanced Options</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${advancedOpen ? "rotate-180" : ""}`}
              />
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="pt-2">
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="matchCase"
                  checked={matchCase}
                  onCheckedChange={(checked: boolean | "indeterminate") =>
                    setMatchCase(checked === true)
                  }
                />
                <label htmlFor="matchCase" className="text-sm cursor-pointer">
                  Match case
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="wholeWord"
                  checked={wholeWord}
                  onCheckedChange={(checked: boolean | "indeterminate") =>
                    setWholeWord(checked === true)
                  }
                />
                <label htmlFor="wholeWord" className="text-sm cursor-pointer">
                  Whole word
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="useRegex"
                  checked={useRegex}
                  onCheckedChange={(checked: boolean | "indeterminate") =>
                    setUseRegex(checked === true)
                  }
                />
                <label htmlFor="useRegex" className="text-sm cursor-pointer">
                  Use regex
                </label>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

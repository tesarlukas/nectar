import { useState, useCallback, useEffect, useRef } from "react";
import { Search, Replace, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import { Typography } from "@/components/Typography";
import { useTranslation } from "react-i18next";
import type { Editor } from "@tiptap/react";
import { useEventEmitter } from "@/features/events/hooks/useEventEmitter";

// Define search options interface
interface SearchOptions {
  matchCase: boolean;
  useRegex: boolean;
}

// Define search params interface
export interface SearchParams {
  term: string;
  options: SearchOptions;
}

// Define replace params interface
export interface ReplaceParams {
  searchTerm: string;
  replaceTerm: string;
  options: SearchOptions;
}

// Component props interface
interface SearchReplaceComponentProps {
  editor: Editor | null;
  onSearch?: (params: SearchParams) => void;
  onReplace?: (params: ReplaceParams) => void;
  onReplaceAll?: (params: ReplaceParams) => void;
  onCaseToggle?: (caseToggle: boolean) => void;
  onNext?: (params: SearchParams) => void;
  onPrevious?: (params: SearchParams) => void;
  getTotalMatches?: () => number;
  getCurrentMatch?: () => number;
  className?: string;
}

const RESULT_INDEX_OFFSET = 1 as const;

export const SearchReplaceComponent = ({
  editor,
  onSearch,
  onReplace,
  onReplaceAll,
  onCaseToggle,
  onNext,
  onPrevious,
  className = "",
}: SearchReplaceComponentProps) => {
  const { t } = useTranslation("editorView");
  const inputRef = useRef<HTMLInputElement>(null);
  const emitter = useEventEmitter();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [replaceTerm, setReplaceTerm] = useState<string>("");
  const [showReplace, setShowReplace] = useState<boolean>(false);
  const [matchCase, setMatchCase] = useState<boolean>(false);

  const [useRegex, setUseRegex] = useState<boolean>(false);

  const [totalMatches, setTotalMatches] = useState<number>(
    editor?.storage.searchAndReplace.results.length,
  );
  const [currentMatchIndex, setCurrentMatchIndex] = useState<number>(
    editor?.storage.searchAndReplace.resultIndex,
  );

  // Handle search
  const handleSearch = useCallback(() => {
    if (!searchTerm) return;

    editor?.commands.setSearchTerm(searchTerm);

    editor?.commands.resetIndex();
    setTotalMatches(editor?.storage.searchAndReplace.results.length);
    setCurrentMatchIndex(
      editor?.storage.searchAndReplace.resultIndex + RESULT_INDEX_OFFSET,
    );
  }, [searchTerm, matchCase, useRegex]);

  // Handle next/previous match
  const handleNext = useCallback(() => {
    if (!searchTerm) return;

    editor?.commands.nextSearchResult();
    setCurrentMatchIndex(
      editor?.storage.searchAndReplace.resultIndex + RESULT_INDEX_OFFSET,
    );
  }, [searchTerm, matchCase, useRegex, onNext]);

  const handlePrevious = useCallback(() => {
    if (!searchTerm) return;

    editor?.commands.previousSearchResult();
    setCurrentMatchIndex(
      editor?.storage.searchAndReplace.resultIndex + RESULT_INDEX_OFFSET,
    );
  }, [searchTerm, matchCase, useRegex, onPrevious]);

  // Handle replace
  const handleReplace = useCallback(() => {
    onReplace?.({
      searchTerm,
      replaceTerm,
      options: {
        matchCase,
        useRegex,
      },
    });

    editor?.commands.setReplaceTerm(replaceTerm);
    editor?.commands.replace();
    setTotalMatches(editor?.storage.searchAndReplace.results.length);
    setCurrentMatchIndex(
      editor?.storage.searchAndReplace.resultIndex + RESULT_INDEX_OFFSET,
    );
  }, [searchTerm, replaceTerm, matchCase, useRegex, onReplace, editor]);

  // Handle replace all
  const handleReplaceAll = useCallback(() => {
    onReplaceAll?.({
      searchTerm,
      replaceTerm,
      options: {
        matchCase,
        useRegex,
      },
    });

    editor?.commands.setReplaceTerm(replaceTerm);
    editor?.commands.replaceAll();
    setTotalMatches(editor?.storage.searchAndReplace.results.length);
    setCurrentMatchIndex(
      editor?.storage.searchAndReplace.resultIndex + RESULT_INDEX_OFFSET,
    );
  }, [searchTerm, replaceTerm, matchCase, useRegex, onReplaceAll]);

  const handleCaseToggle = useCallback(() => {
    setMatchCase((prevState) => {
      editor?.commands.setCaseSensitive(!prevState);
      return !prevState;
    });
  }, []);

  useEffect(() => {
    return () => {
      editor?.commands.setSearchTerm("");
    };
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef.current]);

  return (
    <div
      className={`p-2 border rounded-lg shadow-sm bg-background ${className}`}
    >
      <div className="space-y-2">
        {/* Search section */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              ref={inputRef}
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
              placeholder={t("search")}
              className="pl-8"
            />
          </div>

          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={handlePrevious}
              title={t("previousMatch")}
              disabled={!searchTerm}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={handleNext}
              title={t("nextMatch")}
              disabled={!searchTerm}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Toggle
              title={t("caseSensitive")}
              onPressedChange={handleCaseToggle}
              pressed={matchCase}
            >
              <Typography>C</Typography>
            </Toggle>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReplace(!showReplace)}
            >
              {showReplace ? t("hideReplace") : t("replace")}
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
              {currentMatchIndex} of {totalMatches} matches
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
                placeholder={t("replaceWith")}
                className="pl-8"
              />
            </div>

            <Button variant="outline" size="sm" onClick={handleReplace}>
              {t("replace")}
            </Button>

            <Button variant="outline" size="sm" onClick={handleReplaceAll}>
              {t("replaceAll")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

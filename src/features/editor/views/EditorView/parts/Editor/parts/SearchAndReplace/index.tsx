import { Typography } from "@/components/Typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { ActionId, NonAlphas } from "@/features/events/eventEmitter";
import { useEventEmitter } from "@/features/events/hooks/useEventEmitter";
import { useShortcuts } from "@/features/shortcuts/hooks/useShortcuts";
import type { Editor, Range } from "@tiptap/react";
import { ArrowLeft, ArrowRight, Replace, Search } from "lucide-react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useEditorEffect } from "../../hooks/useEditorEffect";

export interface SearchInputHandle {
  focus: () => void;
  domElement: HTMLInputElement | null;
}

// Component props interface
interface SearchReplaceComponentProps {
  className?: string;
  editor: Editor | null;
}

const RESULT_INDEX_OFFSET = 1 as const;
const ON_UPDATE_DEBOUNCE = 750 as const;

export const SearchReplaceComponent = forwardRef<
  SearchInputHandle,
  SearchReplaceComponentProps
>(({ editor, className = "" }, ref) => {
  const { t } = useTranslation("editorView");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const emitter = useEventEmitter();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [replaceTerm, setReplaceTerm] = useState<string>("");
  const [showReplace, setShowReplace] = useState<boolean>(false);
  const [isCaseSensitive, setIsCaseSensitive] = useState<boolean>(false);

  // disabled for now
  //const [isRegex, setIsRegex] = useState<boolean>(false);

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
  }, [searchTerm, isCaseSensitive]);

  // Handle next/previous match
  const handleNext = useCallback(() => {
    if (!searchTerm) return;

    editor?.commands.nextSearchResult();
    setCurrentMatchIndex(
      editor?.storage.searchAndReplace.resultIndex + RESULT_INDEX_OFFSET,
    );
    goToSelection();
  }, [searchTerm, isCaseSensitive]);

  const handlePrevious = useCallback(() => {
    if (!searchTerm) return;

    editor?.commands.previousSearchResult();
    setCurrentMatchIndex(
      editor?.storage.searchAndReplace.resultIndex + RESULT_INDEX_OFFSET,
    );
    goToSelection();
  }, [searchTerm, isCaseSensitive]);

  // Handle replace
  const handleReplace = useCallback(() => {
    editor?.commands.setReplaceTerm(replaceTerm);
    editor?.commands.replace();

    setTotalMatches(editor?.storage.searchAndReplace.results.length);
    setCurrentMatchIndex(
      editor?.storage.searchAndReplace.resultIndex + RESULT_INDEX_OFFSET,
    );
  }, [searchTerm, replaceTerm, isCaseSensitive, editor]);

  // Handle replace all
  const handleReplaceAll = useCallback(() => {
    editor?.commands.setReplaceTerm(replaceTerm);
    editor?.commands.replaceAll();

    setTotalMatches(editor?.storage.searchAndReplace.results.length);
    setCurrentMatchIndex(
      editor?.storage.searchAndReplace.resultIndex + RESULT_INDEX_OFFSET,
    );
  }, [searchTerm, replaceTerm, isCaseSensitive]);

  const handleCaseToggle = useCallback(() => {
    setIsCaseSensitive((prevState) => {
      editor?.commands.setCaseSensitive(!prevState);
      return !prevState;
    });
  }, []);

  const toggleFocus = useCallback(() => {
    if (document.activeElement === searchInputRef.current) {
      replaceInputRef.current?.focus();
    } else {
      searchInputRef.current?.focus();
    }
  }, []);

  const goToSelection = useCallback(() => {
    if (!editor) return;

    const { results, resultIndex } = editor.storage.searchAndReplace;
    const position: Range = results[resultIndex];

    if (!position) return;

    editor.commands.setTextSelection(position);

    const { node } = editor.view.domAtPos(editor.state.selection.anchor);

    node instanceof HTMLElement &&
      node.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  useShortcuts(ActionId.SearchReplace, () => emitter(ActionId.SearchReplace), {
    enableOnFormTags: ["INPUT"],
  });
  useShortcuts(ActionId.NextSearch, handleNext, {
    enableOnFormTags: ["INPUT"],
  });
  useShortcuts(ActionId.PreviousSearch, handlePrevious, {
    enableOnFormTags: ["INPUT"],
  });
  useShortcuts(ActionId.ToggleCaseSensitiveSearch, handleCaseToggle, {
    enableOnFormTags: ["INPUT"],
  });
  useShortcuts(
    ActionId.ToggleReplace,
    () => setShowReplace((prevState) => !prevState),
    {
      enableOnFormTags: ["INPUT"],
    },
  );
  useShortcuts(NonAlphas.Enter, handleSearch, {
    enableOnFormTags: ["INPUT"],
  });
  useShortcuts(NonAlphas.Escape, () => emitter(ActionId.SearchReplace), {
    enableOnFormTags: ["INPUT"],
  });
  useShortcuts(NonAlphas.Tab, toggleFocus, {
    enableOnFormTags: ["INPUT"],
  });

  useEffect(() => {
    return () => {
      editor?.commands.setSearchTerm("");
    };
  }, []);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, [searchInputRef.current]);

  useImperativeHandle(ref, () => ({
    focus: () => searchInputRef.current?.focus(),
    domElement: searchInputRef.current,
  }));

  useEditorEffect(editor, "update", handleSearch, {
    useDebounce: true,
    debounceTime: ON_UPDATE_DEBOUNCE,
  });

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
              ref={searchInputRef}
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
              pressed={isCaseSensitive}
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

        {totalMatches > 0 && (
          <div className="text-xs text-muted-foreground flex justify-between items-center">
            <Badge variant="secondary" className="font-normal">
              {currentMatchIndex} of {totalMatches} matches
            </Badge>
          </div>
        )}

        {showReplace && (
          <div className="flex items-center gap-2 mt-2">
            <div className="relative flex-1">
              <Replace className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                ref={replaceInputRef}
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
});

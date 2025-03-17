import { EditorContent, type Editor as EditorType } from "@tiptap/react";
import { BubbleMenu } from "./parts/BubbleMenu";
import type { FileTreeNode } from "../FileExplorer/hooks/useFileExplorer";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useEventListener } from "@/features/events/hooks/useEventListener";
import { ActionId, NonAlphas } from "@/features/events/eventEmitter";
import { Typography } from "@/components/Typography";
import { stripJson } from "@/utils/nodeHelpers";
import {
  type SearchInputHandle,
  SearchReplaceComponent,
} from "./parts/SearchAndReplace";
import { useEditorEffect } from "./hooks/useEditorEffect";
import { FloatingMenu } from "./parts/FloatingMenu";
import { useShortcuts } from "@/features/shortcuts/hooks/useShortcuts";

export interface EditorProps {
  selectedNoteNode?: FileTreeNode;
  editor: EditorType | null;
  onClick: () => void;
}

export const Editor = ({ editor, onClick, selectedNoteNode }: EditorProps) => {
  const { t } = useTranslation();
  const [isSaved, setIsSaved] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const searchReplaceRef = useRef<SearchInputHandle>(null);

  useEventListener(ActionId.SaveNote, () => setIsSaved(true));
  useEventListener(ActionId.SearchReplace, () => {
    if (
      document.activeElement !== searchReplaceRef.current?.domElement &&
      isSearching
    ) {
      searchReplaceRef.current?.focus();
      return;
    }
    setIsSearching((prevState) => {
      if (prevState) {
        editor?.commands.focus();
      }
      return !prevState;
    });
  });

  const handleOnUpdate = useCallback(() => {
    setIsSaved(false);
  }, []);

  useShortcuts(
    NonAlphas.Escape,
    () => {
      const selection = editor?.state.selection;
      if (!selection) {
        return;
      }

      const { ranges } = selection;
      const toPosition = ranges[0]?.$to;

      editor?.commands.setTextSelection(toPosition.pos);
    },
    { enableOnContentEditable: true },
  );

  useEditorEffect(editor, "update", handleOnUpdate, {
    useDebounce: true,
    debounceTime: 300,
  });
  useEffect(() => {
    const handleOnUpdate = () => {
      setIsSaved(false);
    };

    editor?.on("update", handleOnUpdate);

    return () => {
      editor?.off("update", handleOnUpdate);
    };
  });

  return (
    <>
      <div className="flex flex-row items-center justify-between mb-2">
        <Typography variant="h2" weight="normal" className="no-underline">
          {stripJson(selectedNoteNode?.value.name)}
        </Typography>
        {!isSaved && (
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-foreground animate-pulse" />
            <span className="text-foreground text-sm font-medium">
              {t("unsavedChanges")}
            </span>
          </div>
        )}
      </div>
      <EditorContent
        editor={editor}
        className="w-full max-h-full h-full bg-background overflow-y-scroll overflow-x-hidden"
        onClick={onClick}
      />
      <div>
        <FloatingMenu editor={editor} />
      </div>
      <div>
        <BubbleMenu editor={editor} />
      </div>
      {isSearching && (
        <SearchReplaceComponent editor={editor} ref={searchReplaceRef} />
      )}
    </>
  );
};

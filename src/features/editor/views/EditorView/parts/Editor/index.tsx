import { EditorContent, type Editor as EditorType } from "@tiptap/react";
import { BubbleMenu } from "./parts/BubbleMenu";
import type { FileTreeNode } from "../FileExplorer/hooks/useFileExplorer";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useEventListener } from "@/features/events/hooks/useEventListener";
import { ActionId, NonAlphas } from "@/features/events/eventEmitter";
import { Typography } from "@/components/Typography";
import { stripJson } from "@/utils/nodeHelpers";
import {
  type SearchInputHandle,
  SearchReplaceComponent,
} from "./parts/SearchAndReplace";
import { FloatingMenu } from "./parts/FloatingMenu";
import { useShortcuts } from "@/features/shortcuts/hooks/useShortcuts";
import { useEditorStateStore } from "@/stores/useEditorStateStore";
import { useEventEmitter } from "@/features/events/hooks/useEventEmitter";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TableBubbleMenu } from "./parts/TableBubbleMenu";

export interface EditorProps {
  selectedNoteNode?: FileTreeNode;
  editor: EditorType | null;
  onClick: () => void;
}

export const Editor = ({ editor, onClick, selectedNoteNode }: EditorProps) => {
  const { t } = useTranslation("common");
  const editorStates = useEditorStateStore((state) => state.editorStates);
  const setEditorStateSaved = useEditorStateStore(
    (state) => state.setEditorStateSaved,
  );
  const emitter = useEventEmitter();
  const [isSearching, setIsSearching] = useState(false);
  const searchReplaceRef = useRef<SearchInputHandle>(null);

  useEventListener(ActionId.SaveNote, () => {
    if (!selectedNoteNode) return;

    setEditorStateSaved(selectedNoteNode?.value.path, true);
  });
  useEventListener(ActionId.SearchReplace, () => {
    const isSearchReplaceFocused =
      document.activeElement === searchReplaceRef.current?.domElement;

    if (!isSearchReplaceFocused && isSearching) {
      searchReplaceRef.current?.focus();
      return;
    }

    if (editor?.view.hasFocus() || isSearchReplaceFocused) {
      setIsSearching((prevState) => {
        if (prevState) {
          editor?.commands.focus();
        }
        return !prevState;
      });
    }
  });

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

  useShortcuts(
    ActionId.RemoveAllFormatting,
    () => {
      editor?.chain().focus().unsetAllMarks().run();
    },
    { enableOnContentEditable: true },
  );

  const renderUnsavedChangesStatus = useCallback(() => {
    if (selectedNoteNode === undefined) return <></>;

    if (editorStates[selectedNoteNode.value.path]?.saved) return <></>;

    if (editorStates[selectedNoteNode.value.path]?.saved === undefined)
      return <></>;

    return (
      <Button
        className="flex items-center gap-1.5 cursor-pointer"
        onClick={() => {
          emitter(ActionId.SaveNote);
          toast.success(t("noteSaved", { ns: "editorView" }));
        }}
        variant="ghost"
      >
        <div className="h-2 w-2 rounded-full bg-foreground animate-pulse" />
        <span className="text-foreground text-sm font-medium">
          {t("unsavedChanges")}
        </span>
      </Button>
    );
  }, [selectedNoteNode, editorStates]);

  return (
    <>
      <div className="flex flex-row items-center justify-between mb-2">
        <Typography variant="h2" weight="normal" className="no-underline">
          {stripJson(selectedNoteNode?.value.name)}
        </Typography>
        {renderUnsavedChangesStatus()}
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
        <TableBubbleMenu editor={editor} />
      </div>
      {isSearching && (
        <SearchReplaceComponent editor={editor} ref={searchReplaceRef} />
      )}
    </>
  );
};

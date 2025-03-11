import {
  FloatingMenu,
  EditorContent,
  type Editor as EditorType,
} from "@tiptap/react";
import { BubbleMenu } from "./parts/BubbleMenu";
import type { FileTreeNode } from "../FileExplorer/hooks/useFileExplorer";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useEventListener } from "@/features/events/hooks/useEventListener";
import { ActionId } from "@/features/events/eventEmitter";
import { Typography } from "@/components/Typography";
import { stripJson } from "@/utils/nodeHelpers";
import { SearchReplaceComponent } from "./parts/SearchAndReplace";

export interface EditorProps {
  selectedNoteNode?: FileTreeNode;
  editor: EditorType | null;
  onClick: () => void;
}

export const Editor = ({ editor, onClick, selectedNoteNode }: EditorProps) => {
  const { t } = useTranslation();
  const [isSaved, setIsSaved] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  useEventListener(ActionId.SaveNote, () => setIsSaved(true));
  useEventListener(ActionId.SearchReplace, () => {
    setIsSearching((prevState) => {
      if (prevState) {
        editor?.commands.focus();
      }
      return !prevState;
    });
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
        <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>
      </div>
      <div>
        <BubbleMenu editor={editor} />
      </div>
      {isSearching && <SearchReplaceComponent editor={editor} />}
    </>
  );
};

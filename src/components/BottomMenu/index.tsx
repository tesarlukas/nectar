import type { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "../ui/card";
import { type Editor, useEditorState } from "@tiptap/react";

export interface BottomMenuProps {
  editor: Editor | null;
}

export const BottomMenu = ({
  editor,
  children,
}: PropsWithChildren<BottomMenuProps>) => {
  const { t } = useTranslation("editorView");

  const editorState = useEditorState<{
    characterCount: number;
    wordCount: number;
  }>({
    editor,
    selector: (ctx) => {
      return {
        characterCount: ctx.editor?.storage.characterCount.characters(),
        wordCount: ctx.editor?.storage.characterCount.words(),
      };
    },
  });

  return (
    <>
      <Card className="flex flex-row rounded-t-none h-12 py-2 px-8 bottom-0 w-full">
        <div className="ml-auto gap-x-4 flex-row flex items-center">
          {children}
          {editorState?.wordCount !== 0 && (
            <span>
              {t("words")}: {editorState?.wordCount}
            </span>
          )}
          {editorState?.characterCount !== 0 && (
            <span>
              {t("characters")}: {editorState?.characterCount}
            </span>
          )}
        </div>
      </Card>
    </>
  );
};

import { EditorState } from "@tiptap/pm/state";
import { createDocument, type Editor, type JSONContent } from "@tiptap/react";

export const resetEditorContent = ({
  editor,
  newContent,
}: { editor: Editor | null; newContent: JSONContent }) => {
  if (!editor) return;

  const newEditorState = EditorState.create({
    doc: createDocument(newContent, editor.schema),
    plugins: editor.state.plugins,
  });

  editor.view.updateState(newEditorState);
};

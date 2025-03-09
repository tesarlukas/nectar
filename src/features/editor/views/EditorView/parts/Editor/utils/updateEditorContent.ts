import { EditorState } from "@tiptap/pm/state";
import { createDocument, type Editor, type JSONContent } from "@tiptap/react";

export const resetEditorContent = ({
  editor,
  newContent,
}: { editor: Editor | null; newContent: JSONContent }) => {
  if (!editor) return;
  const currentSelection = editor.state.selection;

  // Create a new editor state while preserving the old selection
  const newEditorState = EditorState.create({
    doc: createDocument(newContent, editor.schema),
    plugins: editor.state.plugins,
    selection: currentSelection,
  });

  // Update the editor state
  editor.view.updateState(newEditorState);
};

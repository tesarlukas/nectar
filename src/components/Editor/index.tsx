import { saveNote } from "@/utils/fs";
import {
  FloatingMenu,
  BubbleMenu,
  EditorContent,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { Button } from "../ui/button";
import Code from "@tiptap/extension-code";

// define your extension array
const extensions = [StarterKit, Image, Code];

const content = "<p>Hello World!</p>";

export const Editor = () => {
  const editor = useEditor({
    extensions,
    content,
    editorProps: {
      attributes: {
        class: "focus:outline-none",
      },
    },
  });

  const handleEditorOnClick = () => {
    editor?.commands.focus();
  };

  const handleSave = async () => {
    saveNote("first_name", editor?.getJSON());
  };

  return (
    <div className="h-full p-4">
      <EditorContent
        editor={editor}
        className="w-full h-full bg-background"
        onClick={handleEditorOnClick}
      />
      <div>
        <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>
      </div>
      <div>
        <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>
      </div>
    </div>
  );
};

import { saveNote } from "@/utils/fs";
import { BaseDirectory } from "@tauri-apps/plugin-fs";
import {
  FloatingMenu,
  BubbleMenu,
  EditorContent,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

// define your extension array
const extensions = [StarterKit];

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
    console.log("editor json", editor?.getJSON());
    console.log("dir", BaseDirectory.Desktop);

    saveNote("first_name", editor?.getJSON());
  };

  return (
    <>
      <EditorContent
        editor={editor}
        className="w-full bg-blue-200 h-1/2"
        onClick={handleEditorOnClick}
      />
      <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>
      <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>
      <button type="button" className="bg-yellow-200" onClick={handleSave}>
        Hello
      </button>
    </>
  );
};

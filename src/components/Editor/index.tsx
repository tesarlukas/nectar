import { saveNote } from "@/utils/fs";
import { BaseDirectory } from "@tauri-apps/plugin-fs";
import {
  FloatingMenu,
  BubbleMenu,
  EditorContent,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { useNavigate } from "react-router";

// define your extension array
const extensions = [StarterKit, Image];

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

  const navigate = useNavigate();

  return (
    <>
      <EditorContent
        editor={editor}
        className="w-full bg-blue-200 h-1/2"
        onClick={handleEditorOnClick}
      />
      <div>
        <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>
      </div>
      <div>
        <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>
      </div>
      <button type="button" className="bg-yellow-200" onClick={handleSave}>
        Hello
      </button>
      <button type="button" onClick={() => navigate("/settings")}>
        Settings
      </button>
    </>
  );
};

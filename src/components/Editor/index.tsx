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
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";

// define your extension array
const extensions = [
  StarterKit,
  Image,
  Code,
  ListItem,
  BulletList.configure({
    HTMLAttributes: {
      class: "list-disc ml-2",
    },
  }),
];

const content = " <ul> <li>A list item</li> <li>And another one</li> </ul>";

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

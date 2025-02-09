import { useEditor as useTiptapEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
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

export const useEditor = () => {
  const editor = useTiptapEditor({
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

  return {
    editor,
    handleEditorOnClick,
  };
};

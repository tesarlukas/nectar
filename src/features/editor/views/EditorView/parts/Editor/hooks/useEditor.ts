import { useEditor as useTiptapEditor } from "@tiptap/react";
import { Image } from "@tiptap/extension-image";
import Code from "@tiptap/extension-code";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import CodeBlock from "@tiptap/extension-code-block";
import Blockquote from "@tiptap/extension-blockquote";
import Document from "@tiptap/extension-document";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Dropcursor from "@tiptap/extension-dropcursor";
import Gapcursor from "@tiptap/extension-gapcursor";
import CharacterCount from "@tiptap/extension-character-count";

const extensions = [
  // StarterKit breakdown
  // Nodes
  Blockquote,
  BulletList.configure({
    HTMLAttributes: {
      class: "list-disc ml-2",
    },
  }),
  CodeBlock,
  Document,
  HardBreak,
  Heading,
  HorizontalRule,
  ListItem,
  OrderedList,
  Paragraph,
  Text,

  // Marks
  Bold,
  Code,
  Italic,
  Strike,

  // Extensions
  Dropcursor,
  Gapcursor,

  // Additional extensions
  Image,
  CharacterCount,
];

const content =
  "<blockquote> Nothing is impossible, the word itself says “I’m possible!” </blockquote> <p>Audrey Hepburn</p>";

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

import { mergeAttributes, useEditor as useTiptapEditor } from "@tiptap/react";
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
  // Nodes
  Blockquote.configure({
    HTMLAttributes: {
      class: "border-l-4 border-muted pl-4 my-4 text-muted-foreground",
    },
  }),
  BulletList.configure({
    HTMLAttributes: {
      class: "list-disc ml-6 space-y-2 text-foreground",
    },
  }),
  CodeBlock.configure({
    HTMLAttributes: {
      class: "bg-muted rounded-md p-4 font-mono text-sm my-4 text-foreground",
    },
  }),
  Document,
  HardBreak,
  Heading.extend({
    levels: [1, 2, 3, 4, 5, 6],
    renderHTML({ node, HTMLAttributes }) {
      const level = this.options.levels.includes(node.attrs.level)
        ? node.attrs.level
        : this.options.levels[0];

      const classes: { [index: number]: string } = {
        1: "scroll-m-20 text-3xl font-bold tracking-tight text-foreground mt-6 mb-4",
        2: "scroll-m-20 text-2xl font-bold tracking-tight text-foreground mt-5 mb-3",
        3: "scroll-m-20 text-xl font-bold tracking-tight text-foreground mt-4 mb-2",
        4: "scroll-m-20 text-lg font-bold text-foreground mt-3 mb-2",
        5: "scroll-m-20 text-base font-bold text-foreground mt-3 mb-2",
        6: "scroll-m-20 text-sm font-bold text-foreground mt-3 mb-2",
      };

      return [
        `h${level}`,
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
          class: `${classes[level]}`,
        }),
        0,
      ];
    },
  }).configure({ levels: [1, 2, 3, 4, 5, 6] }),
  HorizontalRule.configure({
    HTMLAttributes: {
      class: "my-4 border-border",
    },
  }),
  ListItem.configure({
    HTMLAttributes: {
      class: "ml-2 text-foreground",
    },
  }),
  OrderedList.configure({
    HTMLAttributes: {
      class: "list-decimal ml-6 space-y-2 text-foreground",
    },
  }),
  Paragraph.configure({
    HTMLAttributes: {
      class: "leading-7 [&:not(:first-child)]:mt-6 text-foreground",
    },
  }),
  Text,

  // Marks
  Bold.configure({
    HTMLAttributes: {
      class: "font-bold text-foreground",
    },
  }),
  Code.configure({
    HTMLAttributes: {
      class:
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm",
    },
  }),
  Italic.configure({
    HTMLAttributes: {
      class: "italic text-foreground",
    },
  }),
  Strike.configure({
    HTMLAttributes: {
      class: "line-through text-muted-foreground",
    },
  }),

  // Extensions
  Dropcursor.configure({
    class: "border-primary",
  }),
  Gapcursor,

  // Additional extensions
  Image.configure({
    HTMLAttributes: {
      class: "max-w-full h-auto rounded-lg my-4 border border-border",
    },
  }),
  CharacterCount,
];

const content = `
        <h1>This is a 1st level heading</h1>
        <h2>This is a 2nd level heading</h2>
        <h3>This is a 3rd level heading</h3>
        <h4>This 4th level heading will be converted to a paragraph, because levels are configured to be only 1, 2 or 3.</h4>
      `;

export const useEditor = () => {
  const editor = useTiptapEditor({
    extensions,
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
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

import {
  type Editor,
  mergeAttributes,
  useEditor as useTiptapEditor,
} from "@tiptap/react";
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
import History from "@tiptap/extension-history";
import FileHandler from "@tiptap-pro/extension-file-handler";
import Link from "@tiptap/extension-link";
import { useEditorStateStore } from "@/stores/useEditorStateStore";
import { useCallback, useEffect } from "react";
import { debounce } from "@/utils/debounce";
import SearchAndReplace from "../extensions/searchAndReplace";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";

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
        1: "scroll-m-20 text-3xl font-bold tracking-tight text-foreground mt-6 mb-4 not-prose",
        2: "scroll-m-20 text-2xl font-bold tracking-tight text-foreground mt-5 mb-3 not-prose",
        3: "scroll-m-20 text-xl font-bold tracking-tight text-foreground mt-4 mb-2 not-prose",
        4: "scroll-m-20 text-lg font-bold text-foreground mt-3 mb-2 not-prose",
        5: "scroll-m-20 text-base font-bold text-foreground mt-3 mb-2 not-prose",
        6: "scroll-m-20 text-sm font-bold text-foreground mt-3 mb-2 not-prose",
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
      class: "font-bold text-foreground not-prose",
    },
  }),
  Code.configure({
    HTMLAttributes: {
      class:
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm not-prose",
    },
  }),
  Italic.configure({
    HTMLAttributes: {
      class: "italic text-foreground not-prose",
    },
  }),
  Strike.configure({
    HTMLAttributes: {
      class: "line-through text-muted-foreground not-prose",
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
  History,
  FileHandler.configure({
    allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
    onDrop: (currentEditor, files, pos) => {
      files.forEach((file) => {
        const fileReader = new FileReader();

        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
          currentEditor
            .chain()
            .insertContentAt(pos, {
              type: "image",
              attrs: {
                src: fileReader.result,
              },
            })
            .focus()
            .run();
        };
      });
    },
    onPaste: (currentEditor, files, htmlContent) => {
      files.forEach((file) => {
        if (htmlContent) {
          // if there is htmlContent, stop manual insertion & let other extensions handle insertion via inputRule
          // you could extract the pasted file from this url string and upload it to a server for example
          console.log(htmlContent); // eslint-disable-line no-console
          return false;
        }

        const fileReader = new FileReader();

        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
          currentEditor
            .chain()
            .insertContentAt(currentEditor.state.selection.anchor, {
              type: "image",
              attrs: {
                src: fileReader.result,
              },
            })
            .focus()
            .run();
        };
      });
    },
  }),
  Link,
  SearchAndReplace.configure({
    searchResultClass: "search-result",
    disableRegex: false,
  }),
  TaskList.configure({
    HTMLAttributes: {
      class: "not-prose pl-2 list-none",
    },
  }),
  TaskItem.configure({
    HTMLAttributes: {
      class: "flex items-start gap-2 p-2",
    },
    nested: true,
  }),
  Table.configure({
    HTMLAttributes: {
      class: "w-full my-4 border-collapse text-sm not-prose",
    },
  }),
  TableHeader.configure({
    HTMLAttributes: {
      class: "bg-muted font-medium border border-border",
    },
  }),
  TableRow.configure({
    HTMLAttributes: {
      class: "border-b border-border hover:bg-muted/30 transition-colors",
    },
  }),
  TableCell.configure({
    HTMLAttributes: {
      class: "p-2 border border-border align-middle text-foreground",
    },
  }),
];

const TEMP_NOTE_ID = "temp";

const content = `
<h1>Hello, welcome to the app Nectar!</h1> 
`;

interface UseEditor {
  noteId?: string;
}

export const useEditor = ({ noteId }: UseEditor) => {
  const addEditorState = useEditorStateStore((state) => state.addEditorState);

  const debouncedUpdateEditorStates = useCallback(
    debounce((noteId: string, editor: Editor) => {
      addEditorState(noteId, editor.view.state);
    }, 500),
    [],
  );

  const handleEditorOnClick = () => {
    editor?.commands.focus();
  };

  useEffect(() => {
    return () => debouncedUpdateEditorStates.cancel();
  }, []);

  const editor = useTiptapEditor({
    extensions,
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-0 focus:outline-none",
        id: "editor",
      },
    },
    onUpdate: ({ editor }) => {
      debouncedUpdateEditorStates(noteId ?? TEMP_NOTE_ID, editor);
    },
    shouldRerenderOnTransaction: false,
  });

  return {
    editor,
    handleEditorOnClick,
  };
};

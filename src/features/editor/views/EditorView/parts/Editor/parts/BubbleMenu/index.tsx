import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  BubbleMenu as TiptapBubbleMenu,
  type BubbleMenuProps as TiptapBubleMenuProps,
} from "@tiptap/react";
import {
  Bold,
  Code,
  Italic,
  Link,
  RemoveFormatting,
  Strikethrough,
} from "lucide-react";

interface BubbleMenuProps extends Omit<TiptapBubleMenuProps, "children"> {}

export const BubbleMenu = ({ editor, ...rest }: BubbleMenuProps) => {
  return (
    <>
      <TiptapBubbleMenu editor={editor} {...rest}>
        <Card className="flex items-center gap-1 p-1 shadow-md">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={editor?.isActive("bold") ? "bg-muted" : ""}
          >
            <Bold className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={editor?.isActive("italic") ? "bg-muted" : ""}
          >
            <Italic className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            className={editor?.isActive("strike") ? "bg-muted" : ""}
          >
            <Strikethrough className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor?.chain().focus().toggleCode().run()}
            className={editor?.isActive("code") ? "bg-muted" : ""}
          >
            <Code className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const url = window.prompt("URL");
              if (url) {
                editor?.chain().focus().setLink({ href: url }).run();
              } else {
                editor?.chain().focus().unsetLink().run();
              }
            }}
            className={editor?.isActive("link") ? "bg-muted" : ""}
          >
            <Link className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor?.chain().focus().unsetAllMarks().run()}
          >
            <RemoveFormatting className="h-4 w-4" />
          </Button>
        </Card>
      </TiptapBubbleMenu>
    </>
  );
};

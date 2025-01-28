import {
  BubbleMenu as TiptapBubbleMenu,
  type BubbleMenuProps as TiptapBubleMenuProps,
} from "@tiptap/react";

interface BubbleMenuProps extends TiptapBubleMenuProps {}

export const BubbleMenu = ({ editor, ...rest }: BubbleMenuProps) => {
  return (
    <>
      <TiptapBubbleMenu editor={editor} {...rest}>
        Hello there
      </TiptapBubbleMenu>
    </>
  );
};

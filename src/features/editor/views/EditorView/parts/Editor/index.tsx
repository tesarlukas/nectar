import {
  FloatingMenu,
  EditorContent,
  type Editor as EditorType,
} from "@tiptap/react";
import { BubbleMenu } from "./parts/BubbleMenu";

export interface EditorProps {
  editor: EditorType | null;
  onClick: () => void;
}

export const Editor = ({ editor, onClick }: EditorProps) => {
  return (
    <>
      <EditorContent
        editor={editor}
        className="w-full max-h-full h-full bg-background overflow-y-scroll overflow-x-hidden"
        onClick={onClick}
      />
      <div>
        <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>
      </div>
      <div>
        <BubbleMenu editor={editor} />
      </div>
    </>
  );
};

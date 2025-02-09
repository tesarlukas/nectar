import {
  FloatingMenu,
  BubbleMenu,
  EditorContent,
  type Editor as EditorType,
} from "@tiptap/react";

export interface EditorProps {
  editor: EditorType | null;
  onClick: () => void;
}

export const Editor = ({ editor, onClick }: EditorProps) => {
  return (
    <div className="h-full p-4">
      <EditorContent
        editor={editor}
        className="w-full h-full bg-background"
        onClick={onClick}
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

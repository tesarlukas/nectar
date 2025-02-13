import { EditableText } from "@/components/EditableText";

interface NoteTitleProps {
  title?: string;
}

export const NoteTitle = ({ title }: NoteTitleProps) => {
  return (
    <>
      <div className="bg-red-900 h-8 flex flex-row justify-center items-center">
        <EditableText initialText={title} />
      </div>
    </>
  );
};

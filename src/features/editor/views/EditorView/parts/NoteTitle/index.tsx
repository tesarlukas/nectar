import { stripJson } from "@/utils/nodeHelpers";

interface NoteTitleProps {
  title?: string;
}

export const NoteTitle = ({ title }: NoteTitleProps) => {
  return (
    <>
      <div className="flex flex-pow justify-center items-center text-2xl mt-4">
        {stripJson(title)}
      </div>
    </>
  );
};

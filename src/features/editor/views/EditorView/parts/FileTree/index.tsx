import { ResizablePanel } from "@/components/ui/resizable";

export const FileTree = () => {
  return (
    <ResizablePanel defaultSize={50} minSize={10}>
      <div className="">
        <span className="font-semibold">File Tree</span>
      </div>
    </ResizablePanel>
  );
};

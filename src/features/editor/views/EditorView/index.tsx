import { Editor } from "@/components/Editor";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { FileTree } from "./parts/FileTree";
import { BottomMenu } from "@/components/BottomMenu";

export const EditorView = () => {
  return (
    <>
      <div className="flex flex-col h-full">
        <ResizablePanelGroup direction="horizontal">
          <FileTree />
          <ResizableHandle />
          <ResizablePanel defaultSize={50} minSize={25}>
            <Editor />
          </ResizablePanel>
        </ResizablePanelGroup>
        <BottomMenu wordCount={0} />
      </div>
    </>
  );
};

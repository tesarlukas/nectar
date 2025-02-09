import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { FileTree } from "./parts/FileTree";
import { BottomMenu } from "@/components/BottomMenu";
import { useEditor } from "./parts/Editor/hooks/useEditor";
import { Editor } from "./parts/Editor";

export const EditorView = () => {
  const { editor, handleEditorOnClick } = useEditor();

  return (
    <>
      <div className="flex flex-col h-full">
        <ResizablePanelGroup direction="horizontal">
          <FileTree />
          <ResizableHandle />
          <ResizablePanel defaultSize={50} minSize={25}>
            <Editor editor={editor} onClick={handleEditorOnClick} />
          </ResizablePanel>
        </ResizablePanelGroup>
        <BottomMenu wordCount={0} />
      </div>
    </>
  );
};

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
      <div className="flex flex-col h-full min-h-0">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20} minSize={10}>
            <FileTree />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={80} minSize={25}>
            <Editor editor={editor} onClick={handleEditorOnClick} />
          </ResizablePanel>
        </ResizablePanelGroup>
        <BottomMenu charCount={editor?.storage.characterCount.characters()} />
      </div>
    </>
  );
};

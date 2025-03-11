import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { FileExplorer } from "./parts/FileExplorer";
import { BottomMenu } from "@/components/BottomMenu";
import { useEditor } from "./parts/Editor/hooks/useEditor";
import { Editor } from "./parts/Editor";
import { Button } from "@/components/ui/button";
import { useFileExplorer } from "./parts/FileExplorer/hooks/useFileExplorer";
import { useEffect } from "react";
import { useHiveStore } from "@/stores/useHiveStore";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useEditorViewHandlers } from "./hooks/useEditorViewHandlers";
import { useShortcuts } from "@/features/shortcuts/hooks/useShortcuts";
import { ActionId } from "@/features/events/eventEmitter";
import { useEventListener } from "@/features/events/hooks/useEventListener";
import { useEventEmitter } from "@/features/events/hooks/useEventEmitter";

export const EditorView = () => {
  const { hiveName, isHydrated } = useHiveStore();
  const navigate = useNavigate();
  const emitter = useEventEmitter();

  const fileExplorer = useFileExplorer();
  const { nodes, selectedNode, selectedNoteNode, initializeFileTree } =
    fileExplorer;

  const { editor, handleEditorOnClick } = useEditor({
    noteId: selectedNode?.value.path,
  });

  const {
    handleOnNodeClick,
    handleOnSave,
    handleOnDelete,
    handleOnCreateFile,
    handleOnCreateDir,
    handleOnRename,
    handleOnRefresh,
    handleOnMove,
  } = useEditorViewHandlers({
    ...fileExplorer,
    editor,
    hiveName,
  });

  const emitSaveNote = () => emitter(ActionId.SaveNote);

  useShortcuts(ActionId.SaveNote, emitSaveNote, {
    enableOnContentEditable: true,
    enableOnFormTags: ["INPUT"],
  });
  useShortcuts(ActionId.CreateNewNote, () => emitter(ActionId.CreateNewNote));
  useShortcuts(ActionId.SearchReplace, () => emitter(ActionId.SearchReplace), {
    enableOnContentEditable: true,
  });
  useShortcuts(ActionId.FocusEditor, () => editor?.commands.focus());

  useEventListener(ActionId.CreateNewNote, () => console.log("hello"));
  useEventListener(ActionId.SaveNote, handleOnSave);

  useEffect(() => {
    if (isHydrated && hiveName === "") {
      navigate("/homebase");
    } else {
      initializeFileTree(hiveName);
    }
  }, [isHydrated, hiveName, initializeFileTree, navigate]);

  if (!isHydrated) return <>Loading</>;

  return (
    <>
      <div className="flex flex-col h-full min-h-0">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20} minSize={10}>
            <FileExplorer
              nodes={nodes}
              onNodeClick={handleOnNodeClick}
              selectedNode={selectedNode}
              onRename={handleOnRename}
              onDelete={handleOnDelete}
              onRefresh={handleOnRefresh}
              onCreateFile={handleOnCreateFile}
              onCreateDir={handleOnCreateDir}
              onMove={handleOnMove}
            />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={80} minSize={25}>
            <div className="h-full p-4 min-h-0 flex flex-col max-h-full">
              <Editor
                editor={editor}
                onClick={handleEditorOnClick}
                selectedNoteNode={selectedNoteNode}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
        <BottomMenu charCount={editor?.storage.characterCount.characters()}>
          <Button onClick={() => toast("Welcome")}>Toast click</Button>
        </BottomMenu>
      </div>
    </>
  );
};

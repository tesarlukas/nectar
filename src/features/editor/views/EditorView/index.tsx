import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { FileExplorer } from "./parts/FileExplorer";
import { BottomMenu } from "@/components/BottomMenu";
import { useEditor } from "./parts/Editor/hooks/useEditor";
import { Editor } from "./parts/Editor";
import {
  type FileTreeNode,
  useFileExplorer,
} from "./parts/FileExplorer/hooks/useFileExplorer";
import { useEffect, useRef } from "react";
import { useHiveStore } from "@/stores/useHiveStore";
import { useNavigate } from "react-router";
import { useEditorViewHandlers } from "./hooks/useEditorViewHandlers";
import { useShortcuts } from "@/features/shortcuts/hooks/useShortcuts";
import { ActionId } from "@/features/events/eventEmitter";
import { useEventListener } from "@/features/events/hooks/useEventListener";
import { useEventEmitter } from "@/features/events/hooks/useEventEmitter";
import type { ImperativePanelHandle } from "react-resizable-panels";
import { useJumplist } from "./hooks/useJumplist";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const RESIZE_STEP = 5;

export const EditorView = () => {
  const { t } = useTranslation("editorView");
  const { hiveName, isHydrated } = useHiveStore();
  const navigate = useNavigate();
  const emitter = useEventEmitter();
  const explorerRef = useRef<HTMLDivElement>(null);
  const resizablePanelRef = useRef<ImperativePanelHandle | null>(null);
  const {
    jumplistRef,
    addItemToJumplist,
    setIndexByItem,
    createNewItem,
    clearJumplist,
    moveJumplistOut,
    moveJumplistIn,
    isNodeCurrentJumplistItem,
  } = useJumplist();

  const fileExplorer = useFileExplorer();
  const {
    nodes,
    selectedNode,
    selectedNoteNode,
    initializeFileTree,
    toggleReferenceLink,
  } = fileExplorer;

  const { editor, handleEditorOnClick } = useEditor({
    noteId: selectedNoteNode?.value.path,
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
    handleOnPaste,
    handleMoveJumplistIn,
    handleMoveJumplistOut,
  } = useEditorViewHandlers({
    ...fileExplorer,
    editor,
    hiveName,
    addItemToJumplist,
    setIndexByItem,
    createNewItem,
    jumplistRef,
    moveJumplistIn,
    moveJumplistOut,
    isNodeCurrentJumplistItem,
  });

  const emitSaveNote = () => emitter(ActionId.SaveNote);

  useShortcuts(ActionId.MoveJumpListOut, handleMoveJumplistOut, {
    enableOnContentEditable: true,
    enableOnFormTags: ["INPUT"],
  });
  useShortcuts(ActionId.MoveJumpListIn, handleMoveJumplistIn, {
    enableOnContentEditable: true,
    enableOnFormTags: ["INPUT"],
  });
  useShortcuts(ActionId.SaveNote, emitSaveNote, {
    enableOnContentEditable: true,
    enableOnFormTags: ["INPUT"],
  });
  useShortcuts(ActionId.CreateNewNote, () => emitter(ActionId.CreateNewNote));
  useShortcuts(ActionId.SearchReplace, () => emitter(ActionId.SearchReplace), {
    enableOnContentEditable: true,
  });
  useShortcuts(ActionId.FocusEditor, () => editor?.commands.focus(), {
    enableOnFormTags: ["INPUT"],
  });
  useShortcuts(ActionId.FocusExplorer, () => explorerRef.current?.focus(), {
    enableOnContentEditable: true,
  });
  useShortcuts(
    ActionId.ExpandExplorerRight,
    () => {
      resizablePanelRef.current?.resize(
        resizablePanelRef.current.getSize() + RESIZE_STEP,
      );
    },
    { enableOnContentEditable: true },
  );
  useShortcuts(
    ActionId.ExpandExplorerLeft,
    () => {
      resizablePanelRef.current?.resize(
        resizablePanelRef.current.getSize() - RESIZE_STEP,
      );
    },
    { enableOnContentEditable: true },
  );

  useEventListener(ActionId.SaveNote, handleOnSave);
  useEventListener(ActionId.FocusExplorer, () => explorerRef.current?.focus());

  useEventListener(ActionId.LinkNode, async (value) => {
    if (!selectedNoteNode) {
      toast.info(t("youHaveToHaveSelectedNoteForThisAction"));
      return;
    }

    await toggleReferenceLink(selectedNoteNode, value as FileTreeNode);
  });

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
          <ResizablePanel defaultSize={20} minSize={10} ref={resizablePanelRef}>
            <FileExplorer
              ref={explorerRef}
              nodes={nodes}
              onNodeClick={handleOnNodeClick}
              selectedNode={selectedNode}
              onRename={handleOnRename}
              onDelete={handleOnDelete}
              onRefresh={handleOnRefresh}
              onCreateFile={handleOnCreateFile}
              onCreateDir={handleOnCreateDir}
              onMove={handleOnMove}
              onPaste={handleOnPaste}
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
          <Button onClick={() => clearJumplist()}>Clear jumplist</Button>
        </BottomMenu>
      </div>
    </>
  );
};

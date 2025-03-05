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
import type { FileTreeNode } from "./parts/FileExplorer/hooks/useFileExplorer";
import type { JSONContent } from "@tiptap/react";
import { NoteTitle } from "./parts/NoteTitle";
import { EMPTY_NOTE } from "./parts/FileExplorer/index.preset";
import { useHiveStore } from "@/stores/useHiveStore";
import { useNavigate } from "react-router";
import { useShortcuts } from "@/features/shortcuts/hooks/useShortcuts";

export const EditorView = () => {
  const { hiveName, isHydrated } = useHiveStore();
  const navigate = useNavigate();
  const { editor, handleEditorOnClick } = useEditor();
  const {
    nodes,
    selectedNode,
    addNewNode,
    setSelectedNode,
    readNote,
    saveNote,
    removeNodeByPath,
    initializeFileTree,
    renameNodeAndNoteOrDir,
    moveNote,
  } = useFileExplorer();

  const handleOnNodeClick = async (node: FileTreeNode) => {
    setSelectedNode(node);

    // if it's not a file, then it's not a note
    if (node.value.isDirectory) return;

    const noteContent = await readNote<JSONContent>(node.value.path);

    if (noteContent) editor?.commands.setContent(noteContent);
  };

  const handleOnSave = async () => {
    console.log("got triggered");
    await saveNote<JSONContent>(selectedNode, editor?.getJSON());
  };

  const handleOnDelete = async (node: FileTreeNode) => {
    await removeNodeByPath(node.value.path);
  };

  const handleOnCreateFile = async (parentNode: FileTreeNode, name: string) => {
    await addNewNode(parentNode.value.path, name, {
      isDirectory: false,
      content: EMPTY_NOTE,
    });
  };

  const handleOnCreateDir = async (parentNode: FileTreeNode, name: string) => {
    await addNewNode(parentNode.value.path, name, {
      isDirectory: true,
      content: EMPTY_NOTE,
    });
  };

  const handleOnRename = async (node: FileTreeNode, name: string) => {
    await renameNodeAndNoteOrDir(node, name);
  };

  const handleOnRefresh = async () => {
    await initializeFileTree(hiveName);
  };

  const handleOnMove = async (node: FileTreeNode, targetNode: FileTreeNode) => {
    await moveNote(node, targetNode);
  };

  useShortcuts("ctrl+s", () => handleOnSave(), {
    enableOnContentEditable: true,
  });

  useEffect(() => {
    if (isHydrated && hiveName === "") {
      navigate("/homebase");
    } else {
      initializeFileTree(hiveName);
    }
  }, [isHydrated, hiveName]);

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
              {selectedNode?.value.isFile && (
                <NoteTitle title={selectedNode?.value.name} />
              )}
              <Editor editor={editor} onClick={handleEditorOnClick} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
        <BottomMenu charCount={editor?.storage.characterCount.characters()}>
          <Button onClick={handleOnSave}>Save</Button>
        </BottomMenu>
      </div>
    </>
  );
};

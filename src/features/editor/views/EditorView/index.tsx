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
import { useHiveStore } from "@/stores/useHiveStore";
import { join, sep } from "@tauri-apps/api/path";
import { NOTES_PATH } from "@/constants/notesPath";
import { ROOT_DIR } from "@/constants/rootDir";
import { useEffect } from "react";
import type { FileTreeNode } from "./parts/FileExplorer/hooks/useFileExplorer";
import type { JSONContent } from "@tiptap/react";
import { NoteTitle } from "./parts/NoteTitle";

export const EditorView = () => {
  const hiveName = useHiveStore((state) => state.hiveName);
  const { editor, handleEditorOnClick } = useEditor();
  const {
    nodes,
    setNodes,
    selectedNode,
    addNewNode,
    setSelectedNode,
    buildDirectoryTree,
    readNote,
    saveNote,
    removeNodeByPath,
    initializeFileTree,
  } = useFileExplorer();

  const handleOnNodeClick = async (node: FileTreeNode) => {
    setSelectedNode(node);

    // if it's not a file, then it's not a note
    if (!node.value.isFile) return;

    const noteContent = await readNote<JSONContent>(node.value.path);

    if (noteContent) editor?.commands.setContent(noteContent);
  };

  const handleOnSave = async () => {
    const saveLocation = selectedNode?.value.dirPath
      ? selectedNode.value.dirPath
      : await join(hiveName, NOTES_PATH);

    await saveNote<JSONContent>(
      saveLocation,
      "placeholder_note",
      editor?.getJSON(),
    );
  };

  const handleOnDelete = async (node: FileTreeNode) => {
    await removeNodeByPath(node.value.path);
  };

  const handleOnCreateFile = async (node: FileTreeNode) => {
    await addNewNode(
      selectedNode?.value.path ?? (await join(hiveName, NOTES_PATH)),
      node.value.name,
      false,
    );
  };

  useEffect(() => {
    initializeFileTree();
  }, []);

  const handleOnRefresh = async () => {
    await initializeFileTree();
  };

  return (
    <>
      <div className="flex flex-col h-full min-h-0">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20} minSize={10}>
            <FileExplorer
              nodes={nodes}
              onNodeClick={handleOnNodeClick}
              selectedNode={selectedNode}
              onDelete={handleOnDelete}
              onRefresh={handleOnRefresh}
            />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={80} minSize={25}>
            {selectedNode?.value.isFile && (
              <NoteTitle title={selectedNode?.value.name} />
            )}
            <Editor editor={editor} onClick={handleEditorOnClick} />
          </ResizablePanel>
        </ResizablePanelGroup>
        <BottomMenu charCount={editor?.storage.characterCount.characters()}>
          <Button onClick={handleOnSave}>Save</Button>
        </BottomMenu>
      </div>
    </>
  );
};

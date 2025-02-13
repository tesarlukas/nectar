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
import { join } from "@tauri-apps/api/path";
import { NOTES_PATH } from "@/constants/notesPath";
import { ROOT_DIR } from "@/constants/rootDir";

export const EditorView = () => {
  const hiveName = useHiveStore((state) => state.hiveName);
  const { editor, handleEditorOnClick } = useEditor();
  const { saveNote, buildDirectoryTree } = useFileExplorer();

  const handleOnNoteClick = (content: unknown) => {
    console.log(content);
    editor?.commands.setContent(JSON.parse(content))
  };

  const handleOnSave = async () => {
    const initPath = await join(hiveName, NOTES_PATH);

    saveNote(editor?.getJSON());
    console.log("what we saving", editor?.getJSON())

    await buildDirectoryTree(initPath, ROOT_DIR);
  };

  return (
    <>
      <div className="flex flex-col h-full min-h-0">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20} minSize={10}>
            <FileExplorer onNoteClick={handleOnNoteClick} />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={80} minSize={25}>
            <Editor editor={editor} onClick={handleEditorOnClick} />
          </ResizablePanel>
        </ResizablePanelGroup>
        <Button onClick={handleOnSave}>Save</Button>
        <BottomMenu charCount={editor?.storage.characterCount.characters()} />
      </div>
    </>
  );
};

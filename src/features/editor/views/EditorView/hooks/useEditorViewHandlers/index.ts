import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type {
  FileTreeNode,
  useFileExplorer,
} from "../../parts/FileExplorer/hooks/useFileExplorer";
import type { Editor } from "@tiptap/react";
import { EMPTY_NOTE } from "../../parts/FileExplorer/index.preset";
import { useEditorStatesRef } from "@/stores/useEditorStateStore/useEditorStatesRef";
import { resetEditorContent } from "../../parts/Editor/utils/updateEditorContent";
import { useEditorStateStore } from "@/stores/useEditorStateStore";
import type { Note } from "../../types";

// Create a type that represents all the returns from useFileExplorer
type FileExplorerReturns = ReturnType<typeof useFileExplorer>;

interface EditorViewHandlersProps extends FileExplorerReturns {
  // Additional props not from FileExplorer
  editor: Editor | null;
  hiveName: string;
}

export const useEditorViewHandlers = ({
  setSelectedNode,
  selectedNoteNode,
  setSelectedNoteNode,
  readNote,
  saveNote,
  removeNodeByPath,
  addNewNode,
  renameNodeAndNoteOrDir,
  moveNote,
  initializeFileTree,
  editor,
  hiveName,
}: EditorViewHandlersProps) => {
  const { t } = useTranslation();
  const editorStatesRef = useEditorStatesRef();
  const clearEditorStates = useEditorStateStore(
    (state) => state.clearEditorStates,
  );

  const handleOnNodeClick = useCallback(
    async (node: FileTreeNode) => {
      if (node.value.isDirectory) {
        setSelectedNode(node);
        return;
      }

      setSelectedNode(node);
      setSelectedNoteNode(node);

      // if it's just a directory, then end here
      if (node.value.isDirectory) return;

      // search for state of this node already in the memory only storage first
      const noteState = editorStatesRef.current[node.value.path];

      // TODO: there is some issue with state mismatch when the editor gets
      // remounted, transaction and range errors are occurring, probably some
      // state mismatches because of different instances
      if (noteState) {
        editor?.view.updateState(noteState);
        editor?.chain().setContent(noteState.doc.content).focus("end").run();
        return;
      }

      // if there is none, just read from the filesystem
      const noteContent = await readNote(node.value.path);

      if (noteContent) {
        resetEditorContent({ editor, newContent: noteContent.editorContent });
      }
    },
    [editor, readNote, setSelectedNode, setSelectedNoteNode],
  );

  const handleOnSave = useCallback(async () => {
    if (!selectedNoteNode) return;

    try {
      const noteContent = await readNote(selectedNoteNode.value.path);

      if (!noteContent) return;

      const newNoteContent: Note = {
        ...noteContent,
        lastModifiedAt: new Date().toISOString(),
        editorContent: editor?.getJSON() ?? EMPTY_NOTE,
      };

      await saveNote(selectedNoteNode, newNoteContent);
    } catch (error) {
      toast.error(t(`failedToSaveNote: ${error}`));
    }
  }, [editor, readNote, saveNote, selectedNoteNode, t]);

  const handleOnDelete = useCallback(
    async (node: FileTreeNode) => {
      await removeNodeByPath(node.value.path);
    },
    [removeNodeByPath],
  );

  const handleOnCreateFile = useCallback(
    async (parentNode: FileTreeNode, name: string) => {
      await addNewNode(parentNode.value.path, name, {
        isDirectory: false,
        content: EMPTY_NOTE,
      });
    },
    [addNewNode],
  );

  const handleOnCreateDir = useCallback(
    async (parentNode: FileTreeNode, name: string) => {
      await addNewNode(parentNode.value.path, name, {
        isDirectory: true,
        content: EMPTY_NOTE,
      });
    },
    [addNewNode],
  );

  const handleOnRename = useCallback(
    async (node: FileTreeNode, name: string) => {
      await renameNodeAndNoteOrDir(node, name);
    },
    [renameNodeAndNoteOrDir],
  );

  const handleOnRefresh = useCallback(async () => {
    await initializeFileTree(hiveName);
  }, [hiveName, initializeFileTree]);

  const handleOnMove = useCallback(
    async (node: FileTreeNode, targetNode: FileTreeNode) => {
      await moveNote(node, targetNode);
    },
    [moveNote],
  );

  // very important otherwise the states get messed up
  useEffect(() => {
    return () => clearEditorStates();
  }, []);

  return {
    handleOnNodeClick,
    handleOnSave,
    handleOnDelete,
    handleOnCreateFile,
    handleOnCreateDir,
    handleOnRename,
    handleOnRefresh,
    handleOnMove,
  };
};

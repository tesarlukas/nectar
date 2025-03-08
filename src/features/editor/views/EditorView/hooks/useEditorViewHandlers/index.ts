import { useCallback } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type {
  FileTreeNode,
  useFileExplorer,
} from "../../parts/FileExplorer/hooks/useFileExplorer";
import type { Editor } from "@tiptap/react";
import { EMPTY_NOTE } from "../../parts/FileExplorer/index.preset";

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

  const handleOnNodeClick = useCallback(
    async (node: FileTreeNode) => {
      if (node.value.isDirectory) {
        setSelectedNode(node);
        return;
      }

      setSelectedNode(node);
      setSelectedNoteNode(node);

      if (node.value.isDirectory) return;

      const noteContent = await readNote(node.value.path);

      if (noteContent) editor?.commands.setContent(noteContent.editorContent);
    },
    [editor, readNote, setSelectedNode, setSelectedNoteNode],
  );

  const handleOnSave = useCallback(async () => {
    if (!selectedNoteNode) return;

    try {
      const noteContent = await readNote(selectedNoteNode.value.path);

      if (!noteContent) return;

      const newNoteContent = {
        ...noteContent,
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

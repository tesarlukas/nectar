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
import type { useJumplist } from "../useJumplist";
import { exists } from "@tauri-apps/plugin-fs";
import { ROOT_DIR } from "@/constants/rootDir";

// Create a type that represents all the returns from useFileExplorer
type FileExplorerReturns = ReturnType<typeof useFileExplorer>;
type UseJumplistReturns = Pick<
  ReturnType<typeof useJumplist>,
  | "addItemToJumplist"
  | "setIndexByItem"
  | "createNewItem"
  | "jumplistRef"
  | "moveJumplistOut"
  | "moveJumplistIn"
  | "isNodeCurrentJumplistItem"
  | "clearJumplist"
>;

interface EditorViewHandlersProps
  extends FileExplorerReturns,
    UseJumplistReturns {
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
  pasteNote,
  initializeFileTree,
  editor,
  hiveName,
  jumplistRef,
  addItemToJumplist,
  setIndexByItem,
  createNewItem,
  moveJumplistOut,
  moveJumplistIn,
  isNodeCurrentJumplistItem,
  clearJumplist,
}: EditorViewHandlersProps) => {
  const { t } = useTranslation("editorView");
  const editorStatesRef = useEditorStatesRef();
  const reassignEditorState = useEditorStateStore(
    (state) => state.reassignEditorState,
  );
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

      if (!isNodeCurrentJumplistItem(node)) {
        const newJumplistItem = createNewItem(node);
        if (newJumplistItem) {
          addItemToJumplist(newJumplistItem);
          setIndexByItem(newJumplistItem);
        }
      }

      await loadNote(node);
    },
    [editor],
  );

  const loadNote = useCallback(
    async (node: FileTreeNode) => {
      // search for state of this node already in the memory only storage first
      const noteState = editorStatesRef.current[node.value.path]?.editorState;

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
    [editor],
  );

  const handleMoveJumplistIn = async () => {
    const nextNode = jumplistRef.current[moveJumplistIn()].node;
    if (!nextNode) {
      return;
    }

    setSelectedNode(nextNode);
    setSelectedNoteNode(nextNode);
    await loadNote(nextNode);
  };

  const handleMoveJumplistOut = async () => {
    const nextNode = jumplistRef.current[moveJumplistOut()].node;
    if (!nextNode) {
      return;
    }

    setSelectedNode(nextNode);
    setSelectedNoteNode(nextNode);
    await loadNote(nextNode);
  };

  const handleOnSave = useCallback(async () => {
    if (!selectedNoteNode) return;

    try {
      if (await exists(selectedNoteNode.value.path, { baseDir: ROOT_DIR })) {
        const noteContent = await readNote(selectedNoteNode.value.path);

        if (!noteContent) return;

        const newNoteContent: Note = {
          ...noteContent,
          lastModifiedAt: new Date().toISOString(),
          editorContent: editor?.getJSON() ?? EMPTY_NOTE,
        };

        await saveNote(selectedNoteNode, newNoteContent);
      } else {
        addNewNode(
          selectedNoteNode.value.dirPath,
          selectedNoteNode.value.name,
          { isDirectory: false, content: editor?.getJSON ?? EMPTY_NOTE },
        );
      }
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
      const path = parentNode.value.isFile
        ? parentNode.value.dirPath
        : parentNode.value.path;

      await addNewNode(path, name, {
        isDirectory: false,
        content: EMPTY_NOTE,
      });
    },
    [addNewNode],
  );

  const handleOnCreateDir = useCallback(
    async (parentNode: FileTreeNode, name: string) => {
      const path = parentNode.value.isFile
        ? parentNode.value.dirPath
        : parentNode.value.path;

      await addNewNode(path, name, {
        isDirectory: true,
        content: EMPTY_NOTE,
      });
    },
    [addNewNode],
  );

  const handleOnRename = async (node: FileTreeNode, name: string) => {
    await renameNodeAndNoteOrDir(
      node,
      name,
      reassignEditorState,
      clearJumplist,
    );
  };

  const handleOnRefresh = useCallback(async () => {
    await initializeFileTree(hiveName);

    toast.success(t("explorerRefreshed"));
  }, [hiveName, initializeFileTree]);

  const handleOnMove = useCallback(
    async (node: FileTreeNode, targetNode: FileTreeNode) => {
      await moveNote(node, targetNode);
      clearJumplist();
    },
    // NOTE: these call internally buildDirectoryTree function which needs
    // hiveName and they access it via the store, therefore it's needed to
    // recreate
    [hiveName],
  );

  const handleOnPaste = useCallback(
    async (clipboardNode: FileTreeNode, targetNode: FileTreeNode) => {
      await pasteNote(clipboardNode, targetNode);
    },
    [hiveName],
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
    handleOnPaste,
    setSelectedNoteNode,
    handleMoveJumplistIn,
    handleMoveJumplistOut,
  };
};

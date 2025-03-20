import type { EditorState as TiptapEditorState } from "@tiptap/pm/state";
import { create } from "zustand";

export interface EditorState {
  saved: boolean;
  editorState: TiptapEditorState;
}

export type EditorStates = Record<string, EditorState>;

export interface EditorStateStore {
  editorStates: EditorStates;
  /* ids are in these cases the path of the node since it is unique */
  addEditorState: (id: string, editorState: EditorState) => void;
  removeEditorState: (id: string) => void;
  clearEditorStates: () => void;
  setEditorStateSaved: (id: string, saved: boolean) => void;
}

export const useEditorStateStore = create<EditorStateStore>((set) => ({
  editorStates: {},
  addEditorState: (id: string, editorState: EditorState) =>
    set((state) => ({
      editorStates: { ...state.editorStates, [id]: editorState },
    })),
  removeEditorState: (id: string) =>
    set((state) => {
      const newEditorStates = { ...state.editorStates };
      delete newEditorStates[id];
      return { editorStates: newEditorStates };
    }),
  clearEditorStates: () => set(() => ({ editorStates: {} })),
  setEditorStateSaved: (id: string, saved: boolean) =>
    set((state) => {
      const newEditorStates = {
        ...state.editorStates,
        [id]: { ...state.editorStates[id], saved },
      };

      return { editorStates: newEditorStates };
    }),
}));

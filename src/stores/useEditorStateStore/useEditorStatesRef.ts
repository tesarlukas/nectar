import { useEffect, useRef } from "react";
import { useEditorStateStore } from ".";

export const useEditorStatesRef = () => {
  const editorStatesRef = useRef(useEditorStateStore.getState().editorStates);

  useEffect(() => {
    const unsubscribe = useEditorStateStore.subscribe((state) => {
      editorStatesRef.current = state.editorStates;
    });

    return () => unsubscribe();
  }, []);

  return editorStatesRef;
};

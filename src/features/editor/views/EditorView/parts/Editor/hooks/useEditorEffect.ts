import { debounce } from "@/utils/debounce";
import type { EditorEvents } from "@tiptap/react";
import { useEffect } from "react";

interface EditorEffectOptions {
  useDebounce?: boolean;
  debounceTime?: number;
}

interface Editor {
  on: (eventType: keyof EditorEvents, handler: () => unknown) => void;
  off: (eventType: keyof EditorEvents, handler: () => unknown) => void;
}

export const useEditorEffect = <T extends Editor | null>(
  editor: T,
  eventType: keyof EditorEvents,
  callback: () => unknown,
  { useDebounce = false, debounceTime = 300 }: EditorEffectOptions = {},
): void => {
  useEffect(() => {
    if (!editor) return;

    const handler = useDebounce ? debounce(callback, debounceTime) : callback;

    editor.on(eventType, handler);

    return () => {
      editor.off(eventType, handler);
    };
  }, [editor, eventType, callback, useDebounce, debounceTime]);
};

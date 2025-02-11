import { type BaseDirectory, readDir } from "@tauri-apps/plugin-fs";
import { useCallback } from "react";

export const useFileExplorer = () => {
  const readNotes = useCallback(async (baseDir: BaseDirectory) => {
    await readDir("notes", { baseDir });
  }, []);

  return { readNotes };
};

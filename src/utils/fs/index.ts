import {
  writeTextFile,
  readTextFile,
  BaseDirectory,
  create,
} from "@tauri-apps/plugin-fs";

// Save note
export const saveNote = async (noteId: string, content: unknown) => {
  try {
    // Convert editor content to string
    const contentString = JSON.stringify(content);

    // Save to local file system using Tauri
    await writeTextFile(`${noteId}.json`, contentString, {
      baseDir: BaseDirectory.AppData,
    });
  } catch (error) {
    console.error("Failed to save note:", error);
  }
};

// Load note
const loadNote = async (noteId: string) => {
  try {
    const content = await readTextFile(`notes/${noteId}.json`);
    return JSON.parse(content);
  } catch (error) {
    console.error("Failed to load note:", error);
    return null;
  }
};

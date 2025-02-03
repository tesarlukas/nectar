import {
  writeTextFile,
  readTextFile,
  BaseDirectory,
  mkdir,
  exists,
} from "@tauri-apps/plugin-fs";

// Save note
export const saveNote = async (noteId: string, content: unknown) => {
  try {
    // Convert editor content to string
    const contentString = JSON.stringify(content);

    // Save to local file system using Tauri
    await writeTextFile(`${noteId}.json`, contentString, {
      baseDir: BaseDirectory.Document,
    });
  } catch (error) {
    console.error("Failed to save note:", error);
  }
};

// Load note
export const loadNote = async (noteId: string) => {
  try {
    const content = await readTextFile(`notes/${noteId}.json`);
    return JSON.parse(content);
  } catch (error) {
    console.error("Failed to load note:", error);
    return null;
  }
};

export const writeJson = async (
  location: string,
  filename: string,
  content: unknown,
) => {
  try {
    const contentString = JSON.stringify(content);

    const doesDirExist = await exists(location, {
      baseDir: BaseDirectory.AppData,
    });

    if (!doesDirExist) {
      await mkdir(location, {
        baseDir: BaseDirectory.AppData,
        recursive: true,
      });
    }

    await writeTextFile(`${location}/${filename}.json`, contentString, {
      baseDir: BaseDirectory.AppData,
    });
  } catch (errors) {
    console.error("Failed to save json", errors);
  }
};

import {
  writeTextFile,
  readTextFile,
  mkdir,
  exists,
} from "@tauri-apps/plugin-fs";
import { join } from "@tauri-apps/api/path";
import { ROOT_DIR } from "@/constants/rootDir";

export const writeJson = async <T>(
  locationDirs: string[],
  filename: string,
  content: T,
): Promise<void> => {
  try {
    const contentString = JSON.stringify(content);
    const fullLocationPath = await join(...locationDirs);
    const fullPath = await join(...locationDirs, `${filename}.json`);

    const doesDirExist = await exists(fullLocationPath, {
      baseDir: ROOT_DIR,
    });

    if (!doesDirExist) {
      await mkdir(fullLocationPath, {
        baseDir: ROOT_DIR,
        recursive: true,
      });
    }

    await writeTextFile(`${fullPath}`, contentString, {
      baseDir: ROOT_DIR,
    });
  } catch (errors) {
    console.error("Failed to write json file", errors);

    throw errors;
  }
};

export const readJson = async (path: string): Promise<string> => {
  const jsonContent = await readTextFile(path, {
    baseDir: ROOT_DIR,
  });

  return jsonContent;
};

// Save note
export const saveNote = async (noteId: string, content: unknown) => {
  try {
    // Convert editor content to string
    const contentString = JSON.stringify(content);

    // Save to local file system using Tauri
    await writeTextFile(`${noteId}.json`, contentString, {
      baseDir: ROOT_DIR,
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

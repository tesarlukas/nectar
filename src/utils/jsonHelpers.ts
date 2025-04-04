import {
  writeTextFile,
  readTextFile,
  mkdir,
  exists,
} from "@tauri-apps/plugin-fs";
import { type BaseDirectory, join } from "@tauri-apps/api/path";
import { ROOT_DIR } from "@/constants/rootDir";
import { appendJson } from "./nodeHelpers";

export const writeJson = async <T>(
  location: string,
  filename: string,
  content: T,
  baseDir: BaseDirectory = ROOT_DIR,
): Promise<void> => {
  try {
    const doesDirExist = await exists(location, {
      baseDir,
    });

    if (!doesDirExist) {
      await mkdir(location, {
        baseDir,
        recursive: true,
      });
    }

    // NOTE: it seems the join function is actually pretty smart and does not
    // append the `.json` to the file if there is already one
    const fullPath = await join(location, appendJson(filename));
    const contentString = JSON.stringify(content);
    await writeTextFile(fullPath, contentString, {
      baseDir,
    });
  } catch (errors) {
    console.error("Failed to write json file", errors);

    throw errors;
  }
};

export const readJson = async <T>(
  path: string,
  baseDir: BaseDirectory = ROOT_DIR,
): Promise<T | undefined> => {
  try {
    const jsonContent = JSON.parse(
      await readTextFile(appendJson(path), {
        baseDir,
      }),
    ) as T;

    return jsonContent;
  } catch (errors) {
    console.warn("Failed to read the json file", errors);
  }
};

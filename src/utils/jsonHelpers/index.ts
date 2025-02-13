import {
  writeTextFile,
  readTextFile,
  mkdir,
  exists,
} from "@tauri-apps/plugin-fs";
import { type BaseDirectory, join } from "@tauri-apps/api/path";
import { ROOT_DIR } from "@/constants/rootDir";

export const writeJson = async <T>(
  locationDirs: string[],
  filename: string,
  content: T,
  baseDir: BaseDirectory = ROOT_DIR,
): Promise<void> => {
  try {
    const contentString = JSON.stringify(content);
    const fullLocationPath = await join(...locationDirs);
    const fullPath = await join(...locationDirs, `${filename}.json`);

    const doesDirExist = await exists(fullLocationPath, {
      baseDir,
    });

    if (!doesDirExist) {
      await mkdir(fullLocationPath, {
        baseDir,
        recursive: true,
      });
    }

    await writeTextFile(`${fullPath}`, contentString, {
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
    const jsonContent = JSON.parse((await readTextFile(path, {
      baseDir,
    }))) as T;

    return jsonContent;
  } catch (errors) {
    console.error("Failed to read the json file", errors);
  }
};

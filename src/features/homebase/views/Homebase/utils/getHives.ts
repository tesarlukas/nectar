import { HIDDEN_DIR } from "@/constants/hiddenDir";
import { NOTES_PATH } from "@/constants/notesPath";
import { ROOT_DIR } from "@/constants/rootDir";
import { readDir } from "@tauri-apps/plugin-fs";

export const getHives = async () => {
  const dirEntries = await readDir("", { baseDir: ROOT_DIR });
  const hives = [];

  for (const entry of dirEntries) {
    if (entry.isFile) {
      break;
    }

    if (await isHive(entry.name)) {
      hives.push(entry);
    }
  }

  return hives;
};

export const isHive = async (path: string) => {
  const dirEntries = await readDir(path, { baseDir: ROOT_DIR });
  const dirEntriesNames = dirEntries.map((entry) => entry.name);

  if (
    dirEntriesNames.includes(HIDDEN_DIR) &&
    dirEntriesNames.includes(NOTES_PATH)
  )
    return true;

  return false;
};

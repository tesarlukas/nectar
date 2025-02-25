import { APP_CONFIG_DIR } from "@/constants/appConfigDir";
import { HIDDEN_DIR } from "@/constants/hiddenDir";
import { ROOT_DIR } from "@/constants/rootDir";
import { SETTINGS_PATH } from "@/constants/settingsPath";
import { useColorTheme } from "@/features/appearance/colorTheme/hooks/useColorTheme";
import { readJson, writeJson } from "@/utils/jsonHelpers";
import { path } from "@tauri-apps/api";
import { join } from "@tauri-apps/api/path";
import { type BaseDirectory, exists, mkdir } from "@tauri-apps/plugin-fs";
import { useCallback } from "react";

export const useInitialize = () => {
  const { initializeTheme } = useColorTheme();

  const initHive = useCallback(
    async (
      hiveName: string,
      baseDir: BaseDirectory = ROOT_DIR,
    ): Promise<void> => {
      //const doesDirExist = await exists(hiveName, { baseDir });
      const hiddenFilesPath = await join(hiveName, HIDDEN_DIR);
      const doesHiddenDirExist = await exists(hiddenFilesPath);

      if (doesHiddenDirExist) {
        const hiveInfo = await readJson<{ hiveName: string }>(
          hiddenFilesPath,
          baseDir,
        );

        if (hiveInfo?.hiveName) {
          console.info("Hive has already been initialized");
          return;
        }

        await writeJson(hiddenFilesPath, "info", { hiveName: hiveName });
      }

      try {
        await mkdir(hiddenFilesPath, { baseDir, recursive: true });
      } catch (errors) {
        console.error("Errors while creating hidden files dir: ", errors);
      }

      await writeJson(hiddenFilesPath, "info", { hiveName: hiveName });
    },
    [],
  );

  const initNotes = async (
    hiveName: string,
    baseDir: BaseDirectory = ROOT_DIR,
  ): Promise<void> => {
    const notesDirLocation = await path.join(hiveName, "notes");

    const doesDirExist = await exists(notesDirLocation, { baseDir });

    if (doesDirExist) {
      console.info("Notes are already initialized");
      return;
    }

    await mkdir(notesDirLocation, {
      baseDir,
    });
  };

  const initSettings = async (
    baseDir: BaseDirectory = APP_CONFIG_DIR,
  ): Promise<void> => {
    const doesSettingsDirExist = await exists(SETTINGS_PATH, { baseDir });

    if (!doesSettingsDirExist) {
      await mkdir(SETTINGS_PATH, {
        baseDir,
      });
    }

    await initializeTheme();
    // TODO: check if keymap.json exists, if not, initialize it
  };

  return { initHive, initNotes, initSettings };
};

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
          console.log("Hive has already been initialized");
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
      console.log("Notes are already initialized");
      return;
    }

    await mkdir(notesDirLocation, {
      baseDir,
    });
  };

  const initSettings = async (
    hiveName: string,
    baseDir: BaseDirectory = APP_CONFIG_DIR,
  ): Promise<void> => {
    const settingsDirLocation = await path.join(hiveName, "settings");

    // check if settings directory exists, if not, create it
    const doesDirExist = await exists(settingsDirLocation, { baseDir });
    if (!doesDirExist) {
      await mkdir(settingsDirLocation, {
        baseDir,
      });
    }

    // check if colorTheme.json exists, if not, initialize it
    const colorThemeLocation = await path.join(
      hiveName,
      SETTINGS_PATH,
      "colorTheme.json",
    );
    const doesColorThemeJsonExist = await exists(colorThemeLocation, {
      baseDir,
    });
    if (!doesColorThemeJsonExist) {
      await initializeTheme();
    }

    // TODO: check if keymap.json exists, if not, initialize it
  };

  return { initHive, initNotes, initSettings };
};

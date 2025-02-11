import { ROOT_DIR } from "@/constants/rootDir";
import { useColorTheme } from "@/features/appearance/colorTheme/hooks/useColorTheme";
import { ThemeFlavour } from "@/features/appearance/colorTheme/types";
import { colorThemes } from "@/features/appearance/colorTheme/variants";
import { useHiveStore } from "@/stores/useHiveStore";
import { path } from "@tauri-apps/api";
import { type BaseDirectory, exists, mkdir } from "@tauri-apps/plugin-fs";

export const useInitialize = () => {
  const storedHiveName = useHiveStore((state) => state.hiveName);
  const { writeTheme } = useColorTheme();

  const initHive = async (
    hiveName: string,
    baseDir: BaseDirectory = ROOT_DIR,
  ): Promise<void> => {
    const doesDirExist = await exists(hiveName, { baseDir });

    if (doesDirExist) {
      console.log("Directory with this name already exists");
      return;
    }

    await mkdir(hiveName, {
      baseDir,
    });
  };

  const initNotes = async (
    baseDir: BaseDirectory = ROOT_DIR,
  ): Promise<void> => {
    const notesDirLocation = await path.join(storedHiveName, "notes");

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
    baseDir: BaseDirectory = ROOT_DIR,
  ): Promise<void> => {
    const settingsDirLocation = await path.join(storedHiveName, "settings");

    // check if settings directory exists, if not, create it
    const doesDirExist = await exists(settingsDirLocation, { baseDir });
    if (!doesDirExist) {
      await mkdir(settingsDirLocation, {
        baseDir,
      });
    }

    // check if colorTheme.json exists, if not, initialize it
    const colorThemeLocation = await path.join(
      storedHiveName,
      "settings",
      "colorTheme.json",
    );
    console.log("colorThemeLocation", colorThemeLocation);
    const doesColorThemeJsonExist = await exists(colorThemeLocation, {
      baseDir,
    });
    console.log("doesColorThemeJsonExist", doesColorThemeJsonExist);
    if (!doesColorThemeJsonExist) {
      await writeTheme(
        ThemeFlavour.Standard,
        colorThemes[ThemeFlavour.Standard],
        baseDir,
      );
    }

    // TODO: check if keymap.json exists, if not, initialize it
  };

  return { initHive, initNotes, initSettings };
};

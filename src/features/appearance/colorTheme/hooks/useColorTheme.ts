import { readJson, writeJson } from "@/utils/jsonHelpers";
import {
  ColorScheme,
  ThemeFlavour,
  type ColorTheme,
  type StoredColorTheme,
} from "../types";
import type { BaseDirectory } from "@tauri-apps/plugin-fs";
import { APP_CONFIG_DIR } from "@/constants/appConfigDir";
import { SETTINGS_PATH } from "@/constants/settingsPath";
import { useCallback } from "react";
import { colorThemes } from "../variants";
import { join } from "@tauri-apps/api/path";
import { useEventEmitter } from "@/features/events/hooks/useEventEmitter";
import { EventId } from "@/features/events/eventEmitter";

export const useColorTheme = () => {
  const emitter = useEventEmitter();

  const readTheme = useCallback(async () => {
    return await readJson<StoredColorTheme>(
      await join(SETTINGS_PATH, "colorTheme"),
      APP_CONFIG_DIR,
    );
  }, []);

  const writeTheme = useCallback(
    async (
      colorThemeName: ThemeFlavour = ThemeFlavour.Standard,
      colorTheme: ColorTheme = colorThemes.standard,
      colorScheme: ColorScheme = ColorScheme.Light,
      baseDir: BaseDirectory = APP_CONFIG_DIR,
    ): Promise<void> => {
      try {
        await writeJson<StoredColorTheme>(
          SETTINGS_PATH,
          "colorTheme",
          {
            name: colorThemeName,
            colorTheme,
            colorScheme,
          },
          baseDir,
        );
      } catch (errors) {
        console.error("Something went wrong in the writeTheme", errors);
      }
    },
    [],
  );

  const setColorScheme = useCallback((colorScheme: ColorScheme) => {
    const root = document.documentElement;

    root.classList.remove(ColorScheme.Dark, ColorScheme.Light);
    root.classList.add(colorScheme);

    emitter(EventId.ThemeChanged, colorScheme);
  }, []);

  const toggleColorScheme = useCallback(async () => {
    const root = document.documentElement;

    if (root.classList.contains(ColorScheme.Light)) {
      setColorScheme(ColorScheme.Dark);

      await writeTheme(undefined, undefined, ColorScheme.Dark);
    } else {
      setColorScheme(ColorScheme.Light);

      await writeTheme(undefined, undefined, ColorScheme.Light);
    }
  }, []);

  const initializeTheme = useCallback(async () => {
    const storedTheme = await readTheme();

    setColorScheme(storedTheme?.colorScheme ?? ColorScheme.Dark);

    if (!storedTheme) {
      await writeTheme();
    }
  }, []);

  return {
    writeTheme,
    toggleColorScheme,
    initializeTheme,
    setColorScheme,
  };
};

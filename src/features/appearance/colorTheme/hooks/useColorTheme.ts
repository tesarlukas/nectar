import { readJson, writeJson } from "@/utils/fs";
import {
  ColorScheme,
  type ColorTheme,
  ThemeFlavour,
  type ColorThemeVariables,
  type StoredColorTheme,
} from "../types";
import { colorThemes } from "../variants";
import { path } from "@tauri-apps/api";

export const useColorTheme = () => {
  /** @deprecated there is a different theming option created */
  const updateColorTheme = async (
    colorScheme: ColorScheme = ColorScheme.Light,
    flavour: ThemeFlavour = ThemeFlavour.Standard,
  ) => {
    const colorTheme = Object.entries(colorThemes[flavour][colorScheme]) as [
      keyof ColorThemeVariables,
      string,
    ][];

    for (const [colorVarKey, colorVar] of colorTheme) {
      document.documentElement.style.setProperty(colorVarKey, colorVar);
    }

    await writeTheme(flavour, colorThemes[flavour]);
  };

  const writeTheme = async (
    colorThemeName: ThemeFlavour,
    colorTheme: ColorTheme,
  ): Promise<void> => {
    try {
      await writeJson<StoredColorTheme>(
        ["settings", "appearance"],
        "colorTheme",
        {
          name: colorThemeName,
          colorTheme: colorTheme,
        },
      );
    } catch (errors) {
      console.error("Something went wrong in the writeTheme", errors);
    }
  };

  const readTheme = async (): Promise<StoredColorTheme | undefined> => {
    try {
      const theme = await readJson(
        await path.join(...["settings", "appearance", "colorTheme.json"]),
      );

      return JSON.parse(theme) as StoredColorTheme;
    } catch (errors) {
      console.error("Could not read the color theme:", errors);
    }
  };

  const setColorScheme = (colorScheme: ColorScheme) => {
    const root = document.documentElement;

    root.classList.remove("dark", "light");
    root.classList.add(colorScheme);
  };

  const toggleColorScheme = () => {
    const root = document.documentElement;
    console.log("classList", root.classList);

    if (root.classList.contains("light")) {
      root.classList.remove("light");
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
  };

  const initializeTheme = () => {
    const root = document.documentElement;

    root.classList.add("dark");
  };

  return {
    updateColorTheme,
    readTheme,
    toggleColorScheme,
    initializeTheme,
    setColorScheme,
  };
};

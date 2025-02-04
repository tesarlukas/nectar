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
      console.error("Something went wrong in the writeTheme: ", errors);
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

  return { updateColorTheme, readTheme };
};

import { writeJson } from "@/utils/fs";
import {
  ColorScheme,
  type ColorTheme,
  ThemeFlavour,
  type ColorThemeVariables,
} from "../types";
import { colorThemes } from "../variants";

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
    colorThemeName: string,
    colorTheme: ColorTheme,
  ): Promise<void> => {
    try {
      await writeJson(["settings", "appearance"], "colorTheme", {
        colorThemeName: colorThemeName,
        colorTheme: colorTheme,
      });
    } catch (errors) {
      console.error("Something went wrong in the writeTheme");
    }
  };

  const readTheme = () => {};

  return { updateColorTheme };
};

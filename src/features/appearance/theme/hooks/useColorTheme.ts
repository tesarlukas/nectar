import { ColorScheme, ThemeFlavour, type ColorThemeVariables } from "../types";
import { colorThemes } from "../variants";

export const useColorTheme = () => {
  const updateColorTheme = (
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
  };

  return { updateColorTheme };
};

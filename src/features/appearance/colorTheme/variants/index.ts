import { type ColorTheme, ThemeFlavour } from "../types";
import { standard } from "./standard";

interface ColorThemes {
  [ThemeFlavour.Standard]: ColorTheme;
}

export const colorThemes: ColorThemes = {
  [ThemeFlavour.Standard]: standard,
};

export const DEFAULT_COLOR_THEME = colorThemes[ThemeFlavour.Standard];

import { type ColorTheme, ThemeFlavour } from "../types";
import { standard } from "./standard";
import { extra } from "./extra";

interface ColorThemes {
  [ThemeFlavour.Standard]: ColorTheme;
  [ThemeFlavour.Extra]: ColorTheme;
}

export const colorThemes: ColorThemes = {
  [ThemeFlavour.Standard]: standard,
  [ThemeFlavour.Extra]: extra,
};

// NOTE: not used yet
//export const DEFAULT_COLOR_THEME = colorThemes[ThemeFlavour.Standard];

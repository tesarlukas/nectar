export enum ThemeFlavour {
  Standard = "standard",
  Extra = "extra",
}

export enum ColorScheme {
  Dark = "dark",
  Light = "light",
}

export interface ColorThemeVariables {
  "--color-primary-0": string;
  "--color-primary-1": string;
  "--color-primary-2": string;
  "--color-primary-3": string;
  "--color-primary-4": string;
  "--color-primary-5": string;

  "--color-secondary-0": string;
  "--color-secondary-1": string;
  "--color-secondary-2": string;
  "--color-secondary-3": string;
  "--color-secondary-4": string;
  "--color-secondary-5": string;

  "--color-accent-0": string;
  "--color-accent-1": string;
  "--color-accent-2": string;
  "--color-accent-3": string;
  "--color-accent-4": string;
  "--color-accent-5": string;

  "--color-warn-0": string;
  "--color-warn-1": string;
  "--color-warn-2": string;
  "--color-warn-3": string;
  "--color-warn-4": string;
  "--color-warn-5": string;

  "--color-danger-0": string;
  "--color-danger-1": string;
  "--color-danger-2": string;
  "--color-danger-3": string;
  "--color-danger-4": string;
  "--color-danger-5": string;
}

export interface ColorTheme {
  [ColorScheme.Light]: ColorThemeVariables;
  [ColorScheme.Dark]: ColorThemeVariables;
}

export interface StoredColorTheme {
  name: ThemeFlavour;
  colorTheme: ColorTheme;
}

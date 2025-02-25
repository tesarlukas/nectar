export enum ThemeFlavour {
  Standard = "standard",
}

export enum ColorScheme {
  Dark = "dark",
  Light = "light",
}

export interface ColorThemeVariables {
  "--background": string;
  "--foreground": string;

  "--muted": string;
  "--muted-foreground": string;

  "--card": string;
  "--card-foreground": string;

  "--popover": string;
  "--popover-foreground": string;

  "--border": string;

  "--input": string;

  "--primary": string;
  "--primary-foreground": string;

  "--secondary": string;
  "--secondary-foreground": string;

  "--accent": string;
  "--accent-foreground": string;

  "--destructive": string;
  "--destructive-foreground": string;

  "--ring": string;

  "--chart-1": string;
  "--chart-2": string;
  "--chart-3": string;
  "--chart-4": string;
  "--chart-5": string;
}

export interface ColorTheme {
  [ColorScheme.Light]: ColorThemeVariables;
  [ColorScheme.Dark]: ColorThemeVariables;
}

export interface StoredColorTheme {
  name: ThemeFlavour;
  colorTheme: ColorTheme;
  colorScheme: ColorScheme;
}

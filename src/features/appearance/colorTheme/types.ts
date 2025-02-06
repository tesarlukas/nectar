export enum ThemeFlavour {
  Standard = "standard",
  Extra = "extra",
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

  "--destructive": string;
  "--destructive-foreground": string;

  "--ring": string;
}

export interface ColorTheme {
  [ColorScheme.Light]: ColorThemeVariables;
  [ColorScheme.Dark]: ColorThemeVariables;
}

export interface StoredColorTheme {
  name: ThemeFlavour;
  colorTheme: ColorTheme;
}

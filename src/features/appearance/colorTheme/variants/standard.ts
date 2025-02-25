import { ColorScheme, type ColorTheme } from "../types";

export const standard: ColorTheme = {
  [ColorScheme.Light]: {
    "--background": "hsl(0 0% 100%)",
    "--foreground": "hsl(222.2 84% 4.9%)",

    "--muted": "hsl(210 40% 96.1%)",
    "--muted-foreground": "hsl(215.4 16.3% 46.9%)",

    "--card": "hsl(0 0% 100%)",
    "--card-foreground": "hsl(222.2 84% 4.9%)",

    "--popover": "hsl(0 0% 100%)",
    "--popover-foreground": "hsl(222.2 84% 4.9%)",

    "--border": "hsl(214.3 31.8% 91.4%)",

    "--input": "hsl(214.3 31.8% 91.4%)",

    "--primary": "hsl(222.2 47.4% 11.2%)",
    "--primary-foreground": "hsl(210 40% 98%)",

    "--secondary": "hsl(210 40% 96.1%)",
    "--secondary-foreground": "hsl(222.2 47.4% 11.2%)",

    "--accent": "hsl(210 40% 96.1%)",
    "--accent-foreground": "hsl(222.2 47.4% 11.2%)",

    "--destructive": "hsl(0 84.2% 60.2%)",
    "--destructive-foreground": "hsl(210 40% 98%)",

    "--ring": "hsl(222.2 84% 4.9%)",

    "--chart-1": "hsl(12 76% 61%)",
    "--chart-2": "hsl(173 58% 39%)",
    "--chart-3": "hsl(197 37% 24%)",
    "--chart-4": "hsl(43 74% 66%)",
    "--chart-5": "hsl(27 87% 67%)",
  },
  [ColorScheme.Dark]: {
    "--background": "hsl(222.2 84% 4.9%)",
    "--foreground": "hsl(210 40% 98%)",

    "--muted": "hsl(217.2 32.6% 17.5%)",
    "--muted-foreground": "hsl(215 20.2% 65.1%)",

    "--card": "hsl(222.2 84% 4.9%)",
    "--card-foreground": "hsl(210 40% 98%)",

    "--popover": "hsl(222.2 84% 4.9%)",
    "--popover-foreground": "hsl(210 40% 98%)",

    "--border": "hsl(217.2 32.6% 17.5%)",

    "--input": "hsl(217.2 32.6% 17.5%)",

    "--primary": "hsl(210 40% 98%)",
    "--primary-foreground": "hsl(222.2 47.4% 11.2%)",

    "--secondary": "hsl(217.2 32.6% 17.5%)",
    "--secondary-foreground": "hsl(210 40% 98%)",

    "--accent": "hsl(217.2 32.6% 17.5%)",
    "--accent-foreground": "hsl(210 40% 98%)",

    "--destructive": "hsl(0 62.8% 30.6%)",
    "--destructive-foreground": "hsl(210 40% 98%)",

    "--ring": "hsl(212.7 26.8% 83.9%)",

    "--chart-1": "hsl(220 70% 50%)",
    "--chart-2": "hsl(160 60% 45%)",
    "--chart-3": "hsl(30 80% 55%)",
    "--chart-4": "hsl(280 65% 60%)",
    "--chart-5": "hsl(340 75% 55%)",
  },
};

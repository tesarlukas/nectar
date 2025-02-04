import { ColorScheme, type ColorTheme } from "../types";

export const standard: ColorTheme = {
  [ColorScheme.Light]: {
    "--color-primary-0": "oklch(60% 0.15 240)", // Most vibrant blue
    "--color-primary-1": "oklch(70% 0.12 240)",
    "--color-primary-2": "oklch(80% 0.09 240)",
    "--color-primary-3": "oklch(90% 0.06 240)",
    "--color-primary-4": "oklch(95% 0.03 240)",
    "--color-primary-5": "oklch(98% 0.01 240)", // Lightest, least vibrant

    "--color-secondary-0": "oklch(60% 0.15 280)", // Most vibrant purple
    "--color-secondary-1": "oklch(70% 0.12 280)",
    "--color-secondary-2": "oklch(80% 0.09 280)",
    "--color-secondary-3": "oklch(90% 0.06 280)",
    "--color-secondary-4": "oklch(95% 0.03 280)",
    "--color-secondary-5": "oklch(98% 0.01 280)",

    "--color-accent-0": "oklch(60% 0.15 80)", // Most vibrant orange
    "--color-accent-1": "oklch(70% 0.12 80)",
    "--color-accent-2": "oklch(80% 0.09 80)",
    "--color-accent-3": "oklch(90% 0.06 80)",
    "--color-accent-4": "oklch(95% 0.03 80)",
    "--color-accent-5": "oklch(98% 0.01 80)",

    "--color-warn-0": "oklch(60% 0.15 90)", // Most vibrant yellow
    "--color-warn-1": "oklch(70% 0.12 90)",
    "--color-warn-2": "oklch(80% 0.09 90)",
    "--color-warn-3": "oklch(90% 0.06 90)",
    "--color-warn-4": "oklch(95% 0.03 90)",
    "--color-warn-5": "oklch(98% 0.01 90)",

    "--color-danger-0": "oklch(60% 0.15 30)", // Most vibrant red
    "--color-danger-1": "oklch(70% 0.12 30)",
    "--color-danger-2": "oklch(80% 0.09 30)",
    "--color-danger-3": "oklch(90% 0.06 30)",
    "--color-danger-4": "oklch(95% 0.03 30)",
    "--color-danger-5": "oklch(98% 0.01 30)",
  },
  [ColorScheme.Dark]: {
    "--color-primary-0": "oklch(60% 0.15 240)", // Most vibrant blue
    "--color-primary-1": "oklch(50% 0.12 240)",
    "--color-primary-2": "oklch(40% 0.09 240)",
    "--color-primary-3": "oklch(30% 0.06 240)",
    "--color-primary-4": "oklch(20% 0.03 240)",
    "--color-primary-5": "oklch(10% 0.01 240)", // Darkest, least vibrant

    "--color-secondary-0": "oklch(60% 0.15 280)", // Most vibrant purple
    "--color-secondary-1": "oklch(50% 0.12 280)",
    "--color-secondary-2": "oklch(40% 0.09 280)",
    "--color-secondary-3": "oklch(30% 0.06 280)",
    "--color-secondary-4": "oklch(20% 0.03 280)",
    "--color-secondary-5": "oklch(10% 0.01 280)",

    "--color-accent-0": "oklch(60% 0.15 80)", // Most vibrant orange
    "--color-accent-1": "oklch(50% 0.12 80)",
    "--color-accent-2": "oklch(40% 0.09 80)",
    "--color-accent-3": "oklch(30% 0.06 80)",
    "--color-accent-4": "oklch(20% 0.03 80)",
    "--color-accent-5": "oklch(10% 0.01 80)",

    "--color-warn-0": "oklch(60% 0.15 90)", // Most vibrant yellow
    "--color-warn-1": "oklch(50% 0.12 90)",
    "--color-warn-2": "oklch(40% 0.09 90)",
    "--color-warn-3": "oklch(30% 0.06 90)",
    "--color-warn-4": "oklch(20% 0.03 90)",
    "--color-warn-5": "oklch(10% 0.01 90)",

    "--color-danger-0": "oklch(60% 0.15 30)", // Most vibrant red
    "--color-danger-1": "oklch(50% 0.12 30)",
    "--color-danger-2": "oklch(40% 0.09 30)",
    "--color-danger-3": "oklch(30% 0.06 30)",
    "--color-danger-4": "oklch(20% 0.03 30)",
    "--color-danger-5": "oklch(10% 0.01 30)",
  },
};

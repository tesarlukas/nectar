import { ActionId } from "../useEventSystem";

export type KeyboardShortcut = string;

export type KeyboardShortcuts = Record<ActionId, KeyboardShortcut>;

export const SHORTCUTS_FILENAME = "shortcuts.json" as const;

export const DEFAULT_SHORTCUTS: KeyboardShortcuts = {
  [ActionId.SaveNote]: "Ctrl-S",
  [ActionId.CreateNewNote]: "Ctrl-A",
} as const;

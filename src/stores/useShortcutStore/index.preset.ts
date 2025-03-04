import { ActionId } from "@/features/shortcuts/hooks/useEventSystem";

export enum ShortcutContext {
  Global = "global",
}

export type KeyboardShortcut = string;

export type KeyboardShortcuts = Record<KeyboardShortcut, ActionId>;

export const SHORTCUTS_FILENAME = "shortcuts.json" as const;

export const DEFAULT_SHORTCUTS: KeyboardShortcuts = {
  [`${ShortcutContext.Global}:ctrl+s`]: ActionId.SaveNote,
  [`${ShortcutContext.Global}:ctrl+a`]: ActionId.CreateNewNote,
} as const;

import { ActionId } from "@/features/events/eventEmitter";

export enum ShortcutContext {
  Global = "global",
}

export type KeyboardShortcut = string;

export type KeyboardShortcuts = Record<ActionId, KeyboardShortcut>;

export const SHORTCUTS_FILENAME = "shortcuts.json" as const;

export const DEFAULT_SHORTCUTS: KeyboardShortcuts = {
  [ActionId.SaveNote]: `${ShortcutContext.Global}:ctrl+s`,
  [ActionId.CreateNewNote]: `${ShortcutContext.Global}:ctrl+a`,
} as const;

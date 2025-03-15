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
  [ActionId.CreateNewDir]: `${ShortcutContext.Global}:ctrl+shift+a`,
  [ActionId.SearchReplace]: `${ShortcutContext.Global}:ctrl+f`,
  [ActionId.NextSearch]: `${ShortcutContext.Global}:ctrl+n`,
  [ActionId.PreviousSearch]: `${ShortcutContext.Global}:ctrl+shift+n`,
  [ActionId.ToggleCaseSensitiveSearch]: `${ShortcutContext.Global}:ctrl+c`,
  [ActionId.ToggleReplace]: `${ShortcutContext.Global}:ctrl+r`,
  [ActionId.FocusEditor]: `${ShortcutContext.Global}:ctrl+l`,
  [ActionId.FocusExplorer]: `${ShortcutContext.Global}:ctrl+h`,
  [ActionId.MoveExplorerCursorUp]: `${ShortcutContext.Global}:k`,
  [ActionId.MoveExplorerCursorDown]: `${ShortcutContext.Global}:j`,
  [ActionId.FocusExplorerToolbar]: `${ShortcutContext.Global}:ctrl+g`,
} as const;

import { ActionId } from "@/features/events/eventEmitter";

export enum ShortcutContext {
  Global = "global",
  Explorer = "explorer",
  Search = "search"
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
  [ActionId.MoveExplorerCursorTop]: `${ShortcutContext.Global}:g`,
  [ActionId.MoveExplorerCursorBottom]: `${ShortcutContext.Global}:shift+g`,
  [ActionId.FocusExplorerToolbar]: `${ShortcutContext.Global}:ctrl+g`,
  [ActionId.RefreshExplorer]: `${ShortcutContext.Explorer}:ctrl+r`,
  [ActionId.ExpandExplorerLeft]: `${ShortcutContext.Global}:alt+h`,
  [ActionId.ExpandExplorerRight]: `${ShortcutContext.Global}:alt+l`,
  [ActionId.ToggleSortOrder]: `${ShortcutContext.Explorer}:ctrl+s`,
  [ActionId.CutNode]: `${ShortcutContext.Global}:x`,
  [ActionId.CopyNode]: `${ShortcutContext.Global}:c`,
  [ActionId.PasteNode]: `${ShortcutContext.Global}:p`,
  [ActionId.DeleteNode]: `${ShortcutContext.Global}:d`,
  [ActionId.RenameNode]: `${ShortcutContext.Global}:r`,
  [ActionId.LinkNode]: `${ShortcutContext.Explorer}:l`,
  [ActionId.ToggleSettings]: `${ShortcutContext.Global}:ctrl+.`,
  [ActionId.ToggleFloatingMenuExpansion]: `${ShortcutContext.Global}:ctrl+/`,
  [ActionId.MoveJumpListOut]: `${ShortcutContext.Global}:ctrl+o`,
  [ActionId.MoveJumpListIn]: `${ShortcutContext.Global}:ctrl+p`,
  [ActionId.RemoveAllFormatting]: `${ShortcutContext.Global}:ctrl+shift+x`,
  [ActionId.Replace]: `${ShortcutContext.Search}:enter`,
  [ActionId.ReplaceAll]: `${ShortcutContext.Search}:shift+enter`
} as const;

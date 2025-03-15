import mitt from "mitt";

export enum NonAlphas {
  Enter = "enter",
  Escape = "escape",
  Tab = "tab",
  ShiftTab = "shift+tab",
}

export enum ActionId {
  SaveNote = "save_note",
  CreateNewNote = "create_new_note",
  CreateNewDir = "create_new_dir",
  SearchReplace = "search_replace",
  NextSearch = "next_search",
  PreviousSearch = "previous_search",
  ToggleCaseSensitiveSearch = "toggle_case_sensitive_search",
  ToggleReplace = "toggle_replace",
  FocusEditor = "focus_editor",
  FocusExplorer = "focus_explorer",
  MoveExplorerCursorUp = "move_explorer_cursor_up",
  MoveExplorerCursorDown = "move_explorer_cursor_down",
  FocusExplorerToolbar = "focus_explorer_toolbar",
  RefreshExplorer = "refresh_explorer",
  ExpandExplorerLeft = "expand_explorer_left",
  ExpandExplorerRight = "expand_explorer_right",
  ToggleSortOrder = "toggle_sort_order",
}

// biome-ignore lint/suspicious/noExplicitAny: function needs to accept any arguments
export type ActionCallback = (...args: any[]) => void;

const eventEmitter = mitt();

export default eventEmitter;

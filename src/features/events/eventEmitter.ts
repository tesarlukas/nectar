import mitt from "mitt";

export enum NonAlphas {
  Enter = "enter",
  Escape = "escape",
  Tab = "tab",
}

export enum ActionId {
  SaveNote = "save_note",
  CreateNewNote = "create_new_note",
  SearchReplace = "search_replace",
  NextSearch = "next_search",
  PreviousSearch = "previous_search",
  ToggleCaseSensitiveSearch = "toggle_case_sensitive_search",
  ToggleReplace = "toggle_replace",
  FocusEditor = "focus_editor",
  FocusExplorer = "focus_explorer",
  MoveExplorerCursorUp = "move_explorer_cursor_up",
  MoveExplorerCursorDown = "move_explorer_cursor_down",
}

export type ActionCallback = (...args: unknown[]) => void;

const eventEmitter = mitt();

export default eventEmitter;

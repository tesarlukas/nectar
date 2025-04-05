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
  MoveExplorerCursorTop = "move_explorer_cursor_top",
  MoveExplorerCursorBottom = "move_explorer_cursor_bottom",
  FocusExplorerToolbar = "focus_explorer_toolbar",
  RefreshExplorer = "refresh_explorer",
  ExpandExplorerLeft = "expand_explorer_left",
  ExpandExplorerRight = "expand_explorer_right",
  ToggleSortOrder = "toggle_sort_order",
  CutNode = "cut_node",
  CopyNode = "copy_node",
  PasteNode = "paste_node",
  DeleteNode = "delete_node",
  RenameNode = "rename_node",
  LinkNode = "link_node",
  ToggleSettings = "toggle_settings",
  ToggleFloatingMenuExpansion = "toggle_floating_menu_expansion",
  MoveJumpListOut = "move_jumplist_out",
  MoveJumpListIn = "move_jumplist_in",
  RemoveAllFormatting = "remove_all_formatting",
  Replace = "replace",
  ReplaceAll = "replace_all",
  ToggleGraphView = "toggle_graph_view",
  ExpandAll = "expand_all",
}

export enum EventId {
  ThemeChanged = "theme_changed",
}

// biome-ignore lint/suspicious/noExplicitAny: function needs to accept any arguments
export type ActionCallback = (...args: any[]) => void;

const eventEmitter = mitt();

export default eventEmitter;

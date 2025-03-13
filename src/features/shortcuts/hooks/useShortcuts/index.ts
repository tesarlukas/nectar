import { useHotkeys } from "react-hotkeys-hook";
import { ActionId, type NonAlphas } from "@/features/events/eventEmitter";
import type {
  HotkeyCallback,
  OptionsOrDependencyArray,
} from "react-hotkeys-hook/dist/types";
import { useShortcutsStore } from "@/stores/useShortcutStore";
import type { KeyboardShortcut } from "@/stores/useShortcutStore/index.preset";
import { splitShortcut } from "@/stores/useShortcutStore/utils/shortcutHelpers";

export const useShortcuts = (
  shortcutOrActionId: ActionId | KeyboardShortcut | NonAlphas | ActionId[],
  handler: HotkeyCallback,
  options?: OptionsOrDependencyArray,
  dependencies?: OptionsOrDependencyArray,
) => {
  const shortcuts = useShortcutsStore((state) => state.shortcuts);
  const actions = Object.values(ActionId);

  let shortcut: string | string[] = "";

  if (Array.isArray(shortcutOrActionId)) {
    shortcut = shortcutOrActionId.map((entry) =>
      actions.includes(entry)
        ? splitShortcut(shortcuts[entry as ActionId])[1]
        : (entry as KeyboardShortcut),
    );
  } else {
    shortcut = actions.includes(shortcutOrActionId as ActionId)
      ? splitShortcut(shortcuts[shortcutOrActionId as ActionId])[1]
      : (shortcutOrActionId as KeyboardShortcut);
  }
  const ref = useHotkeys(
    shortcut,
    handler,
    { preventDefault: true, ...options },
    dependencies,
  );

  return ref;
};

import { useHotkeys } from "react-hotkeys-hook";
import {
  type ActionCallback,
  ActionId,
  type NonAlphas,
} from "@/features/events/eventEmitter";
import type { OptionsOrDependencyArray } from "react-hotkeys-hook/dist/types";
import { useShortcutsStore } from "@/stores/useShortcutStore";
import type { KeyboardShortcut } from "@/stores/useShortcutStore/index.preset";
import { splitShortcut } from "@/stores/useShortcutStore/utils/shortcutHelpers";

export const useShortcuts = (
  shortcutOrActionId: ActionId | KeyboardShortcut | NonAlphas,
  handler: ActionCallback,
  options?: OptionsOrDependencyArray,
  dependencies?: OptionsOrDependencyArray,
) => {
  const shortcuts = useShortcutsStore((state) => state.shortcuts);

  // Determine if it's an ActionId or direct shortcut string
  const shortcut = Object.values(ActionId).includes(
    shortcutOrActionId as ActionId,
  )
    ? splitShortcut(shortcuts[shortcutOrActionId as ActionId])[1]
    : (shortcutOrActionId as KeyboardShortcut);

  const ref = useHotkeys(
    shortcut,
    handler,
    { preventDefault: true, ...options },
    dependencies,
  );
  return ref;
};

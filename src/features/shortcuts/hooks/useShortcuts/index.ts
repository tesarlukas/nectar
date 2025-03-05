import { useHotkeys } from "react-hotkeys-hook";
import type { ActionCallback } from "@/features/events/eventEmitter";
import type { KeyboardShortcut } from "@/stores/useShortcutStore/index.preset";
import type { OptionsOrDependencyArray } from "react-hotkeys-hook/dist/types";

export const useShortcuts = (
  shortcut: KeyboardShortcut,
  handler: ActionCallback,
  options?: OptionsOrDependencyArray,
  dependencies?: OptionsOrDependencyArray,
) => {
  const ref = useHotkeys(
    shortcut,
    handler,
    { preventDefault: true, ...options },
    dependencies,
  );

  return ref;
};

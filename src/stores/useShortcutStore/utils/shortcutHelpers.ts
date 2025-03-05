import type { KeyboardShortcut, ShortcutContext } from "../index.preset";

export const splitShortcut = (
  fullShortcut: KeyboardShortcut,
): [ShortcutContext, KeyboardShortcut] => {
  const [context, shortcut] = fullShortcut.split(":");

  return [context as ShortcutContext, shortcut];
};

export const joinShortcut = (
  shortcutTuple: [ShortcutContext, KeyboardShortcut],
): KeyboardShortcut => {
  const [context, shortcut] = shortcutTuple;
  return `${context}:${shortcut}`;
};

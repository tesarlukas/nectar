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

export const getShortcutKeyPart = (fullShortcut: KeyboardShortcut) => {
  const [_, shortcut] = splitShortcut(fullShortcut);

  return shortcut;
};

export const getContextPart = (fullShortcut: KeyboardShortcut) => {
  const [context, _] = splitShortcut(fullShortcut);

  return context;
};

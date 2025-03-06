import type { TFunction } from "i18next";
import { Card, CardTitle } from "@/components/ui/card";
import type { ActionId } from "@/features/events/eventEmitter";
import type { KeyboardShortcut } from "@/stores/useShortcutStore/index.preset";
import { splitShortcut } from "@/stores/useShortcutStore/utils/shortcutHelpers";
import { useMemo } from "react";

interface ShortcutItemProps {
  t: TFunction;
  shortcut: KeyboardShortcut;
  actionId: ActionId;
  onClick: (actionId: ActionId) => void;
  isRecording: boolean;
  recordedKeys?: Set<string>;
}

export const ShortcutItem = ({
  t,
  shortcut,
  actionId,
  onClick,
  isRecording,
  recordedKeys,
}: ShortcutItemProps) => {
  const shortcutPart = splitShortcut(shortcut)[1];

  const formattedKeys = useMemo(() => {
    if (!recordedKeys) return shortcutPart;

    const chars = [...recordedKeys];
    const joinedChars = chars.join("+");

    return joinedChars;
  }, [recordedKeys]);

  return (
    <>
      <Card
        tabIndex={-1}
        className="p-4 flex flex-row justify-between hover:bg-accent
        hover:text-accent-foreground cursor-pointer active:bg-accent/90
        transition-all duration-200 active:scale-[0.98] border border-border
        focus:outline-none"
        onClick={() => onClick(actionId)}
      >
        <CardTitle>{t(`shortcuts.${actionId}`)}</CardTitle>
        <CardTitle
          className={`capitalize ${isRecording ? "text-primary animate-pulse" : ""}`}
        >
          {isRecording ? formattedKeys : shortcutPart}
        </CardTitle>
      </Card>
    </>
  );
};

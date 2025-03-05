import type { TFunction } from "i18next";
import { Card, CardTitle } from "@/components/ui/card";
import type { ActionId } from "@/features/events/eventEmitter";
import type { KeyboardShortcut } from "@/stores/useShortcutStore/index.preset";
import { splitShortcut } from "@/stores/useShortcutStore/utils/shortcutHelpers";
import { useRecordHotkeys } from "react-hotkeys-hook";
import { useShortcuts } from "@/features/shortcuts/hooks/useShortcuts";
import { useMemo, useRef } from "react";

interface ShortcutItemProps {
  t: TFunction;
  shortcut: KeyboardShortcut;
  actionId: ActionId;
}

export const ShortcutItem = ({ t, shortcut, actionId }: ShortcutItemProps) => {
  const [
    recordedKeys,
    { start: startRecording, stop: stopRecording, isRecording },
  ] = useRecordHotkeys();
  const newKeysRef = useRef("");

  const handleOnCardClick = () => {
    startRecording();
  };
  useShortcuts("escape", () => stopRecording());
  const formattedKeys = useMemo(() => {
    const chars = [...recordedKeys];
    const joinedChars = chars.join("+");

    return joinedChars;
  }, [recordedKeys]);

  // TODO: these shortcuts gonna be lifted
  const enterRef = useShortcuts(
    "enter",
    () => {
      newKeysRef.current = formattedKeys;
      stopRecording();
      console.log(newKeysRef.current);
    },
    { scopes: "scopeA" },
  );

  return (
    <>
      <Card
        ref={enterRef}
        tabIndex={-1}
        className="p-4 flex flex-row justify-between hover:bg-accent hover:text-accent-foreground cursor-pointer active:bg-accent/90 transition-all duration-200 active:scale-[0.98] border border-border"
        onClick={handleOnCardClick}
      >
        <CardTitle>{t(`shortcuts.${actionId}`)}</CardTitle>
        <CardTitle
          className={`capitalize ${isRecording ? "text-primary animate-pulse" : ""}`}
        >
          {isRecording ? formattedKeys : splitShortcut(shortcut)[1]}
        </CardTitle>
      </Card>
    </>
  );
};

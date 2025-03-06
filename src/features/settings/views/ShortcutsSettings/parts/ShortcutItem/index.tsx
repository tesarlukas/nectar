import type { TFunction } from "i18next";
import { Card, CardTitle } from "@/components/ui/card";
import type { ActionId } from "@/features/events/eventEmitter";
import type { KeyboardShortcut } from "@/stores/useShortcutStore/index.preset";
import { splitShortcut } from "@/stores/useShortcutStore/utils/shortcutHelpers";
import { Typography } from "@/components/Typography";
import { formatKeys } from "../../utils/formatKeys";

interface ShortcutItemProps {
  t: TFunction;
  shortcut: KeyboardShortcut;
  actionId: ActionId;
  onClick: (actionId: ActionId) => void;
  isRecording: boolean;
  recordedKeys?: Set<string>;
  isChanged?: boolean;
  newShortcut: KeyboardShortcut;
}

export const ShortcutItem = ({
  t,
  shortcut,
  actionId,
  onClick,
  isRecording,
  recordedKeys,
  isChanged,
  newShortcut,
}: ShortcutItemProps) => {
  const shortcutKeys = splitShortcut(shortcut)[1];

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
        {isChanged && <Typography variant="subtle">unsaved changes</Typography>}
        {isRecording && recordedKeys ? (
          <CardTitle className="capitalize text-primary animate-pulse">
            {formatKeys(recordedKeys)}
          </CardTitle>
        ) : (
          <CardTitle className="capitalize">
            {shortcutKeys} {isChanged && `... ${splitShortcut(newShortcut)[1]}`}
          </CardTitle>
        )}
      </Card>
    </>
  );
};

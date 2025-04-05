import type { TFunction } from "i18next";
import { Card, CardTitle } from "@/components/ui/card";
import type { ActionId } from "@/features/events/eventEmitter";
import type { KeyboardShortcut } from "@/stores/useShortcutStore/index.preset";
import {
  getContextPart,
  getShortcutKeyPart,
} from "@/stores/useShortcutStore/utils/shortcutHelpers";
import { Typography } from "@/components/Typography";
import { formatKeys } from "../../utils/formatKeys";
import { cn } from "@/lib/utils";
import { ArrowRight, TriangleAlert } from "lucide-react";

interface ShortcutItemProps {
  t: TFunction;
  shortcut: KeyboardShortcut;
  actionId: ActionId;
  onClick: (actionId: ActionId) => void;
  isRecording: boolean;
  recordedKeys?: Set<string>;
  isChanged?: boolean;
  newShortcut: KeyboardShortcut;
  isDuplicate: boolean;
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
  isDuplicate,
}: ShortcutItemProps) => {
  const shortcutKeys = getShortcutKeyPart(shortcut);
  const context = getContextPart(shortcut);
  const newShortcutKeys = isChanged && getShortcutKeyPart(newShortcut);

  return (
    <Card
      tabIndex={-1}
      className={cn(
        isDuplicate && "bg-warning/30",
        "h-full px-4 flex flex-row flex-1 justify-between items-center hover:bg-accent hover:text-accent-foreground cursor-pointer active:bg-accent/90 transition-all duration-200 active:scale-[0.98] border border-border focus:outline-none",
      )}
      onClick={() => onClick(actionId)}
    >
      <div className="flex flex-row items-center">
        <CardTitle>{t(`shortcuts.${actionId}`)}</CardTitle>
        {isChanged ? (
          <>
            <TriangleAlert size={16} className="ml-4 mr-1" />
            <Typography variant="subtle" className="text-primary font-bold">
              {t("unsavedChanges", { ns: "common" })}
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="subtle" className="text-primary/60 font-bold capitalize ml-4">
              {context}
            </Typography>
          </>
        )}
      </div>

      {isRecording && recordedKeys ? (
        <CardTitle className="capitalize text-primary animate-pulse">
          {formatKeys(recordedKeys)}
        </CardTitle>
      ) : isChanged ? (
        <div className="flex items-center gap-2">
          <CardTitle className="capitalize bg-muted px-2 py-1 rounded">
            {shortcutKeys}
          </CardTitle>
          <ArrowRight size={16} className="text-text-primary" />
          <CardTitle className="capitalize bg-warning text-warning-foreground px-2 py-1 rounded">
            {newShortcutKeys}
          </CardTitle>
        </div>
      ) : (
        <CardTitle className="capitalize">{shortcutKeys}</CardTitle>
      )}
    </Card>
  );
};

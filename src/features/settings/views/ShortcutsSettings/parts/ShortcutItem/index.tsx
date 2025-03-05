import type { TFunction } from "i18next";
import { Card, CardTitle } from "@/components/ui/card";
import type { ActionId } from "@/features/events/eventEmitter";
import type { KeyboardShortcut } from "@/stores/useShortcutStore/index.preset";
import { splitShortcut } from "@/stores/useShortcutStore/utils/shortcutHelpers";

interface ShortcutItemProps {
  t: TFunction;
  shortcut: KeyboardShortcut;
  actionId: ActionId;
}

export const ShortcutItem = ({ t, shortcut, actionId }: ShortcutItemProps) => {
  return (
    <>
      <Card className="p-4 flex flex-row justify-between">
        <CardTitle className="capitalize">
          {splitShortcut(shortcut)[1]}
        </CardTitle>
        <CardTitle>{t(`shortcuts.${actionId}`)}</CardTitle>
      </Card>
    </>
  );
};

import { Button } from "@/components/ui/button";
import { useShortcutsStore } from "@/stores/useShortcutStore/index";
import { useCallback, useMemo, useRef } from "react";
import { ShortcutItem } from "./parts/ShortcutItem";
import { useTranslation } from "react-i18next";
import { Typography } from "@/components/Typography";
import { useRecordHotkeys } from "react-hotkeys-hook";
import { useShortcuts } from "@/features/shortcuts/hooks/useShortcuts";
import type { ActionId } from "@/features/events/eventEmitter";

export const ShortcutsSettings = () => {
  const { t } = useTranslation(["settings", "common"]);
  const shortcuts = useShortcutsStore((state) => state.shortcuts);

  const reset = useShortcutsStore((state) => state.resetToDefault);
  const handleOnReset = useCallback(() => {
    reset();
  }, []);

  const [
    recordedKeys,
    { start: startRecording, stop: stopRecording, isRecording },
  ] = useRecordHotkeys();
  const recordedActionRef = useRef<ActionId>(null);
  const newKeysRef = useRef("");

  const handleShortcutItemOnClick = (actionId: ActionId) => {
    recordedActionRef.current = actionId;
    startRecording();
  };

  const getRecordedKeysOfAction = useCallback(
    (actionId: ActionId) => {
      if (actionId === recordedActionRef.current) {
        return recordedKeys;
      }
    },
    [recordedKeys, recordedActionRef],
  );

  const formattedKeys = useMemo(() => {
    const chars = [...recordedKeys];
    const joinedChars = chars.join("+");

    return joinedChars;
  }, [recordedKeys]);

  useShortcuts("escape", () => stopRecording());
  useShortcuts("enter", () => {
    newKeysRef.current = formattedKeys;
    stopRecording();
  });

  return (
    <>
      <div className="px-4 py-0">
        <div className="flex flex-row">
          <Typography variant="h3" weight="normal" className="text-center">
            {t("keyboardShortcuts")}
          </Typography>
          <Button className="ml-auto">{t("save", { ns: "common" })}</Button>
        </div>
        <div className="flex flex-col gap-y-2 py-4">
          {Object.entries(shortcuts).map(([shortcut, actionId]) => (
            <ShortcutItem
              key={actionId}
              t={t}
              shortcut={shortcut}
              actionId={actionId}
              onClick={handleShortcutItemOnClick}
              isRecording={
                isRecording && actionId === recordedActionRef.current
              }
              recordedKeys={getRecordedKeysOfAction(actionId)}
            />
          ))}
        </div>
        <div className="flex flex-row">
          <Button
            onClick={handleOnReset}
            className="ml-auto"
            variant="destructive"
          >
            {t("resetToDefault")}
          </Button>
        </div>
      </div>
    </>
  );
};

import { Button } from "@/components/ui/button";
import { useShortcutsStore } from "@/stores/useShortcutStore/index";
import { useCallback, useRef, useState } from "react";
import { ShortcutItem } from "./parts/ShortcutItem";
import { useTranslation } from "react-i18next";
import { Typography } from "@/components/Typography";
import { useRecordHotkeys } from "react-hotkeys-hook";
import { useShortcuts } from "@/features/shortcuts/hooks/useShortcuts";
import type { ActionId } from "@/features/events/eventEmitter";
import { formatKeys } from "./utils/formatKeys";
import { DEFAULT_SHORTCUTS } from "@/stores/useShortcutStore/index.preset";

export const ShortcutsSettings = () => {
  const { t } = useTranslation(["settings", "common"]);
  const shortcuts = useShortcutsStore((state) => state.shortcuts);
  const updateShortcuts = useShortcutsStore((state) => state.updateShortcuts);
  const reset = useShortcutsStore((state) => state.resetToDefault);

  const [
    recordedKeys,
    { start: startRecording, stop: stopRecording, isRecording },
  ] = useRecordHotkeys();
  const [newShortcuts, setNewShortcuts] = useState(shortcuts);

  const recordedActionIdRef = useRef<ActionId>(null);
  const newKeysRef = useRef("");

  const handleOnReset = useCallback(() => {
    reset();
    setNewShortcuts(DEFAULT_SHORTCUTS);
  }, []);
  const handleOnSave = () => updateShortcuts(newShortcuts);

  const handleShortcutItemOnClick = useCallback((actionId: ActionId) => {
    recordedActionIdRef.current = actionId;
    startRecording();
  }, []);

  const getRecordedKeysForAction = useCallback(
    (actionId: ActionId) => {
      if (actionId === recordedActionIdRef.current) {
        return recordedKeys;
      }
    },
    [recordedKeys, recordedActionIdRef],
  );

  useShortcuts("escape", () => {
    newKeysRef.current = "";
    stopRecording();
  });
  useShortcuts("enter", () => {
    newKeysRef.current = `global:${formatKeys(recordedKeys)}`;

    if (recordedActionIdRef.current) {
      setNewShortcuts((prevShortcuts) => ({
        ...prevShortcuts,
        [recordedActionIdRef.current as ActionId]: newKeysRef.current,
      }));
    }

    stopRecording();
  });

  return (
    <>
      <div className="px-4 py-0">
        <div className="flex flex-row">
          <Typography variant="h3" weight="normal" className="text-center">
            {t("keyboardShortcuts")}
          </Typography>
          <Button className="ml-auto" onClick={handleOnSave}>
            {t("save", { ns: "common" })}
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 py-4">
          {(Object.entries(shortcuts) as [ActionId, string][]).map(
            ([actionId, shortcut]) => (
              <ShortcutItem
                key={actionId}
                t={t}
                actionId={actionId}
                shortcut={shortcut}
                recordedKeys={getRecordedKeysForAction(actionId)}
                newShortcut={newShortcuts[actionId]}
                isRecording={
                  isRecording && actionId === recordedActionIdRef.current
                }
                isChanged={newShortcuts[actionId] !== shortcuts[actionId]}
                onClick={handleShortcutItemOnClick}
              />
            ),
          )}
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

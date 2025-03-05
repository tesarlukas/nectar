import { Button } from "@/components/ui/button";
import { useShortcutsStore } from "@/stores/useShortcutStore/index";
import { useCallback } from "react";
import { ShortcutItem } from "./parts/ShortcutItem";
import { useTranslation } from "react-i18next";
import { Typography } from "@/components/Typography";

export const ShortcutsSettings = () => {
  const { t } = useTranslation(["settings", "common"]);
  const shortcuts = useShortcutsStore((state) => state.shortcuts);

  const reset = useShortcutsStore((state) => state.resetToDefault);

  const handleOnReset = useCallback(() => {
    reset();
  }, []);

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

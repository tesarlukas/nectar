import { Button } from "@/components/ui/button";
import { useShortcutsStore } from "@/stores/useShortcutStore/index";
import { useCallback, useRef, useState, useMemo } from "react";
import { ShortcutItem } from "./parts/ShortcutItem";
import { useTranslation } from "react-i18next";
import { Typography } from "@/components/Typography";
import { useRecordHotkeys } from "react-hotkeys-hook";
import { useShortcuts } from "@/features/shortcuts/hooks/useShortcuts";
import { NonAlphas, type ActionId } from "@/features/events/eventEmitter";
import { formatKeys } from "./utils/formatKeys";
import {
  DEFAULT_SHORTCUTS,
  type KeyboardShortcut,
} from "@/stores/useShortcutStore/index.preset";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Search, Trash, TriangleAlert } from "lucide-react";
import {
  FixedSizeList as List,
  type ListChildComponentProps,
} from "react-window";
import { findDuplicates } from "./utils/findDuplicates";
import { Card, CardTitle } from "@/components/ui/card";
import AutoSizer from "react-virtualized-auto-sizer";
import { getShortcutKeyPart } from "@/stores/useShortcutStore/utils/shortcutHelpers";

// Helper function to normalize text for search
const normalizeText = (text: string): string => {
  return (
    text
      .toLowerCase()
      .normalize("NFD")
      // biome-ignore lint/suspicious/noMisleadingCharacterClass: not really miss leading
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
  );
};

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
  const [searchQuery, setSearchQuery] = useState("");
  const recordedActionIdRef = useRef<ActionId>(null);
  const newKeysRef = useRef("");
  const listRef = useRef<List>(null);

  const duplicates = useMemo(
    () => findDuplicates<KeyboardShortcut>(Object.values(newShortcuts)),
    [newShortcuts],
  );

  // Handle reset
  const handleOnReset = useCallback(() => {
    reset();
    toast.success(t("shortcutsReset"));
    setNewShortcuts(DEFAULT_SHORTCUTS);
    stopRecording();
    newKeysRef.current = "";
  }, []);

  // Handle save
  const handleOnSave = () => {
    if (duplicates.length > 0) {
      toast.warning(t("thereIsCollisionInYourNewBinds"));
      return;
    }

    updateShortcuts(newShortcuts);
    toast.success(t("successfullySavedShortcuts"));
  };

  // Handle shortcut item click
  const handleShortcutItemOnClick = useCallback(
    (actionId: ActionId) => {
      recordedActionIdRef.current = actionId;
      startRecording();
    },
    [startRecording],
  );

  // Get recorded keys for action
  const getRecordedKeysForAction = useCallback(
    (actionId: ActionId) => {
      if (actionId === recordedActionIdRef.current) {
        return recordedKeys;
      }
    },
    [recordedKeys],
  );

  const handleOnResetSingle = useCallback(
    (actionId: ActionId) => {
      updateShortcuts({
        ...shortcuts,
        [actionId]: DEFAULT_SHORTCUTS[actionId],
      });
      setNewShortcuts((prevShortcuts) => ({
        ...prevShortcuts,
        [actionId]: DEFAULT_SHORTCUTS[actionId],
      }));
      newKeysRef.current = "";
      stopRecording();
    },
    [shortcuts],
  );

  // Escape key to cancel recording
  useShortcuts(NonAlphas.Escape, () => {
    newKeysRef.current = "";
    stopRecording();
  });

  // Enter key to confirm new shortcut
  useShortcuts(NonAlphas.Enter, () => {
    if (recordedKeys.size === 0) {
      newKeysRef.current = 'global:enter';
    } else {
      newKeysRef.current = `global:${formatKeys(recordedKeys)}`;
    }
    if (recordedActionIdRef.current) {
      setNewShortcuts((prevShortcuts) => ({
        ...prevShortcuts,
        [recordedActionIdRef.current as ActionId]: newKeysRef.current,
      }));
    }
    stopRecording();
  });

  // Filter shortcuts based on search query
  const filteredShortcuts = useMemo(() => {
    if (!searchQuery.trim()) {
      return Object.entries(shortcuts) as [ActionId, string][];
    }

    const normalizedQuery = normalizeText(searchQuery);

    return (Object.entries(shortcuts) as [ActionId, string][]).filter(
      ([actionId, shortcutWithContext]) => {
        const normalizedActionId = normalizeText(actionId);
        const translatedAction = normalizeText(
          t(`actions.${actionId}`, { defaultValue: actionId }),
        );
        const shortcutPart = getShortcutKeyPart(shortcutWithContext);

        return (
          normalizedActionId.includes(normalizedQuery) ||
          translatedAction.includes(normalizedQuery) ||
          shortcutPart.includes(normalizedQuery)
        );
      },
    );
  }, [shortcuts, searchQuery, t]);

  // Row renderer for virtualized list
  const Row = useCallback(
    ({ index, style }: ListChildComponentProps) => {
      const [actionId, shortcut] = filteredShortcuts[index];

      return (
        <div style={style} className="pb-2">
          <div className="flex flex-row items-center gap-x-2 h-full">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => handleOnResetSingle(actionId)}
            >
              <Trash />
            </Button>
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
              isDuplicate={duplicates.includes(newShortcuts[actionId])}
            />
          </div>
        </div>
      );
    },
    [
      filteredShortcuts,
      getRecordedKeysForAction,
      newShortcuts,
      shortcuts,
      isRecording,
      handleShortcutItemOnClick,
    ],
  );

  return (
    <>
      <div className="px-4 py-0">
        <div className="flex flex-row">
          <Typography variant="h3" weight="normal" className="text-center">
            {t("keyboardShortcuts")}
          </Typography>
          <div className="ml-auto flex gap-x-2">
            <Button onClick={handleOnReset} variant="destructive">
              {t("resetToDefault")}
            </Button>
            <Button className="ml-auto" onClick={handleOnSave}>
              {t("save", { ns: "common" })}
            </Button>
          </div>
        </div>
        {duplicates.length > 0 && (
          <div className="my-4">
            <Card className="p-4 flex flex-row items-center bg-warning">
              <TriangleAlert className="mr-4" />
              <CardTitle>{t("youCannotHaveDuplicateShortcuts")}</CardTitle>
            </Card>
          </div>
        )}

        {/* Search input */}
        <div className="relative mt-4 mb-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchShortcuts", {
              defaultValue: "Search shortcuts...",
            })}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="py-4 h-96">
          {/* Virtualized list */}
          <AutoSizer>
            {({ height, width }) => {
              return filteredShortcuts.length > 0 ? (
                <List
                  ref={listRef}
                  height={height}
                  width={width}
                  itemCount={filteredShortcuts.length}
                  itemSize={height / 6}
                >
                  {Row}
                </List>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {t("noShortcutsFound", {
                    defaultValue: "No shortcuts found",
                  })}
                </div>
              );
            }}
          </AutoSizer>
        </div>
      </div>
    </>
  );
};

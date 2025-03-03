import { SETTINGS_PATH } from "@/constants/settingsPath";
import { readJson, writeJson } from "@/utils/jsonHelpers";
import { useCallback } from "react";
import {
  DEFAULT_SHORTCUTS,
  type KeyboardShortcuts,
  SHORTCUTS_FILENAME,
} from "./index.preset";
import { APP_CONFIG_DIR } from "@/constants/appConfigDir";
import { join } from "@tauri-apps/api/path";

export const useShortcuts = () => {
  const loadShortcuts = useCallback(async () => {
    const shortcutsLocation = await join(SETTINGS_PATH, SHORTCUTS_FILENAME);
    const storedShortcuts = readJson<KeyboardShortcuts>(
      shortcutsLocation,
      APP_CONFIG_DIR,
    );

    return storedShortcuts;
  }, []);

  const saveShortcuts = useCallback(async () => {
    await writeJson(
      SETTINGS_PATH,
      SHORTCUTS_FILENAME,
      DEFAULT_SHORTCUTS,
      APP_CONFIG_DIR,
    );
  }, []);

  return {
    loadShortcuts,
    saveShortcuts,
  };
};

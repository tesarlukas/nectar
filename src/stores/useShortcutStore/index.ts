import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SETTINGS_PATH } from "@/constants/settingsPath";
import {
  DEFAULT_SHORTCUTS,
  type KeyboardShortcuts,
  ShortcutContext,
  SHORTCUTS_FILENAME,
} from "./index.preset";
import { APP_CONFIG_DIR } from "@/constants/appConfigDir";
import { join } from "@tauri-apps/api/path";
import { readJson, writeJson } from "@/utils/jsonHelpers";

const shortcutsStorage = {
  getItem: async (_: string): Promise<string | null> => {
    try {
      const shortcutsLocation = await join(SETTINGS_PATH, SHORTCUTS_FILENAME);

      const data = await readJson<KeyboardShortcuts>(
        shortcutsLocation,
        APP_CONFIG_DIR,
      );

      return data ? JSON.stringify(data) : null;
    } catch (error) {
      console.error(`Error reading shortcuts from filesystem: ${error}`);
      return null;
    }
  },

  setItem: async (_: string, value: string): Promise<void> => {
    try {
      const data = JSON.parse(value);
      await writeJson(SETTINGS_PATH, SHORTCUTS_FILENAME, data, APP_CONFIG_DIR);
    } catch (error) {
      console.error(`Error writing shortcuts to filesystem: ${error}`);
    }
  },

  removeItem: async (_: string): Promise<void> => {
    // Implement if needed, could reset to defaults or delete the file
    try {
      await writeJson(
        SETTINGS_PATH,
        SHORTCUTS_FILENAME,
        DEFAULT_SHORTCUTS,
        APP_CONFIG_DIR,
      );
    } catch (error) {
      console.error(`Error resetting shortcuts in filesystem: ${error}`);
    }
  },
};

// Define the store interface
interface ShortcutsStore {
  shortcuts: KeyboardShortcuts;
  isHydrated: boolean;
  activeContexts: ShortcutContext[];
  updateShortcuts: (newShortcuts: KeyboardShortcuts) => void;
  resetToDefault: () => void;
}

// Create the persistent store
export const useShortcutsStore = create<ShortcutsStore>()(
  persist(
    (set) => ({
      shortcuts: DEFAULT_SHORTCUTS,
      isHydrated: false,
      activeContexts: [ShortcutContext.Global],

      updateShortcuts: (newShortcuts) => set({ shortcuts: newShortcuts }),

      resetToDefault: () => set({ shortcuts: DEFAULT_SHORTCUTS }),

      activateContext: (context: ShortcutContext) => {
        set((state) => {
          if (state.activeContexts.includes(context)) return state;

          return {
            activeContexts: [...state.activeContexts, context],
          };
        });

        // Return deactivate function
        return () => {
          set((state) => ({
            activeContexts: state.activeContexts.filter(
              (ctx) => ctx !== context,
            ),
          }));
        };
      },
    }),
    {
      name: "shortcuts", // Storage key
      storage: createJSONStorage(() => shortcutsStorage),

      // Optional: only persist specific parts of state
      partialize: (state) => ({
        shortcuts: state.shortcuts,
      }),

      // Update hydration state when rehydration is complete
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true;
        }
      },
    },
  ),
);

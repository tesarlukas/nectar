import { DEFAULT_HIVE_NAME } from "@/constants/defaultHiveName";
import { create } from "zustand";
import { load } from "@tauri-apps/plugin-store";
import { createJSONStorage, persist } from "zustand/middleware";

// Keys used in the Tauri store
const STORE_NAME = "hive-store.json";
const STORAGE_KEY = "hive-storage";

// Define the storage interface to match Zustand's requirements
interface StorageAdapter {
  getItem: (name: string) => Promise<string | null>;
  setItem: (name: string, value: string) => Promise<void>;
  removeItem: (name: string) => Promise<void>;
}

// Create a custom storage adapter for Tauri
const tauriStorage: StorageAdapter = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const store = await load(STORE_NAME, { autoSave: true });
      const value = await store.get<unknown>(name);
      return value === undefined ? null : JSON.stringify(value);
    } catch (error) {
      console.error(`Error getting item ${name} from Tauri store:`, error);
      return null;
    }
  },

  setItem: async (name: string, value: string): Promise<void> => {
    try {
      const store = await load(STORE_NAME, { autoSave: true });
      const parsedValue = JSON.parse(value);
      await store.set(name, parsedValue);
      await store.save();
    } catch (error) {
      console.error(`Error setting item ${name} in Tauri store:`, error);
    }
  },

  removeItem: async (name: string): Promise<void> => {
    try {
      const store = await load(STORE_NAME, { autoSave: true });
      await store.delete(name);
      await store.save();
    } catch (error) {
      console.error(`Error removing item ${name} from Tauri store:`, error);
    }
  },
};

// Define the store shape
interface HiveStore {
  hiveName: string;
  isHydrated: boolean;
  setHiveName: (newHiveName: string) => void;
}

// Create the store with persistence
export const useHiveStore = create<HiveStore>()(
  persist(
    (set) => ({
      hiveName: DEFAULT_HIVE_NAME,
      isHydrated: false,
      setHiveName: (newHiveName) => set({ hiveName: newHiveName }),
    }),
    {
      name: STORAGE_KEY, // The key to store the state under
      storage: createJSONStorage(() => tauriStorage),
      // Optional: only persist specific values
      partialize: (state) => ({
        hiveName: state.hiveName,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true;
        }
      },
    },
  ),
);

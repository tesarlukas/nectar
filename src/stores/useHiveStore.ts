import { DEFAULT_HIVE_NAME } from "@/constants/defaultHiveName";
import { create } from "zustand";

interface HiveStore {
  hiveName: string;
  setHiveName: (newHiveName: string) => void;
}

export const useHiveStore = create<HiveStore>((set) => ({
  // TODO: this is gonna need to be read from the the store of the Tauri or from the json tho i'm not sure yet
  hiveName: DEFAULT_HIVE_NAME,
  setHiveName: (newHiveName) => set({ hiveName: newHiveName }),
}));

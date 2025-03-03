import { Button } from "@/components/ui/button";
import { useShortcutsStore } from "@/stores/useShortcutStore/index";
import { useCallback } from "react";

export const ShortcutsSettings = () => {
  const shortcuts = useShortcutsStore((state) => state.shortcuts);

  const handleOnSaveShortcuts = useCallback(async () => {}, []);

  const handleOnLoadShortcuts = useCallback(async () => {}, []);

  return (
    <>
      <div className="px-4 py-0">
        <Button onClick={handleOnLoadShortcuts}>Load shortcuts</Button>
        <Button onClick={handleOnSaveShortcuts}>Save shortcuts</Button>
        <div>{JSON.stringify(shortcuts)}</div>
      </div>
    </>
  );
};

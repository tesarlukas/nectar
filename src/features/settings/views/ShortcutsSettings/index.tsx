import { Typography } from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { useShortcuts } from "@/features/shortcuts/hooks/useShortcuts";
import type { KeyboardShortcuts } from "@/features/shortcuts/hooks/useShortcuts/index.preset";
import { useCallback, useState } from "react";

export const ShortcutsSettings = () => {
  const { saveShortcuts, loadShortcuts } = useShortcuts();
  const [shortcuts, setShortcuts] = useState<KeyboardShortcuts>();

  const handleOnSaveShortcuts = async () => {
    await saveShortcuts();
  };

  const handleOnLoadShortcuts = useCallback(async () => {
    const storedShortcuts = await loadShortcuts();
    setShortcuts(storedShortcuts);
    console.log(storedShortcuts);
  }, []);

  return (
    <>
      <div className="px-4 py-0">
        <Button onClick={handleOnLoadShortcuts}>Load shortcuts</Button>
        <Button onClick={handleOnSaveShortcuts}>Save shortcuts</Button>
      </div>
    </>
  );
};

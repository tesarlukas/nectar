import { useState } from "react";
import { useColorTheme } from "../../colorTheme/hooks/useColorTheme";
import type { ThemeFlavour } from "../../colorTheme/types";
import { Button } from "@/components/ui/Button";

export const AppearanceSettings = () => {
  const { updateColorTheme, readTheme } = useColorTheme();
  const [colorTheme, setColorTheme] = useState<ThemeFlavour>();

  const selectedTheme = async () => {
    setColorTheme((await readTheme())?.name);
  };

  return (
    <>
      <div className="flex-col">
        <div>{colorTheme}</div>
        <Button onClick={() => updateColorTheme()}>Set Theme</Button>
        <Button onClick={selectedTheme}>Obtain Theme</Button>
      </div>
    </>
  );
};

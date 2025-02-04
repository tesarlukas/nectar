import { useState } from "react";
import { useColorTheme } from "../../theme/hooks/useColorTheme";
import type { ThemeFlavour } from "../../theme/types";

export const AppearanceSettings = () => {
  const { updateColorTheme, readTheme } = useColorTheme();
  const [colorTheme, setColorTheme] = useState<ThemeFlavour>();

  const selectedTheme = async () => {
    setColorTheme((await readTheme())?.name);
  };

  return (
    <>
      <div className="flex-col">
        <button
          type="button"
          onClick={() => updateColorTheme()}
          className="bg-primary-0"
        >
          Press me
        </button>
        <button type="button" onClick={selectedTheme} className="bg-primary-3">
          Obtain theme
        </button>
        <div>{colorTheme}</div>
      </div>
    </>
  );
};

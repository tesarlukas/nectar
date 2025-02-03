import { useColorTheme } from "../../theme/hooks/useColorTheme";

export const AppearanceSettings = () => {
  const { updateColorTheme } = useColorTheme();

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
      </div>
    </>
  );
};

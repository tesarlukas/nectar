import { Button } from "@/components/ui/button";
import { useHiveStore } from "@/stores/useHiveStore";
import { Outlet, useNavigate } from "react-router";

export const SettingsLayout = () => {
  const hiveName = useHiveStore((state) => state.hiveName);
  const navigate = useNavigate();

  return (
    <>
      <div className="p-4 flex flex-row w-full">
        <div className="flex flex-col gap-2 w-1/5">
          <Button onClick={() => navigate("/settings")}>Appearance</Button>
          <Button onClick={() => navigate("/settings/shortcuts")}>
            Shortcuts
          </Button>
          {hiveName && (
            <Button onClick={() => navigate("/homebase")}>Homebase</Button>
          )}
        </div>
        <div className="flex flex-col flex-1">
          <Outlet />
        </div>
      </div>
    </>
  );
};

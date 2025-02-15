import { useNavigate, useLocation } from "react-router";
import { Settings, Pencil } from "lucide-react";
import { Card } from "../ui/card";
import { ColorSchemeToggle } from "./parts/ColorSchemeToggle";
import { Button } from "../ui/button";
import { useHiveStore } from "@/stores/useHiveStore";

export const TopMenu = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const hiveName = useHiveStore((state) => state.hiveName)
  const isInSettings = pathname.includes("settings");

  const handleOnSettingsToggle = () => {
    if (isInSettings) {
      navigate("/");
      return;
    }

    navigate("/settings");
  };

  return (
    <>
      <Card className="rounded-b-none py-4 px-8 flex flex-row">
        <div>
          <h1 className="text-4xl">{hiveName}</h1>
        </div>
        <div className="flex flex-row ml-auto gap-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleOnSettingsToggle}
          >
            {pathname.includes("settings") ? (
              <Pencil className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Settings className="h-[1.2rem] w-[1.2rem]" />
            )}
          </Button>
          <ColorSchemeToggle />
        </div>
      </Card>
    </>
  );
};

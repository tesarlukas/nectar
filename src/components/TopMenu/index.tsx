import { useNavigate, useLocation } from "react-router";
import { Settings, Pencil, Home, ChartNetwork } from "lucide-react";
import { Card } from "../ui/card";
import { ColorSchemeToggle } from "./parts/ColorSchemeToggle";
import { Button } from "../ui/button";
import { useHiveStore } from "@/stores/useHiveStore";
import { useCallback } from "react";

export const TopMenu = () => {
  const hiveName = useHiveStore((state) => state.hiveName);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isInSettings = pathname.includes("settings");
  const isInGraph = pathname.includes("graph");

  const renderNavHandler = useCallback(() => {
    if (isInSettings && hiveName)
      return (
        <Button
          variant="outline"
          size="icon"
          onClick={() => (isInSettings ? navigate("/") : navigate("/settings"))}
        >
          {pathname.includes("settings") ? (
            <Pencil className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Settings className="h-[1.2rem] w-[1.2rem]" />
          )}
        </Button>
      );

    return (
      <>
        <Button
          variant="outline"
          size="icon"
          onClick={() => (isInGraph ? navigate("/") : navigate("/graph"))}
        >
          {isInGraph ? (
            <Pencil className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <ChartNetwork className="h-[1.2rem] w-[1.2rem]" />
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            isInSettings ? navigate("/homebase") : navigate("/settings")
          }
        >
          {isInSettings ? (
            <Home className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Settings className="h-[1.2rem] w-[1.2rem]" />
          )}
        </Button>
      </>
    );
  }, [hiveName, isInSettings, isInGraph]);

  return (
    <>
      <Card className="rounded-b-none py-4 px-8 flex flex-row z-1">
        <div>
          <h1 className="text-4xl">{hiveName}</h1>
        </div>
        <div className="flex flex-row ml-auto gap-x-2 items-center">
          {renderNavHandler()}
          <ColorSchemeToggle />
        </div>
      </Card>
    </>
  );
};

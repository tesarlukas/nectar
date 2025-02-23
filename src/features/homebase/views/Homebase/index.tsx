import { useEffect, useState } from "react";
import type { DirEntry } from "@tauri-apps/plugin-fs";
import { getHives } from "./utils/getHives";
import { useHiveStore } from "@/stores/useHiveStore";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { HiveListing } from "./parts/HiveListing";
import { EmptyHives } from "./parts/EmptyHives";

export const Homebase = () => {
  const { t } = useTranslation();
  const setHiveName = useHiveStore((state) => state.setHiveName);
  const navigate = useNavigate();
  const [hives, setHives] = useState<DirEntry[]>([]);

  useEffect(() => {
    setHiveName("");

    const obtainHives = async () => {
      const newHives = await getHives();
      setHives(newHives);
    };
    obtainHives();
  }, []);

  const handleOnHiveClick = (hiveName: string) => {
    setHiveName(hiveName);
    navigate("/");
  };

  const handleOnCreateHive = () => {
    console.log("create hive");
  };

  return (
    <div className="p-4 flex flex-1 flex-col min-h-0 items-center w-full">
      {hives.length === 1 ? (
        <EmptyHives t={t} onCreateHive={handleOnCreateHive} />
      ) : (
        <HiveListing t={t} hives={hives} onHiveClick={handleOnHiveClick} />
      )}
    </div>
  );
};

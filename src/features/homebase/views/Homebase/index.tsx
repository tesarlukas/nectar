import { useCallback, useEffect, useState } from "react";
import { exists, remove, type DirEntry } from "@tauri-apps/plugin-fs";
import { getHives } from "./utils/getHives";
import { useHiveStore } from "@/stores/useHiveStore";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { HiveListing } from "./parts/HiveListing";
import { EmptyHives } from "./parts/EmptyHives";
import { ROOT_DIR } from "@/constants/rootDir";
import { useInitialize } from "@/hooks/useInitialize";
import { cn } from "@/lib/utils";

export const Homebase = () => {
  const { t } = useTranslation(["homebase", "common"]);
  const setHiveName = useHiveStore((state) => state.setHiveName);
  const navigate = useNavigate();
  const { initHive, initNotes } = useInitialize();
  const [hives, setHives] = useState<DirEntry[]>([]);
  const [error, setError] = useState<{ message: string } | null>(null);

  useEffect(() => {
    const obtainHives = async () => {
      setHiveName("");

      const newHives = await getHives();
      setHives(newHives);
    };
    obtainHives();
  }, []);

  const handleOnHiveClick = (hiveName: string) => {
    setHiveName(hiveName);
    navigate("/");
  };

  const handleOnConfirm = async (newHiveName?: string) => {
    setError(null);
    let error: { message: string } | null = null;

    if (newHiveName?.length === undefined || newHiveName?.length <= 0) {
      error = { message: t("theHiveNameCannotBeEmpty", { ns: "common" }) };
      setError(error);
      return;
    }

    if (await exists(newHiveName, { baseDir: ROOT_DIR })) {
      error = { message: t("thisFolderAlreadyExists", { ns: "common" }) };
      setError(error);
      return;
    }

    if (!error) {
      await initHive(newHiveName);
      await initNotes(newHiveName, ROOT_DIR);
      setHiveName(newHiveName);
      navigate("/");
    }
  };

  const handleOnDestroy = useCallback(async (hiveName: string) => {
    await remove(hiveName, { baseDir: ROOT_DIR, recursive: true });

    const newHives = await getHives();
    setHives(newHives);
  }, []);

  return (
    <div
      className={cn(
        "p-4 flex flex-1 flex-col min-h-0 items-center w-full",
        hives.length !== 0 && "pt-16",
      )}
    >
      {hives.length === 0 ? (
        <EmptyHives t={t} onConfirm={handleOnConfirm} error={error} />
      ) : (
        <HiveListing
          t={t}
          hives={hives}
          onHiveClick={handleOnHiveClick}
          onConfirm={handleOnConfirm}
          onDestroy={handleOnDestroy}
          error={error}
        />
      )}
    </div>
  );
};

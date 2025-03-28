import { Typography } from "@/components/Typography";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { DirEntry } from "@tauri-apps/plugin-fs";
import type { TFunction } from "i18next";
import { Folder, Trash } from "lucide-react";
import { CreateAnother } from "../CreateAnother";
import { DeleteConfirmation } from "@/components/DeleteConfirmation";

interface HiveListingProps {
  t: TFunction;
  hives: DirEntry[];
  onHiveClick: (hiveName: string) => void;
  error: { message: string } | null;
  onConfirm: (newHiveName?: string) => void;
  onDestroy: (hiveName: string) => void;
}

export const HiveListing = ({
  t,
  hives,
  onHiveClick,
  error,
  onConfirm,
  onDestroy,
}: HiveListingProps) => (
  <>
    <Typography variant="h1" className="mb-4" weight="normal">
      {t("yourHives")}
    </Typography>
    <div className="flex flex-col gap-3 w-full max-w-2xl">
      {hives.map((hive) => (
        <div key={hive.name} className="flex flex-row items-center gap-x-3">
          <Card
            className="cursor-pointer transition-colors hover:bg-accent active:bg-accent/80 flex-1"
            onClick={() => onHiveClick(hive.name)}
          >
            <CardHeader className="py-3">
              <div className="flex items-center space-x-2">
                <Folder className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">{hive.name}</CardTitle>
              </div>
            </CardHeader>
          </Card>
          <DeleteConfirmation
            t={t}
            icon={<Trash />}
            actionTitle={t("deleteHive", {
              hiveName: hive.name,
            })}
            actionDescription={t("areYouSureYouWantToDeleteThisHive")}
            onConfirm={() => onDestroy(hive.name)}
          />
        </div>
      ))}
      <CreateAnother t={t} error={error} onConfirm={onConfirm} />
    </div>
  </>
);

import { Typography } from "@/components/Typography";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { DirEntry } from "@tauri-apps/plugin-fs";
import type { TFunction } from "i18next";
import { Folder } from "lucide-react";
import { CreateAnother } from "../CreateAnother";

interface HiveListingProps {
  t: TFunction;
  hives: DirEntry[];
  onHiveClick: (hiveName: string) => void;
  error: { message: string } | null;
  onConfirm: (newHiveName?: string) => void;
}

export const HiveListing = ({
  t,
  hives,
  onHiveClick,
  error,
  onConfirm,
}: HiveListingProps) => (
  <>
    <Typography variant="h1" className="mb-4" weight="normal">
      {t("yourHives")}
    </Typography>
    <div className="flex flex-col gap-3 w-full max-w-2xl">
      {hives.map((hive, index) => (
        <Card
          key={index}
          className="cursor-pointer transition-colors hover:bg-accent active:bg-accent/80"
          onClick={() => onHiveClick(hive.name)}
        >
          <CardHeader className="py-3">
            <div className="flex items-center space-x-2">
              <Folder className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">{hive.name}</CardTitle>
            </div>
          </CardHeader>
        </Card>
      ))}
      <CreateAnother t={t} error={error} onConfirm={onConfirm} />
    </div>
  </>
);

import { Typography } from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { TFunction } from "i18next";
import { FolderPlus } from "lucide-react";
import { useState } from "react";
import { HiveInput } from "../HiveInput";

interface EmptyHivesProps {
  t: TFunction;
  error: { message: string } | null;
  onConfirm: (newHiveName?: string) => void;
}

export const EmptyHives = ({ t, onConfirm, error }: EmptyHivesProps) => {
  const [isInput, setIsInput] = useState(false);

  const handleOnCreateNewHive = () => {
    setIsInput(true);
  };

  return (
    <div className="w-full max-w-2xl flex flex-1 items-center">
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <FolderPlus className="w-12 h-12 text-muted-foreground" />
          <div className="text-center space-y-2">
            <Typography variant="h1" className="text-center" weight="normal">
              {t("noHivesFound")}
            </Typography>
            <Typography variant="p" className="text-center">
              {t("getStartedByCreatingYourFirstHive")}
            </Typography>
          </div>
          {isInput ? (
            <HiveInput t={t} error={error} onConfirm={onConfirm} />
          ) : (
            <Button onClick={handleOnCreateNewHive} className="mt-4">
              {t("createNewHive")}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

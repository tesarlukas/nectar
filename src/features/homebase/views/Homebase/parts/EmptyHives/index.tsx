import { Typography } from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { TFunction } from "i18next";
import { FolderPlus } from "lucide-react";

interface EmptyHivesProps {
  t: TFunction;
  onCreateHive: () => void;
}

export const EmptyHives = ({ t, onCreateHive }: EmptyHivesProps) => {
  return (
    <div className="w-full max-w-2xl flex flex-1 items-center">
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <FolderPlus className="w-12 h-12 text-muted-foreground" />
          <div className="text-center space-y-2">
            <Typography variant="h1" className="text-center" weight="normal">
              {t("noHivesFound")}
            </Typography>
            <Typography variant="p">
              {t("getStartedByCreatingYourFirstHive")}
            </Typography>
          </div>
          <Button onClick={onCreateHive} className="mt-4">
            {t("createNewHive")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

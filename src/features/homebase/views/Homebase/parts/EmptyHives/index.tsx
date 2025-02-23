import { Typography } from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { TFunction } from "i18next";
import { FolderPlus } from "lucide-react";
import { useRef, useState } from "react";

interface EmptyHivesProps {
  t: TFunction;
  onConfirm: (newHiveName?: string) => void;
  error: { message: string } | null;
}

export const EmptyHives = ({ t, onConfirm, error }: EmptyHivesProps) => {
  const [isInput, setIsInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnCreateNewHive = () => {
    setIsInput(true);
  };

  const handleOnConfirm = () => {
    onConfirm(inputRef.current?.value);
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
            <Typography variant="p">
              {t("getStartedByCreatingYourFirstHive")}
            </Typography>
          </div>
          {isInput ? (
            <>
              <div className="md:w-1/2 w-full">
                <Typography variant="p" weight="normal" className="mb-2">
                  {t("hiveName")}
                </Typography>
                <Input className="w-full" ref={inputRef} />
                {error && (
                  <Typography
                    variant="p"
                    textColor="destructive"
                    className="!mt-2"
                  >
                    {error.message}
                  </Typography>
                )}

                <Button
                  type="submit"
                  onClick={handleOnConfirm}
                  className="mt-4 mx-auto"
                >
                  {t("confirm")}
                </Button>
              </div>
            </>
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

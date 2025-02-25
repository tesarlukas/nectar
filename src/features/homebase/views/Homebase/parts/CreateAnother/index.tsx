import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { TFunction } from "i18next";
import { FolderPlus } from "lucide-react";
import { useState } from "react";
import { HiveInput } from "../HiveInput";

interface CreateAnotherProps {
  t: TFunction;
  error: { message: string } | null;
  onConfirm: (newHiveName?: string) => void;
}

export const CreateAnother = ({ t, error, onConfirm }: CreateAnotherProps) => {
  const [isInput, setIsInput] = useState(false);
  console.log("rerender", isInput);

  const handleOnAddHive = () => {
    setIsInput(true);
  };

  const handleOnCancel = () => {
    setIsInput(false);
  };

  return (
    <Card
      className="cursor-pointer transition-colors bg-accent hover:bg-background active:bg-background/80"
      onClick={handleOnAddHive}
    >
      <CardHeader className="py-3">
        <div className="flex items-center space-x-2">
          <FolderPlus className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">{t("addHive")}</CardTitle>
        </div>
      </CardHeader>
      {isInput && (
        <HiveInput
          t={t}
          error={error}
          onConfirm={onConfirm}
          className="px-6 pb-3"
          onCancel={handleOnCancel}
        />
      )}
    </Card>
  );
};

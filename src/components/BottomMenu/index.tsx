import { useTranslation } from "react-i18next";
import { Card } from "../ui/card";

export interface BottomMenuProps {
  charCount: number;
}

export const BottomMenu = ({ charCount }: BottomMenuProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Card className="flex flex-row rounded-t-none h-12 py-2 px-8 bottom-0 w-full">
        <div className="ml-auto">
          {t("characterCount")}: {charCount}
        </div>
      </Card>
    </>
  );
};

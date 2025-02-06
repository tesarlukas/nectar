import { ColorSchemeToggle } from "../TopMenu/parts/ColorSchemeToggle";
import { Card } from "../ui/card";

export interface BottomMenuProps {
  wordCount: number;
}

export const BottomMenu = ({ wordCount }: BottomMenuProps) => {
  return (
    <>
      <Card className="flex flex-row rounded-t-none h-12 py-2 px-8 bottom-0 w-full">
        <div>{wordCount}</div>
      </Card>
    </>
  );
};

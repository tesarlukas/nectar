import { Card } from "../ui/card";
import { ColorSchemeToggle } from "./parts/ModeToggle";

export const TopMenu = () => {
  return (
    <>
      <Card className="rounded-b-none py-4 px-8 flex flex-row">
        <div className="ml-auto">
          <ColorSchemeToggle />
        </div>
      </Card>
    </>
  );
};

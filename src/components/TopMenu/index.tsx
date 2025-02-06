import { Card } from "../ui/card";
import { ColorSchemeToggle } from "./parts/ColorSchemeToggle";

export const TopMenu = () => {
  return (
    <>
      <Card className="rounded-b-none py-4 px-8 flex flex-row">
        <div>
          <h1 className="text-4xl">Nectar</h1>
        </div>
        <div className="ml-auto">
          <ColorSchemeToggle />
        </div>
      </Card>
    </>
  );
};

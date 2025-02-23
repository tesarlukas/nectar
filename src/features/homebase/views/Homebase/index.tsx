import { useEffect, useState } from "react";
import type { DirEntry } from "@tauri-apps/plugin-fs";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Folder } from "lucide-react";
import { getHives } from "./utils/getHives";

export const Homebase = () => {
  const [hives, setHives] = useState<DirEntry[]>([]);

  useEffect(() => {
    const obtainHives = async () => {
      const newHives = await getHives();
      setHives(newHives);
    };
    obtainHives();
  }, []);

  return (
    <div className="p-4">
      <div className="flex flex-col gap-3">
        {hives.map((hive, index) => (
          <Card
            key={index}
            className="cursor-pointer transition-colors hover:bg-accent active:bg-accent/80"
          >
            <CardHeader className="py-3">
              <div className="flex items-center space-x-2">
                <Folder className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">{hive.name}</CardTitle>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

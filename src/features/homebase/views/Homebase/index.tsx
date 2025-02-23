import { Button } from "@/components/ui/button";
import { ROOT_DIR } from "@/constants/rootDir";
import { useInitialize } from "@/hooks/useInitialize";

export const Homebase = () => {
  const { initHive } = useInitialize();

  return (
    <div className="p-4">
      <Button onClick={() => initHive("MyHive", ROOT_DIR)}>Initialize</Button>
    </div>
  );
};

import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router";

export const Settings = () => {
  const navigate = useNavigate();

  return (
    <>
      <div>
        Hello There! This is settings
        <Button onClick={() => navigate("/")}>Go to editor</Button>
      </div>
    </>
  );
};

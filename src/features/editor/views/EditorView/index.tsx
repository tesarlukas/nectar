import { Editor } from "@/components/Editor";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router";

export const EditorView = () => {
  const navigate = useNavigate();

  return (
    <>
      <div>This is editor view yey</div>
      <Button onClick={() => navigate("/settings")} />
      <Editor />
    </>
  );
};

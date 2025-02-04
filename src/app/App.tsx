import { Editor } from "@/components/Editor";
import { Provider } from "./provider";
import { AppearanceSettings } from "@/features/appearance/views/AppearanceSettings";
import { Button } from "@/components/ui/Button";

export default function App() {
  return (
    <main className="h-screen justify-center bg-fuchsia-100 p-4">
      <Provider>
        <Editor />
        <AppearanceSettings />
      </Provider>
    </main>
  );
}

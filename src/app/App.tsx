import { Editor } from "@/components/Editor";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/Resizable";
import { AppearanceSettings } from "@/features/appearance/views/AppearanceSettings";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Provider } from "./provider";
import { useColorTheme } from "@/features/appearance/colorTheme/hooks/useColorTheme";

export default function App() {
  const { t } = useTranslation();
  const { updateColorTheme } = useColorTheme();

  useEffect(() => {
    const setupTheme = async () => {
      await updateColorTheme();
    };

    setupTheme();
  }, []);

  return (
    <main className="h-screen justify-center bg-fuchsia-100 p-4">
      <Provider>
        <Editor />
        <AppearanceSettings />
        <div>{t("helloWorld")}</div>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>One</ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>Two</ResizablePanel>
        </ResizablePanelGroup>
      </Provider>
    </main>
  );
}

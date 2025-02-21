import { useEffect } from "react";
import { Provider } from "./provider";
import { HashRouter as Router, Routes, Route } from "react-router";
import { EditorView } from "@/features/editor/views/EditorView";
import { useColorTheme } from "@/features/appearance/colorTheme/hooks/useColorTheme";
import { Layout } from "@/features/layout/views/Layout";
import { useInitialize } from "@/hooks/useInitialize";
import { ROOT_DIR } from "@/constants/rootDir";
import { Homebase } from "@/features/homebase/views/Homebase";
import { SettingsLayout } from "@/features/layout/views/SettingsLayout";
import { AppearanceSettings } from "@/features/settings/views/AppearanceSettings";
import { KeymapSettings } from "@/features/settings/views/KeymapSettings";

export default function App() {
  const { initializeTheme } = useColorTheme();
  const { initHive, initNotes, initSettings } = useInitialize();

  useEffect(() => {
    initializeTheme();

    const initializeAsync = async () => {
      await initHive("MyHive", ROOT_DIR);
      await initNotes(ROOT_DIR);
      await initSettings(ROOT_DIR);
    };

    initializeAsync();
  }, []);

  return (
    <main className="flex flex-col h-screen bg-background">
      <Provider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<EditorView />} />
              <Route path="settings" element={<SettingsLayout />}>
                <Route index element={<AppearanceSettings />} />
                <Route path="keymap" element={<KeymapSettings />} />
              </Route>
            </Route>
            <Route path="homebase" element={<Homebase />} />
          </Routes>
        </Router>
      </Provider>
    </main>
  );
}

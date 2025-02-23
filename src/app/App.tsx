import { useEffect } from "react";
import { Provider } from "./provider";
import { HashRouter as Router, Routes, Route } from "react-router";
import { EditorView } from "@/features/editor/views/EditorView";
import { useColorTheme } from "@/features/appearance/colorTheme/hooks/useColorTheme";
import { Layout } from "@/features/layout/views/Layout";
import { Homebase } from "@/features/homebase/views/Homebase";
import { SettingsLayout } from "@/features/layout/views/SettingsLayout";
import { AppearanceSettings } from "@/features/settings/views/AppearanceSettings";
import { KeymapSettings } from "@/features/settings/views/KeymapSettings";

export default function App() {
  const { initializeTheme } = useColorTheme();

  useEffect(() => {
    initializeTheme();
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
              <Route path="homebase" element={<Homebase />} />
            </Route>
          </Routes>
        </Router>
      </Provider>
    </main>
  );
}

import { useEffect } from "react";
import { Provider } from "./provider";
import { HashRouter as Router, Routes, Route } from "react-router";
import { EditorView } from "@/features/editor/views/EditorView";
import { Settings } from "@/features/settings/views/Settings";
import { useColorTheme } from "@/features/appearance/colorTheme/hooks/useColorTheme";
import { Layout } from "@/features/layout/views/Layout";
import { useInitialize } from "@/hooks/useInitialize";
import { ROOT_DIR } from "@/constants/rootDir";

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
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </Provider>
    </main>
  );
}

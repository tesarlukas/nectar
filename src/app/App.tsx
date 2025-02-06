import { useEffect } from "react";
import { Provider } from "./provider";
import { HashRouter as Router, Routes, Route } from "react-router";
import { EditorView } from "@/features/editor/views/EditorView";
import { Settings } from "@/features/settings/views/Settings";
import { TopMenu } from "@/components/TopMenu";
import { useColorTheme } from "@/features/appearance/colorTheme/hooks/useColorTheme";

export default function App() {
  const { initializeTheme } = useColorTheme();

  useEffect(() => {
    initializeTheme();
  }, []);

  return (
    <main className="flex flex-col h-screen bg-background">
      <Provider>
        <TopMenu />
        <Router>
          <Routes>
            <Route path="/" element={<EditorView />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </Router>
      </Provider>
    </main>
  );
}

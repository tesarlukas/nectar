import { useEffect } from "react";
import { Provider } from "./provider";
import { useColorTheme } from "@/features/appearance/colorTheme/hooks/useColorTheme";
import { HashRouter as Router, Routes, Route } from "react-router";
import { EditorView } from "@/features/editor/views/EditorView";
import { Settings } from "@/features/settings/views/Settings";

export default function App() {
  const { updateColorTheme } = useColorTheme();

  useEffect(() => {
    const setupTheme = async () => {
      await updateColorTheme();
    };

    setupTheme();
  }, []);

  return (
    <main className="h-screen justify-center bg-fuchsia-100">
      <Provider>
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

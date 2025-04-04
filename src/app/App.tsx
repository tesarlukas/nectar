import { useEffect } from "react";
import { Provider } from "./provider";
import { HashRouter as Router, Routes, Route } from "react-router";
import { EditorView } from "@/features/editor/views/EditorView";
import { Layout } from "@/features/layout/views/Layout";
import { Homebase } from "@/features/homebase/views/Homebase";
import { SettingsLayout } from "@/features/layout/views/SettingsLayout";
import { ShortcutsSettings } from "@/features/settings/views/ShortcutsSettings";
import { Toaster } from "@/components/ui/sonner";
import { GraphView } from "@/features/graph/view/Graph";
import { useInitialize } from "@/hooks/useInitialize";

export default function App() {
  const { initSettings } = useInitialize();

  useEffect(() => {
    initSettings();
  }, []);

  return (
    <main className="flex flex-col h-screen bg-background">
      <Provider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<EditorView />} />
              <Route path="graph" element={<GraphView />} />
              <Route path="settings" element={<SettingsLayout />}>
                <Route index element={<ShortcutsSettings />} />
              </Route>
              <Route path="homebase" element={<Homebase />} />
            </Route>
          </Routes>
        </Router>
      </Provider>
      <Toaster
        position="bottom-center"
        swipeDirections={["left", "right", "top"]}
        offset={{ bottom: "64px" }}
      />
    </main>
  );
}

import { Provider } from "./provider";
import { HashRouter as Router, Routes, Route } from "react-router";
import { EditorView } from "@/features/editor/views/EditorView";
import { Settings } from "@/features/settings/views/Settings";
import { TopMenu } from "@/components/TopMenu";

export default function App() {
  return (
    <main className="h-screen justify-center bg-background">
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

import reactLogo from "@/assets/react.svg";
import { Editor } from "@/components/Editor";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";

export default function App() {
  return (
    <main className="h-screen justify-center bg-fuchsia-100 p-4">
      <Editor />
    </main>
  );
}

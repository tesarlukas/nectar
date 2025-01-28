import reactLogo from "@/assets/react.svg";
import { Tiptap } from "@/components/Tiptap";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";

export default function App() {
  return (
    <main className="h-screen flex justify-center bg-fuchsia-100 p-4">
      <Tiptap />
    </main>
  );
}

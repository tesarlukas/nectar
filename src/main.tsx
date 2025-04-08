import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/app/App";
import "./main.css";

import "./translation";

// // Prevent context menu only in production
if (import.meta.env.PROD) {
  document.addEventListener(
    "contextmenu",
    (e) => {
      e.preventDefault();
      return false;
    },
    false,
  );

  // Prevent Ctrl+J shortcut
  document.addEventListener(
    "keydown",
    (e) => {
      if (e.ctrlKey && e.key === "j") {
        e.preventDefault();
      }
    },
    false,
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

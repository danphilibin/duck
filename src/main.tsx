import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./tailwind.css";

declare global {
  interface WindowEventMap {
    "toggle-preferences": CustomEvent;
    "show-preferences": CustomEvent;
  }
}

declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    directory?: string;
    webkitdirectory?: string;
  }
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
);

import React from "react";
import ReactDOM from "react-dom/client";
import { KiboProvider } from "@kibo-ui/react";
import App from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <KiboProvider>
      <App />
    </KiboProvider>
  </React.StrictMode>,
);

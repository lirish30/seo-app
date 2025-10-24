import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import { KiboProvider } from "@kibo-ui/react";
import App from "./App";
import "./styles.css";
ReactDOM.createRoot(document.getElementById("root")).render(_jsx(React.StrictMode, { children: _jsx(KiboProvider, { children: _jsx(App, {}) }) }));

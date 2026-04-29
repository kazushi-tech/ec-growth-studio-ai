import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ImportProvider } from "./lib/csv/ImportContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ImportProvider>
        <App />
      </ImportProvider>
    </BrowserRouter>
  </React.StrictMode>
);

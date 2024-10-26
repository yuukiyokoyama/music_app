import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { SessionProvider } from "./SessionProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SessionProvider>
      <App />
    </SessionProvider>
  </React.StrictMode>
);

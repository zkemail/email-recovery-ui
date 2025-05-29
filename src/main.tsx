import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    <Toaster
      toastOptions={{
        duration: 7000,
        style: {
          fontSize: "20px",
          padding: "16px",
        },
        position: "bottom-center",
      }}
    />
  </React.StrictMode>,
);

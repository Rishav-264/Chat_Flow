import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ReactFlowProvider } from "reactflow";
import { DnDProvider } from "./pages/utils/DnDContext.jsx";
import { ToastContainer } from "react-toastify";

import "./index.css";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ReactFlowProvider>
      <DnDProvider>
        <App />
        <ToastContainer
          position="top-center"
          theme="colored"
          autoClose={4000}
        />
      </DnDProvider>
    </ReactFlowProvider>
  </React.StrictMode>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { DownloadPrompt } from "./components/DownloadPrompt.tsx";
import "./index.css";

const AppEntry = () => {
  if (window.location.pathname === "/download") {
    return <DownloadPrompt />;
  }
  return <App />;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppEntry />
  </StrictMode>,
);

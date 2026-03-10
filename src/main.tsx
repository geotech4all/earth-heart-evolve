import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Hide loader once React mounts
const root = createRoot(document.getElementById("root")!);
root.render(<App />);

// Remove loading screen
const loader = document.getElementById("app-loader");
if (loader) {
  loader.classList.add("hidden");
  setTimeout(() => loader.remove(), 300);
}

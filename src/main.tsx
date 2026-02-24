import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerServiceWorker } from "@/lib/pwa";

// Register Service Worker for PWA + Offline Mode
if ('serviceWorker' in navigator) {
  registerServiceWorker().catch((error) => {
    console.error('[PWA] Failed to register:', error);
  });
}

createRoot(document.getElementById("root")!).render(<App />);

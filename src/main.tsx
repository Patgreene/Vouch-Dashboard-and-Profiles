import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeVisitorTracking } from "./lib/visitorTracking.ts";

// Initialize visitor tracking
initializeVisitorTracking();

createRoot(document.getElementById("root")!).render(<App />);

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/avatar-fix.css";
import { initializeVisitorTracking } from "./lib/visitorTracking.ts";
import "./utils/deleteNathanProfile.ts";

// Initialize visitor tracking
initializeVisitorTracking();

createRoot(document.getElementById("root")!).render(<App />);

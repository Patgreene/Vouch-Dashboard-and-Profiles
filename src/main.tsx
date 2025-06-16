import { createRoot } from "react-dom/client";
import App from "./App.tsx";

// Import critical CSS first
import "./index.css";

// Lazy load non-critical CSS and utilities
const loadNonCriticalAssets = async () => {
  // Load avatar fixes only when needed
  await import("./styles/avatar-fix.css");

  // Initialize visitor tracking after main app loads
  const { initializeVisitorTracking } = await import(
    "./lib/visitorTracking.ts"
  );
  initializeVisitorTracking();

  // Load profile validation and cleanup utilities
  await import("./utils/profileValidator.ts");
  await import("./utils/profileCleanup.ts");

  // Load debugging utilities (only in development)
  if (import.meta.env.DEV) {
    await import("./utils/supabaseDebug.ts");
    await import("./utils/databaseHealthCheck.ts");
    await import("./utils/profileDiagnostic.ts");
    await import("./utils/supabaseFixer.ts");
    await import("./utils/supabaseReconnect.ts");
    await import("./utils/simpleSupabaseQuery.ts");
    await import("./utils/quickAdminFix.ts");
    await import("./utils/navigationFix.ts");
  }
};

// Start the React app immediately
const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);
root.render(<App />);

// Load non-critical assets after the app is rendered
if (typeof window !== "undefined") {
  // Use requestIdleCallback for better performance
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(() => {
      loadNonCriticalAssets();
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(loadNonCriticalAssets, 100);
  }
}

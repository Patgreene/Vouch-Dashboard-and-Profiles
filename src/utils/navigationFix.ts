/**
 * Navigation Fix Utility
 * Fixes issues with unwanted redirects and navigation state
 */

export function clearNavigationState(): void {
  console.log("🧹 Clearing navigation state...");

  try {
    // Clear any problematic session storage
    const problematicKeys = [
      "lastProfileId",
      "currentProfile",
      "redirectTo",
      "selectedProfile",
    ];

    problematicKeys.forEach((key) => {
      if (sessionStorage.getItem(key)) {
        console.log(`🗑️ Removing session storage: ${key}`);
        sessionStorage.removeItem(key);
      }
    });

    // Clear any problematic localStorage navigation data
    const localProblematicKeys = ["lastRoute", "pendingNavigation"];

    localProblematicKeys.forEach((key) => {
      if (localStorage.getItem(key)) {
        console.log(`🗑️ Removing localStorage: ${key}`);
        localStorage.removeItem(key);
      }
    });

    // Clear URL parameters that might cause issues
    const url = new URL(window.location.href);
    const problematicParams = ["profile", "id", "redirect", "return"];

    let hasProblematicParams = false;
    problematicParams.forEach((param) => {
      if (url.searchParams.has(param)) {
        console.log(`🗑️ Removing URL parameter: ${param}`);
        url.searchParams.delete(param);
        hasProblematicParams = true;
      }
    });

    if (hasProblematicParams) {
      window.history.replaceState({}, "", url.toString());
    }

    console.log("✅ Navigation state cleared");
  } catch (error) {
    console.error("❌ Error clearing navigation state:", error);
  }
}

export function forceAdminDashboard(): void {
  console.log("🔄 Force navigating to admin dashboard...");

  try {
    // Clear any problematic state first
    clearNavigationState();

    // Force navigation to admin dashboard
    const adminUrl = "/sys-admin-x9K2mP8qL5nW";

    if (window.location.pathname !== adminUrl) {
      console.log(
        `🔄 Navigating from ${window.location.pathname} to ${adminUrl}`,
      );
      window.location.href = adminUrl;
    } else {
      console.log("✅ Already on admin dashboard");
      // If we're already on the admin page but seeing 404, reload
      if (
        document.title.includes("404") ||
        document.body.textContent?.includes("Profile Not Found")
      ) {
        console.log("🔄 Reloading to fix 404 state");
        window.location.reload();
      }
    }
  } catch (error) {
    console.error("❌ Error forcing admin dashboard:", error);
  }
}

export function debugCurrentState(): void {
  console.group("🔍 Current Navigation State Debug");

  console.log("URL Info:");
  console.log("  - pathname:", window.location.pathname);
  console.log("  - search:", window.location.search);
  console.log("  - hash:", window.location.hash);
  console.log("  - href:", window.location.href);

  console.log("Document Info:");
  console.log("  - title:", document.title);
  console.log("  - body classes:", document.body.className);

  console.log("Session Storage:");
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key) {
      console.log(`  - ${key}:`, sessionStorage.getItem(key));
    }
  }

  console.log("Router State:");
  console.log("  - history length:", window.history.length);
  console.log("  - current state:", window.history.state);

  // Check if we're in a problematic state
  const isOn404 =
    document.body.textContent?.includes("Profile Not Found") ||
    document.title.includes("404");
  const shouldBeOnAdmin =
    window.location.pathname === "/sys-admin-x9K2mP8qL5nW";

  if (isOn404 && shouldBeOnAdmin) {
    console.error("🚨 PROBLEM DETECTED: On admin path but showing 404");
    console.log("💡 Suggested fix: Run forceAdminDashboard()");
  }

  console.groupEnd();
}

// Auto-fix for common navigation issues
export function autoFixNavigation(): void {
  console.log("🔧 Running auto-fix for navigation issues...");

  const currentPath = window.location.pathname;

  // If we're on admin path but seeing 404, fix it
  if (currentPath === "/sys-admin-x9K2mP8qL5nW") {
    const isOn404 = document.body.textContent?.includes("Profile Not Found");
    if (isOn404) {
      console.log("🔧 Detected admin 404 issue, fixing...");
      clearNavigationState();
      setTimeout(() => {
        window.location.reload();
      }, 100);
      return;
    }
  }

  // If we're on a profile path with invalid ID, redirect to welcome
  if (currentPath.startsWith("/profile/")) {
    const profileId = currentPath.split("/profile/")[1];
    if (!profileId || profileId === "undefined" || profileId === "null") {
      console.log("🔧 Detected invalid profile ID, redirecting to home...");
      window.location.href = "/";
      return;
    }
  }

  console.log("✅ No navigation issues detected");
}

// Expose utilities to window
if (typeof window !== "undefined") {
  (window as any).clearNavigationState = clearNavigationState;
  (window as any).forceAdminDashboard = forceAdminDashboard;
  (window as any).debugCurrentState = debugCurrentState;
  (window as any).autoFixNavigation = autoFixNavigation;

  console.log("🔧 Navigation fix tools available:");
  console.log("  - clearNavigationState() - Clear problematic navigation data");
  console.log("  - forceAdminDashboard() - Force navigate to admin dashboard");
  console.log("  - debugCurrentState() - Debug current navigation state");
  console.log("  - autoFixNavigation() - Auto-fix common navigation issues");

  // Auto-run the fix on load
  setTimeout(autoFixNavigation, 500);
}

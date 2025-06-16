import React, { useEffect, useState } from "react";
import AdminDashboard from "../pages/AdminDashboard";

/**
 * AdminRouteGuard
 * Ensures the admin dashboard loads properly without any unwanted redirects
 */

export function AdminRouteGuard() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Log access attempt
    console.log("🔐 AdminRouteGuard: Accessing admin dashboard");
    console.log("🔐 Current URL:", window.location.href);
    console.log("🔐 Current pathname:", window.location.pathname);

    // Prevent any automatic redirects during admin dashboard load
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    // Temporarily override history methods to log and prevent unwanted redirects
    window.history.pushState = function (...args) {
      console.log("🚨 Attempted pushState during admin load:", args);
      // Only allow admin-related navigation
      if (
        args[2] &&
        (args[2].toString().includes("admin") ||
          args[2].toString().includes("/not-found"))
      ) {
        return originalPushState.apply(this, args);
      } else {
        console.log("🚫 Blocked unwanted navigation:", args[2]);
      }
    };

    window.history.replaceState = function (...args) {
      console.log("🚨 Attempted replaceState during admin load:", args);
      // Only allow admin-related navigation
      if (
        args[2] &&
        (args[2].toString().includes("admin") ||
          args[2].toString().includes("/not-found"))
      ) {
        return originalReplaceState.apply(this, args);
      } else {
        console.log("🚫 Blocked unwanted replace:", args[2]);
      }
    };

    // Clear any problematic URL parameters
    const url = new URL(window.location.href);
    if (url.search) {
      console.log("🧹 Clearing URL parameters:", url.search);
      window.history.replaceState(
        {},
        "",
        window.location.pathname + window.location.hash,
      );
    }

    // Set ready after a brief delay to ensure everything is stable
    const timer = setTimeout(() => {
      setIsReady(true);
      // Restore original history methods
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      console.log("✅ AdminRouteGuard: Dashboard ready to load");
    }, 100);

    return () => {
      clearTimeout(timer);
      // Restore original history methods on cleanup
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vouch-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing admin dashboard...</p>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
}

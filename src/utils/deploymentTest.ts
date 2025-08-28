/**
 * Deployment Test Utility
 * Helps debug routing and deployment issues
 */

export function testDeploymentRouting(): void {
  console.group("🔍 Deployment Routing Test");

  console.log("Environment Info:");
  console.log("  - Current URL:", window.location.href);
  console.log("  - Pathname:", window.location.pathname);
  console.log("  - Hash:", window.location.hash);
  console.log("  - Search:", window.location.search);
  console.log("  - Origin:", window.location.origin);
  console.log("  - Host:", window.location.host);

  console.log("Deployment Detection:");
  const isVercel = window.location.host.includes("vercel.app");
  const isNetlify = window.location.host.includes("netlify.app");
  const isGitHubPages = window.location.host.includes("github.io");
  const isLocalhost = window.location.host.includes("localhost");
  const isBuilderIO = window.location.host.includes("builder.codes");

  console.log("  - Vercel:", isVercel);
  console.log("  - Netlify:", isNetlify);
  console.log("  - GitHub Pages:", isGitHubPages);
  console.log("  - Localhost:", isLocalhost);
  console.log("  - Builder.io:", isBuilderIO);

  console.log("Route Testing:");
  const routes = [
    "/",
    "/sys-admin-x9K2mP8qL5nW",
    "/profile/test-id",
    "/not-found",
  ];

  routes.forEach((route) => {
    const fullUrl = window.location.origin + route;
    console.log(`  - ${route}: ${fullUrl}`);
  });

  console.groupEnd();
}

export function forceAdminNavigation(): void {
  console.log("🚀 Force navigating to admin dashboard...");

  const adminPath = "/sys-admin-x9K2mP8qL5nW";
  const currentPath = window.location.pathname;

  if (currentPath !== adminPath) {
    console.log(`Navigating from ${currentPath} to ${adminPath}`);

    // Try different navigation methods
    try {
      // Method 1: Direct assignment
      window.location.href = adminPath;
    } catch (error) {
      console.error("Navigation failed:", error);

      // Method 2: Replace
      try {
        window.location.replace(adminPath);
      } catch (replaceError) {
        console.error("Replace navigation failed:", replaceError);

        // Method 3: Full URL
        window.location.href = window.location.origin + adminPath;
      }
    }
  } else {
    console.log("✅ Already on admin path");
  }
}

export function testAdminAccess(): void {
  console.log("🔐 Testing admin access...");

  const adminUrl = window.location.origin + "/sys-admin-x9K2mP8qL5nW";

  // Create a temporary link to test the URL
  const testLink = document.createElement("a");
  testLink.href = adminUrl;
  testLink.style.display = "none";
  document.body.appendChild(testLink);

  console.log("Admin URL components:");
  console.log("  - Full URL:", testLink.href);
  console.log("  - Pathname:", testLink.pathname);
  console.log("  - Valid:", testLink.href.includes("sys-admin-x9K2mP8qL5nW"));

  document.body.removeChild(testLink);

  // Test if we can navigate there
  console.log("Click the button below to test admin navigation:");
  console.log("Or run: forceAdminNavigation()");
}

// Expose utilities to window
if (typeof window !== "undefined") {
  (window as any).testDeploymentRouting = testDeploymentRouting;
  (window as any).forceAdminNavigation = forceAdminNavigation;
  (window as any).testAdminAccess = testAdminAccess;

  console.log("🔧 Deployment test tools available:");
  console.log("  - testDeploymentRouting() - Check deployment environment");
  console.log("  - forceAdminNavigation() - Force navigate to admin");
  console.log("  - testAdminAccess() - Test admin URL construction");
}

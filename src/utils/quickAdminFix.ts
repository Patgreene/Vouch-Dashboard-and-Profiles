/**
 * Quick Admin Dashboard Fix
 * This utility fixes the loading state issue and forces the dashboard to load with localStorage data
 */

export async function forceLoadAdminWithLocalStorage() {
  console.group("🚨 Emergency Admin Dashboard Fix");

  try {
    // 1. Get localStorage data directly
    console.log("1️⃣ Loading profiles from localStorage...");
    const stored = localStorage.getItem("vouch_profiles");

    if (stored) {
      const profiles = JSON.parse(stored);
      console.log(`✅ Found ${profiles.length} profiles in localStorage`);
      console.log(
        "📋 Profile names:",
        profiles.map((p: any) => p.name),
      );
    } else {
      console.log("❌ No localStorage profiles found");
    }

    // 2. Force clear any loading states
    console.log("2️⃣ Clearing any stuck loading states...");
    sessionStorage.clear();

    // Clear any error flags
    Object.keys(localStorage).forEach((key) => {
      if (key.includes("error") || key.includes("loading")) {
        localStorage.removeItem(key);
      }
    });

    // 3. Force reload the admin page
    console.log("3️⃣ Force reloading admin dashboard...");
    console.groupEnd();

    // Use replace to avoid going back to loading state
    window.location.replace("/sys-admin-x9K2mP8qL5nW");
  } catch (error) {
    console.error("❌ Emergency fix failed:", error);
    console.groupEnd();
  }
}

// Quick function to add sample data if localStorage is empty
export async function ensureLocalStorageData() {
  console.log("🔍 Checking localStorage data...");

  const stored = localStorage.getItem("vouch_profiles");
  if (!stored || JSON.parse(stored).length === 0) {
    console.log("➕ Adding sample data to localStorage...");

    const { sampleProfiles, addProfile } = await import("../lib/data");
    sampleProfiles.forEach((profile) => {
      addProfile(profile);
    });

    console.log("✅ Sample data added");
  } else {
    const profiles = JSON.parse(stored);
    console.log(`✅ Found ${profiles.length} existing profiles`);
  }
}

// Show what's actually in localStorage right now
export function showLocalStorageProfiles() {
  console.group("📋 Current localStorage Profiles");

  const stored = localStorage.getItem("vouch_profiles");
  if (stored) {
    try {
      const profiles = JSON.parse(stored);
      console.log(`Found ${profiles.length} profiles:`);
      profiles.forEach((profile: any, index: number) => {
        console.log(
          `${index + 1}. ${profile.name} (${profile.title}) - ID: ${profile.id}`,
        );
      });
    } catch (error) {
      console.error("❌ Error parsing localStorage data:", error);
    }
  } else {
    console.log("❌ No profiles in localStorage");
  }

  console.groupEnd();
}

// Bypass all the complex data loading and just show the dashboard
export function bypassLoadingScreen() {
  console.log("🚨 Bypassing loading screen...");

  // Find the loading element and hide it
  const loadingElements = document.querySelectorAll(
    '[data-testid="loading"], .animate-spin',
  );
  loadingElements.forEach((el) => {
    (el as HTMLElement).style.display = "none";
  });

  // Show admin content if it exists
  const adminContent = document.querySelector(
    '[data-testid="admin-content"], .admin-dashboard',
  );
  if (adminContent) {
    (adminContent as HTMLElement).style.display = "block";
  }

  console.log("✅ Loading screen bypassed");
}

// Expose functions to window
if (typeof window !== "undefined") {
  (window as any).forceLoadAdminWithLocalStorage =
    forceLoadAdminWithLocalStorage;
  (window as any).ensureLocalStorageData = ensureLocalStorageData;
  (window as any).showLocalStorageProfiles = showLocalStorageProfiles;
  (window as any).bypassLoadingScreen = bypassLoadingScreen;

  console.log("🚨 Emergency admin tools available:");
  console.log(
    "  - forceLoadAdminWithLocalStorage() - Force reload admin with localStorage",
  );
  console.log("  - ensureLocalStorageData() - Add sample data if needed");
  console.log(
    "  - showLocalStorageProfiles() - Show current localStorage data",
  );
  console.log("  - bypassLoadingScreen() - Force hide loading screen");
}

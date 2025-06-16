import { dataProvider } from "../lib/dataProvider";

export async function checkAndDeleteNathanProfile() {
  console.log("🔍 Nathan profile deletion utility is disabled");
  console.log("💡 Use profile validation tools instead:");
  console.log("  - validateProfiles() to check all profiles");
  console.log("  - validateAgainstSupabase() to find ghost profiles");
  console.log("  - cleanupGhostProfiles() to remove orphaned profiles");

  return {
    success: false,
    message: "Utility disabled - use validation tools instead",
  };
}

// Don't execute automatically to prevent crashes
// This was causing issues by trying to access profiles that don't exist

// Still expose it globally but disabled
if (typeof window !== "undefined") {
  (window as any).checkAndDeleteNathanProfile = checkAndDeleteNathanProfile;
}

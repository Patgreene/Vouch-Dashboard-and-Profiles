/**
 * Profile Diagnostic Utility
 * Quick way to check what data is available
 */

export function diagnoseProfileData() {
  console.group("🔍 Profile Data Diagnostic");

  // Check localStorage
  const localStorageData = localStorage.getItem("vouch_profiles");
  if (localStorageData) {
    try {
      const profiles = JSON.parse(localStorageData);
      console.log("✅ localStorage profiles found:", profiles.length);
      console.log(
        "📋 Profile IDs:",
        profiles.map((p: any) => p.id),
      );
    } catch (error) {
      console.error("❌ Invalid localStorage data:", error);
    }
  } else {
    console.log("❌ No localStorage profiles found");
  }

  // Check sample data
  import("../lib/data").then(({ sampleProfiles }) => {
    console.log("✅ Sample profiles available:", sampleProfiles.length);
    console.log(
      "📋 Sample IDs:",
      sampleProfiles.map((p) => p.id),
    );
  });

  // Check Supabase configuration
  console.log("🔧 Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
  console.log(
    "🔧 Supabase key present:",
    !!import.meta.env.VITE_SUPABASE_ANON_KEY,
  );

  console.groupEnd();
}

// Add some sample profiles to localStorage for testing
export function addSampleProfilesToLocalStorage() {
  import("../lib/data").then(({ sampleProfiles, addProfile }) => {
    console.log("➕ Adding sample profiles to localStorage...");
    sampleProfiles.forEach((profile) => {
      addProfile(profile);
    });
    console.log("✅ Sample profiles added to localStorage");
    diagnoseProfileData();
  });
}

// Expose to window for console access
if (typeof window !== "undefined") {
  (window as any).diagnoseProfiles = diagnoseProfileData;
  (window as any).addSampleProfiles = addSampleProfilesToLocalStorage;

  console.log("🔍 Profile diagnostics available:");
  console.log("  - diagnoseProfiles() - Check what data is available");
  console.log("  - addSampleProfiles() - Add sample data to localStorage");
}

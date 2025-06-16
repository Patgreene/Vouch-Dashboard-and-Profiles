import {
  validateAndCleanProfiles,
  validateProfilesAgainstSupabase,
  cleanupGhostProfiles,
} from "./profileValidator";
import { dataProvider } from "../lib/dataProvider";

/**
 * Comprehensive Profile Cleanup Utility
 * Safely handles missing, malformed, and ghost profiles
 */

export async function performProfileCleanup(): Promise<{
  success: boolean;
  report: string;
  details: any;
}> {
  console.group("🧹 Starting comprehensive profile cleanup");

  try {
    // 1. Get all profiles from localStorage
    console.log("1️⃣ Loading profiles from localStorage...");
    const { getAllProfiles } = await import("../lib/data");
    const localProfiles = getAllProfiles();
    console.log(`Found ${localProfiles.length} profiles in localStorage`);

    // 2. Validate and clean local profiles
    console.log("2️⃣ Validating profile structure...");
    const { validProfiles, fixedProfiles, invalidProfiles, summary } =
      validateAndCleanProfiles(localProfiles);

    console.log(summary);

    // 3. Check against Supabase if available
    console.log("3️⃣ Checking against Supabase...");
    let supabaseValidation = null;
    try {
      supabaseValidation = await validateProfilesAgainstSupabase([
        ...validProfiles,
        ...fixedProfiles,
      ]);

      if (supabaseValidation.onlyInLocalStorage.length > 0) {
        console.log("👻 Found ghost profiles (localStorage only):");
        supabaseValidation.onlyInLocalStorage.forEach((profile) => {
          console.log(`  - ${profile.name} (${profile.id})`);
        });
      }
    } catch (error) {
      console.warn("⚠️ Could not validate against Supabase:", error);
    }

    // 4. Update localStorage with cleaned data
    console.log("4️⃣ Updating localStorage with cleaned data...");
    const cleanedProfiles = [...validProfiles, ...fixedProfiles];

    if (cleanedProfiles.length !== localProfiles.length) {
      localStorage.setItem("vouch_profiles", JSON.stringify(cleanedProfiles));
      console.log(
        `✅ Updated localStorage: ${localProfiles.length} → ${cleanedProfiles.length} profiles`,
      );
    }

    // 5. Generate report
    const report = `
Profile Cleanup Report:
- Original profiles: ${localProfiles.length}
- Valid profiles: ${validProfiles.length}
- Fixed profiles: ${fixedProfiles.length}
- Invalid profiles: ${invalidProfiles.length}
- Final count: ${cleanedProfiles.length}
${
  supabaseValidation
    ? `
- Exists in Supabase: ${supabaseValidation.existsInSupabase.length}
- Ghost profiles: ${supabaseValidation.onlyInLocalStorage.length}
- Missing from local: ${supabaseValidation.missingFromLocal.length}
`
    : ""
}
    `.trim();

    console.log("📊 Cleanup Report:");
    console.log(report);
    console.groupEnd();

    return {
      success: true,
      report,
      details: {
        original: localProfiles.length,
        valid: validProfiles.length,
        fixed: fixedProfiles.length,
        invalid: invalidProfiles.length,
        final: cleanedProfiles.length,
        supabaseValidation,
      },
    };
  } catch (error) {
    console.error("❌ Profile cleanup failed:", error);
    console.groupEnd();

    return {
      success: false,
      report: `Cleanup failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      details: { error },
    };
  }
}

// Quick fix for common profile issues
export async function quickProfileFix(): Promise<void> {
  console.log("🔧 Running quick profile fix...");

  try {
    // Remove any profiles with missing required fields
    const stored = localStorage.getItem("vouch_profiles");
    if (stored) {
      const profiles = JSON.parse(stored);
      const fixedProfiles = profiles.filter((profile: any) => {
        return profile && profile.id && profile.name && profile.title;
      });

      if (fixedProfiles.length !== profiles.length) {
        localStorage.setItem("vouch_profiles", JSON.stringify(fixedProfiles));
        console.log(
          `✅ Quick fix complete: ${profiles.length} → ${fixedProfiles.length} profiles`,
        );
      } else {
        console.log("✅ No issues found");
      }
    }
  } catch (error) {
    console.error("❌ Quick fix failed:", error);
  }
}

// Emergency profile reset
export async function emergencyProfileReset(): Promise<void> {
  if (
    confirm("⚠️ This will reset all profiles to sample data. Are you sure?")
  ) {
    console.log("🚨 Performing emergency profile reset...");

    try {
      const { sampleProfiles } = await import("../lib/data");
      localStorage.setItem("vouch_profiles", JSON.stringify(sampleProfiles));
      console.log("✅ Profiles reset to sample data");

      // Reload the page
      window.location.reload();
    } catch (error) {
      console.error("❌ Emergency reset failed:", error);
    }
  }
}

// Expose utilities to window
if (typeof window !== "undefined") {
  (window as any).performProfileCleanup = performProfileCleanup;
  (window as any).quickProfileFix = quickProfileFix;
  (window as any).emergencyProfileReset = emergencyProfileReset;

  console.log("🧹 Profile cleanup tools available:");
  console.log("  - performProfileCleanup() - Full cleanup and validation");
  console.log("  - quickProfileFix() - Quick fix for common issues");
  console.log("  - emergencyProfileReset() - Reset to sample data");
}

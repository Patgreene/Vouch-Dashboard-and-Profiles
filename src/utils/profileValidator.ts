import { Profile, Transcript, KeyTakeaways } from "../lib/data";

/**
 * Profile Validation and Error Handling Utility
 * Prevents crashes from missing or malformed profiles
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  fixedProfile?: Profile;
}

// Validate individual profile structure
export function validateProfile(profile: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if profile exists
  if (!profile) {
    return {
      isValid: false,
      errors: ["Profile is null or undefined"],
      warnings: [],
    };
  }

  // Required fields validation
  if (!profile.id || typeof profile.id !== "string") {
    errors.push("Profile ID is missing or invalid");
  }

  if (!profile.name || typeof profile.name !== "string") {
    errors.push("Profile name is missing or invalid");
  }

  if (!profile.title || typeof profile.title !== "string") {
    errors.push("Profile title is missing or invalid");
  }

  // Optional fields type checking
  if (profile.company && typeof profile.company !== "string") {
    warnings.push("Company field is not a string");
  }

  if (profile.photo && typeof profile.photo !== "string") {
    warnings.push("Photo field is not a string");
  }

  // Validate keyTakeaways structure
  if (!profile.keyTakeaways || typeof profile.keyTakeaways !== "object") {
    errors.push("KeyTakeaways is missing or invalid");
  } else {
    const kt = profile.keyTakeaways;
    const requiredArrays = [
      "strengths",
      "weaknesses",
      "communicationStyle",
      "waysToBringOutBest",
    ];

    requiredArrays.forEach((field) => {
      if (!Array.isArray(kt[field])) {
        errors.push(`KeyTakeaways.${field} is not an array`);
      }
    });
  }

  // Validate transcripts
  if (!Array.isArray(profile.transcripts)) {
    errors.push("Transcripts is not an array");
  } else {
    profile.transcripts.forEach((transcript: any, index: number) => {
      if (!transcript.id) {
        warnings.push(`Transcript ${index + 1} missing ID`);
      }
      if (!transcript.speakerName) {
        warnings.push(`Transcript ${index + 1} missing speaker name`);
      }
      if (!transcript.speakerRole) {
        warnings.push(`Transcript ${index + 1} missing speaker role`);
      }
      if (!transcript.content) {
        warnings.push(`Transcript ${index + 1} missing content`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Fix a malformed profile with safe defaults
export function fixMalformedProfile(profile: any): Profile {
  const defaultKeyTakeaways: KeyTakeaways = {
    strengths: [],
    weaknesses: [],
    communicationStyle: [],
    waysToBringOutBest: [],
    customTitle1: undefined,
    customTitle2: undefined,
  };

  const defaultTranscript: Transcript = {
    id: `transcript-${Date.now()}`,
    speakerName: "Unknown Speaker",
    speakerRole: "Unknown Role",
    content: "Content not available",
    speakerPhoto: undefined,
    interviewDate: undefined,
    interviewedBy: undefined,
  };

  const fixedProfile: Profile = {
    id: profile?.id || `fixed-profile-${Date.now()}`,
    name: profile?.name || "Unknown Profile",
    title: profile?.title || "Unknown Title",
    company: profile?.company || undefined,
    photo: profile?.photo || undefined,
    linkedIn: profile?.linkedIn || undefined,
    cv: profile?.cv || undefined,
    portfolio: profile?.portfolio || undefined,
    keyTakeaways: {
      ...defaultKeyTakeaways,
      ...(profile?.keyTakeaways || {}),
    },
    transcripts: Array.isArray(profile?.transcripts)
      ? profile.transcripts.map((t: any) => ({
          ...defaultTranscript,
          ...t,
        }))
      : [defaultTranscript],
  };

  return fixedProfile;
}

// Validate and clean a list of profiles
export function validateAndCleanProfiles(profiles: any[]): {
  validProfiles: Profile[];
  invalidProfiles: any[];
  fixedProfiles: Profile[];
  summary: string;
} {
  if (!Array.isArray(profiles)) {
    console.warn("⚠️ Profiles data is not an array, returning empty array");
    return {
      validProfiles: [],
      invalidProfiles: [],
      fixedProfiles: [],
      summary: "Input is not an array",
    };
  }

  const validProfiles: Profile[] = [];
  const invalidProfiles: any[] = [];
  const fixedProfiles: Profile[] = [];

  profiles.forEach((profile, index) => {
    try {
      const validation = validateProfile(profile);

      if (validation.isValid) {
        validProfiles.push(profile as Profile);
      } else {
        console.warn(
          `⚠️ Profile ${index + 1} (${profile?.id || "unknown"}) has issues:`,
          validation.errors,
        );

        // Try to fix the profile
        try {
          const fixedProfile = fixMalformedProfile(profile);
          fixedProfiles.push(fixedProfile);
          console.log(`✅ Fixed profile ${index + 1}:`, fixedProfile.name);
        } catch (fixError) {
          console.error(`❌ Could not fix profile ${index + 1}:`, fixError);
          invalidProfiles.push(profile);
        }
      }
    } catch (error) {
      console.error(`❌ Error validating profile ${index + 1}:`, error);
      invalidProfiles.push(profile);
    }
  });

  const summary = `Validated ${profiles.length} profiles: ${validProfiles.length} valid, ${fixedProfiles.length} fixed, ${invalidProfiles.length} invalid`;

  console.log(`📊 Profile Validation Summary: ${summary}`);

  return {
    validProfiles,
    invalidProfiles,
    fixedProfiles,
    summary,
  };
}

// Safe array access utility
export function safeArrayAccess<T>(array: T[], index: number): T | undefined {
  if (!Array.isArray(array) || array.length === 0 || index < 0) {
    return undefined;
  }
  return index < array.length ? array[index] : undefined;
}

// Safe string split utility
export function safeSplit(
  str: string | undefined,
  separator: string,
  index: number,
): string {
  if (!str || typeof str !== "string") {
    return "";
  }
  const parts = str.split(separator);
  return safeArrayAccess(parts, index) || str;
}

// Check if profiles exist in Supabase vs localStorage
export async function validateProfilesAgainstSupabase(
  localProfiles: Profile[],
): Promise<{
  existsInSupabase: Profile[];
  onlyInLocalStorage: Profile[];
  missingFromLocal: Profile[];
}> {
  console.log("🔍 Validating profiles against Supabase...");

  const existsInSupabase: Profile[] = [];
  const onlyInLocalStorage: Profile[] = [];
  const missingFromLocal: Profile[] = [];

  try {
    // Get all profiles from Supabase
    const { getAllProfilesFromSupabase } = await import("../lib/supabaseData");
    const supabaseProfiles = await getAllProfilesFromSupabase();

    const supabaseIds = new Set(supabaseProfiles.map((p) => p.id));
    const localIds = new Set(localProfiles.map((p) => p.id));

    // Check which local profiles exist in Supabase
    localProfiles.forEach((profile) => {
      if (supabaseIds.has(profile.id)) {
        existsInSupabase.push(profile);
      } else {
        onlyInLocalStorage.push(profile);
      }
    });

    // Check which Supabase profiles are missing from local
    supabaseProfiles.forEach((profile) => {
      if (!localIds.has(profile.id)) {
        missingFromLocal.push(profile);
      }
    });

    console.log("📊 Profile sync status:");
    console.log(`  - Exists in both: ${existsInSupabase.length}`);
    console.log(`  - Only in localStorage: ${onlyInLocalStorage.length}`);
    console.log(`  - Missing from local: ${missingFromLocal.length}`);

    if (onlyInLocalStorage.length > 0) {
      console.log(
        "👻 localStorage ghost profiles:",
        onlyInLocalStorage.map((p) => `${p.name} (${p.id})`),
      );
    }
  } catch (error) {
    console.warn("⚠️ Could not validate against Supabase:", error);
  }

  return {
    existsInSupabase,
    onlyInLocalStorage,
    missingFromLocal,
  };
}

// Clean up localStorage ghost profiles
export function cleanupGhostProfiles(ghostProfiles: Profile[]): void {
  if (ghostProfiles.length === 0) {
    console.log("✅ No ghost profiles to clean up");
    return;
  }

  console.log(`🧹 Cleaning up ${ghostProfiles.length} ghost profiles...`);

  const stored = localStorage.getItem("vouch_profiles");
  if (stored) {
    try {
      const profiles = JSON.parse(stored);
      const ghostIds = new Set(ghostProfiles.map((p) => p.id));
      const cleanedProfiles = profiles.filter(
        (p: Profile) => !ghostIds.has(p.id),
      );

      localStorage.setItem("vouch_profiles", JSON.stringify(cleanedProfiles));
      console.log(`✅ Removed ${ghostProfiles.length} ghost profiles`);
    } catch (error) {
      console.error("❌ Error cleaning ghost profiles:", error);
    }
  }
}

// Expose utilities to window for console access
if (typeof window !== "undefined") {
  (window as any).validateProfiles = validateAndCleanProfiles;
  (window as any).validateAgainstSupabase = validateProfilesAgainstSupabase;
  (window as any).cleanupGhostProfiles = cleanupGhostProfiles;

  console.log("🔧 Profile validation tools available:");
  console.log("  - validateProfiles(profiles) - Validate profile array");
  console.log("  - validateAgainstSupabase(profiles) - Check against Supabase");
  console.log("  - cleanupGhostProfiles(ghosts) - Remove ghost profiles");
}

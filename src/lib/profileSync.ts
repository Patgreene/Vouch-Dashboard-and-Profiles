import { getAllProfiles, getUserProfiles } from "./data";

export interface ProfileBackup {
  version: string;
  timestamp: number;
  profiles: any[];
  analytics: any[];
}

// Export all profiles and analytics data
export function exportProfiles(): string {
  const profiles = getUserProfiles();
  const analytics = JSON.parse(localStorage.getItem("vouch_analytics") || "[]");

  const backup: ProfileBackup = {
    version: "1.0",
    timestamp: Date.now(),
    profiles,
    analytics,
  };

  return JSON.stringify(backup, null, 2);
}

// Import profiles from backup data
export function importProfiles(backupData: string): {
  success: boolean;
  message: string;
} {
  try {
    const backup: ProfileBackup = JSON.parse(backupData);

    if (!backup.profiles || !Array.isArray(backup.profiles)) {
      return { success: false, message: "Invalid backup format" };
    }

    // Get existing profiles to avoid duplicates
    const existingProfiles = getUserProfiles();
    const existingIds = new Set(existingProfiles.map((p) => p.id));

    // Filter out duplicates
    const newProfiles = backup.profiles.filter((p) => !existingIds.has(p.id));

    if (newProfiles.length === 0) {
      return {
        success: false,
        message: "No new profiles to import (all profiles already exist)",
      };
    }

    // Merge with existing profiles
    const mergedProfiles = [...existingProfiles, ...newProfiles];
    localStorage.setItem("vouch_profiles", JSON.stringify(mergedProfiles));

    // Import analytics if available
    if (backup.analytics && Array.isArray(backup.analytics)) {
      const existingAnalytics = JSON.parse(
        localStorage.getItem("vouch_analytics") || "[]",
      );
      const mergedAnalytics = [...existingAnalytics, ...backup.analytics];
      localStorage.setItem("vouch_analytics", JSON.stringify(mergedAnalytics));
    }

    return {
      success: true,
      message: `Successfully imported ${newProfiles.length} profile(s)`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Import failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

// Download profiles as a file
export function downloadProfileBackup(): void {
  const data = exportProfiles();
  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `vouch-profiles-backup-${timestamp}.json`;

  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

// Create a shareable URL with profile data (for small profiles)
export function createShareableUrl(profileId: string): string | null {
  const profiles = getAllProfiles();
  const profile = profiles.find((p) => p.id === profileId);

  if (!profile) return null;

  try {
    const profileData = JSON.stringify(profile);
    const encoded = btoa(profileData);

    // Check if URL would be too long (browsers have ~2000 char limit)
    const baseUrl = `${window.location.origin}/profile/import`;
    const fullUrl = `${baseUrl}?data=${encoded}`;

    if (fullUrl.length > 1900) {
      return null; // Too long for URL
    }

    return fullUrl;
  } catch (error) {
    return null;
  }
}

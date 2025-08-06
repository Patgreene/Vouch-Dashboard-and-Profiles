import { Profile } from "./data";
import {
  getAllProfilesFromSupabase,
  getProfileFromSupabase,
  saveProfileToSupabase,
  deleteProfileFromSupabase,
  trackEventInSupabase,
  getAnalyticsFromSupabase,
} from "./supabaseData";

// Check if Supabase is configured
function isSupabaseConfigured(): boolean {
  return !!(
    import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
  );
}

// Fallback to localStorage functions
import {
  getAllProfiles as getLocalProfiles,
  getProfileById as getLocalProfileById,
  addProfile as addLocalProfile,
  updateProfile as updateLocalProfile,
  removeProfile as removeLocalProfile,
  canEditProfile as canEditLocalProfile,
} from "./data";

// Unified data provider that uses Supabase when available, localStorage as fallback
export class DataProvider {
  private useSupabase: boolean;

  constructor() {
    this.useSupabase = isSupabaseConfigured();
  }

  async getAllProfiles(): Promise<Profile[]> {
    if (this.useSupabase) {
      return await getAllProfilesFromSupabase();
    }
    return getLocalProfiles();
  }

  async getProfileById(id: string): Promise<Profile | null> {
    if (this.useSupabase) {
      return await getProfileFromSupabase(id);
    }
    return getLocalProfileById(id) || null;
  }

  async getGivenTranscripts(speakerEmail: string) {
    if (this.useSupabase) {
      // Optimized: Query transcripts directly by speaker email
      return await this.getGivenTranscriptsFromSupabase(speakerEmail);
    } else {
      // Fallback for localStorage
      const allProfiles = await this.getAllProfiles();
      const givenTranscripts: Array<{
        transcript: any;
        recipientProfile: Profile;
      }> = [];

      allProfiles.forEach((profile) => {
        profile.transcripts.forEach((transcript) => {
          if (transcript.speakerEmail === speakerEmail) {
            givenTranscripts.push({
              transcript,
              recipientProfile: profile,
            });
          }
        });
      });

      return givenTranscripts;
    }
  }

  private async getGivenTranscriptsFromSupabase(speakerEmail: string) {
    try {
      const { getGivenTranscriptsFromSupabase } = await import("./supabaseData");
      return await getGivenTranscriptsFromSupabase(speakerEmail);
    } catch (error) {
      console.error("Error loading given transcripts from Supabase:", error);
      return [];
    }
  }

  async saveProfile(profile: Profile): Promise<boolean> {
    if (this.useSupabase) {
      return await saveProfileToSupabase(profile);
    }

    // For localStorage, determine if it's create or update
    const existingProfile = getLocalProfileById(profile.id);
    if (existingProfile) {
      return updateLocalProfile(profile);
    } else {
      return addLocalProfile(profile);
    }
  }

  async deleteProfile(id: string): Promise<boolean> {
    if (this.useSupabase) {
      return await deleteProfileFromSupabase(id);
    }
    return removeLocalProfile(id);
  }

  canEditProfile(id: string): boolean {
    if (this.useSupabase) {
      // For Supabase, we allow editing all profiles (no sample vs user distinction)
      return true;
    }
    return canEditLocalProfile(id);
  }

  async trackEvent(
    profileId: string,
    eventType: "page_view" | "quote_view" | "profile_created",
    metadata?: Record<string, any>,
  ): Promise<void> {
    // Import visitor tracking for unique visitor counting and cooldown
    const { getVisitorId, recordVisit } = await import("./visitorTracking");

    if (this.useSupabase) {
      const visitorId = getVisitorId();

      // For page views, check cooldown and record visit
      if (eventType === "page_view") {
        const shouldCount = recordVisit(profileId);
        if (!shouldCount) {
          return; // Skip tracking due to cooldown
        }
      }

      await trackEventInSupabase(profileId, eventType, metadata, visitorId);
    } else {
      // Fallback to existing analytics system with visitor tracking
      const visitorId = getVisitorId();

      if (eventType === "page_view") {
        const shouldCount = recordVisit(profileId);
        if (!shouldCount) {
          return; // Skip tracking due to cooldown
        }
      }

      const { analytics } = await import("./analytics");
      if (eventType === "page_view") {
        analytics.trackPageView(profileId);
      } else if (eventType === "quote_view") {
        analytics.trackQuoteView(
          profileId,
          metadata?.transcriptId || "",
          metadata?.highlightId || "",
        );
      } else if (eventType === "profile_created") {
        analytics.trackProfileCreated(profileId);
      }
    }
  }

  async getAnalytics() {
    if (this.useSupabase) {
      return await getAnalyticsFromSupabase();
    } else {
      const { analytics } = await import("./analytics");
      return analytics.getAnalyticsSummary();
    }
  }

  getStorageType(): "supabase" | "localStorage" {
    return this.useSupabase ? "supabase" : "localStorage";
  }
}

// Create singleton instance
export const dataProvider = new DataProvider();

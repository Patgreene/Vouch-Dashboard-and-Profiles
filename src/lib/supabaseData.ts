import {
  supabase,
  DatabaseProfile,
  DatabaseTranscript,
  DatabaseAnalytics,
} from "./supabase";
import { Profile, Transcript, KeyTakeaways } from "./data";

// Test Supabase connection and table access
export async function testSupabaseConnection(): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> {
  try {
    console.log("Testing Supabase connection...");

    // Test basic connection
    const { data, error } = await supabase
      .from("profiles")
      .select("count")
      .limit(1);

    if (error) {
      console.error("Supabase connection test failed:", error);
      return {
        success: false,
        message: `Connection failed: ${error.message}`,
        details: {
          code: error.code,
          details: error.details,
          hint: error.hint,
        },
      };
    }

    console.log("Supabase connection test successful");
    return {
      success: true,
      message: "Supabase connection is working",
      details: data,
    };
  } catch (error) {
    console.error("Supabase connection test error:", error);
    return {
      success: false,
      message: `Test failed: ${error instanceof Error ? error.message : String(error)}`,
      details: error,
    };
  }
}

// Transform database profile to app profile format
function transformDatabaseProfile(
  dbProfile: DatabaseProfile,
  transcripts: DatabaseTranscript[],
): Profile {
  // Safely handle key_takeaways with fallback structure
  const defaultKeyTakeaways = {
    strengths: [],
    weaknesses: [],
    communicationStyle: [],
    waysToBringOutBest: [],
    customTitle1: undefined,
    customTitle2: undefined,
  };

  let keyTakeaways = defaultKeyTakeaways;

  try {
    if (dbProfile.key_takeaways) {
      keyTakeaways = {
        ...defaultKeyTakeaways,
        ...dbProfile.key_takeaways,
      };
    }
  } catch (error) {
    console.warn("⚠️ Invalid key_takeaways structure, using defaults:", error);
    keyTakeaways = defaultKeyTakeaways;
  }

  return {
    id: dbProfile.id,
    name: dbProfile.name,
    title: dbProfile.title,
    company: dbProfile.company || undefined,
    photo: dbProfile.photo || undefined,
    linkedIn: dbProfile.linkedin || undefined,
    cv: dbProfile.cv || undefined,
    portfolio: dbProfile.portfolio || undefined,
    keyTakeaways,
    transcripts: transcripts.map(transformDatabaseTranscript),
  };
}

// Transform database transcript to app transcript format
function transformDatabaseTranscript(
  dbTranscript: DatabaseTranscript,
): Transcript {
  return {
    id: dbTranscript.id,
    speakerName: dbTranscript.speaker_name,
    speakerRole: dbTranscript.speaker_role,
    speakerPhoto: dbTranscript.speaker_photo || undefined,
    interviewDate: dbTranscript.interview_date || undefined,
    interviewedBy: dbTranscript.interviewed_by || undefined,
    content: dbTranscript.content,
  };
}

// Transform app profile to database profile format
function transformToDatabase(profile: Profile): {
  profile: Omit<DatabaseProfile, "created_at" | "updated_at">;
  transcripts: Omit<DatabaseTranscript, "created_at" | "updated_at">[];
} {
  return {
    profile: {
      id: profile.id,
      name: profile.name,
      title: profile.title,
      company: profile.company,
      photo: profile.photo,
      linkedin: profile.linkedIn,
      cv: profile.cv,
      portfolio: profile.portfolio,
      key_takeaways: profile.keyTakeaways,
    },
    transcripts: profile.transcripts.map((t) => ({
      id: t.id,
      profile_id: profile.id,
      speaker_name: t.speakerName,
      speaker_role: t.speakerRole,
      speaker_photo: t.speakerPhoto,
      interview_date: t.interviewDate,
      interviewed_by: t.interviewedBy,
      content: t.content,
    })),
  };
}

// Get all profiles from Supabase
export async function getAllProfilesFromSupabase(): Promise<Profile[]> {
  try {
    // First test basic connection
    console.log("🔍 Testing Supabase connection for profiles...");

    let profiles, profilesError;

    // Try full query first
    const fullQuery = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    profiles = fullQuery.data;
    profilesError = fullQuery.error;

    // If 500 error, try simplified queries to isolate the issue
    if (
      profilesError &&
      (profilesError.code === "500" || profilesError.message?.includes("500"))
    ) {
      console.error(
        "❌ Full profiles query failed with 500 error, trying simplified queries...",
      );

      // Try basic table access
      const basicQuery = await supabase
        .from("profiles")
        .select("id, name, title")
        .limit(1);

      if (basicQuery.error) {
        console.error("❌ Even basic profiles query failed:", basicQuery.error);
        throw new Error(
          `Database table 'profiles' is not accessible: ${basicQuery.error.message}`,
        );
      }

      // Try without ordering
      const noOrderQuery = await supabase.from("profiles").select("*");

      if (noOrderQuery.error) {
        console.error("❌ Query without ordering failed:", noOrderQuery.error);
        throw new Error(`Database query failed: ${noOrderQuery.error.message}`);
      }

      console.log("✅ Simplified query worked, using that instead");
      profiles = noOrderQuery.data;
      profilesError = null;
    }

    if (profilesError) {
      console.error("❌ Profiles query failed:");
      console.error("Status:", profilesError.code);
      console.error("Message:", profilesError.message);
      throw profilesError;
    }

    console.log(
      `✅ Profiles fetched successfully: ${profiles?.length || 0} profiles`,
    );

    const { data: transcripts, error: transcriptsError } = await supabase
      .from("transcripts")
      .select("*")
      .order("created_at", { ascending: true });

    if (transcriptsError) throw transcriptsError;

    // Group transcripts by profile_id
    const transcriptsByProfile = transcripts.reduce(
      (acc, transcript) => {
        if (!acc[transcript.profile_id]) {
          acc[transcript.profile_id] = [];
        }
        acc[transcript.profile_id].push(transcript);
        return acc;
      },
      {} as Record<string, DatabaseTranscript[]>,
    );

    // Transform to app format
    return profiles.map((profile) =>
      transformDatabaseProfile(profile, transcriptsByProfile[profile.id] || []),
    );
  } catch (error) {
    console.error("Error fetching profiles from Supabase:");
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      code:
        error && typeof error === "object" && "code" in error
          ? error.code
          : "Unknown",
      details:
        error && typeof error === "object" && "details" in error
          ? error.details
          : null,
      hint:
        error && typeof error === "object" && "hint" in error
          ? error.hint
          : null,
      fullError: error,
    });
    return [];
  }
}

// Get single profile from Supabase
export async function getProfileFromSupabase(
  id: string,
): Promise<Profile | null> {
  try {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (profileError) {
      if (profileError.code === "PGRST116") {
        return null; // Profile not found
      }
      throw profileError;
    }

    const { data: transcripts, error: transcriptsError } = await supabase
      .from("transcripts")
      .select("*")
      .eq("profile_id", id)
      .order("created_at", { ascending: true });

    if (transcriptsError) throw transcriptsError;

    return transformDatabaseProfile(profile, transcripts || []);
  } catch (error) {
    console.error("Error fetching profile from Supabase:");
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      code:
        error && typeof error === "object" && "code" in error
          ? error.code
          : "Unknown",
      details:
        error && typeof error === "object" && "details" in error
          ? error.details
          : null,
      hint:
        error && typeof error === "object" && "hint" in error
          ? error.hint
          : null,
      fullError: error,
    });
    return null;
  }
}

// Save profile to Supabase
export async function saveProfileToSupabase(
  profile: Profile,
): Promise<boolean> {
  try {
    const { profile: dbProfile, transcripts: dbTranscripts } =
      transformToDatabase(profile);

    // Start a transaction by saving profile first
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert(dbProfile);

    if (profileError) throw profileError;

    // Delete existing transcripts for this profile
    const { error: deleteError } = await supabase
      .from("transcripts")
      .delete()
      .eq("profile_id", profile.id);

    if (deleteError) throw deleteError;

    // Insert new transcripts
    if (dbTranscripts.length > 0) {
      const { error: transcriptsError } = await supabase
        .from("transcripts")
        .insert(dbTranscripts);

      if (transcriptsError) throw transcriptsError;
    }

    console.log("Profile saved to Supabase successfully:", profile.id);
    return true;
  } catch (error) {
    console.error("Error saving profile to Supabase:");
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      code:
        error && typeof error === "object" && "code" in error
          ? error.code
          : "Unknown",
      details:
        error && typeof error === "object" && "details" in error
          ? error.details
          : null,
      hint:
        error && typeof error === "object" && "hint" in error
          ? error.hint
          : null,
      fullError: error,
    });
    return false;
  }
}

// Delete profile from Supabase
export async function deleteProfileFromSupabase(id: string): Promise<boolean> {
  try {
    // Transcripts will be deleted automatically due to CASCADE
    const { error } = await supabase.from("profiles").delete().eq("id", id);

    if (error) throw error;

    console.log("Profile deleted from Supabase successfully:", id);
    return true;
  } catch (error) {
    console.error("Error deleting profile from Supabase:");
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      code:
        error && typeof error === "object" && "code" in error
          ? error.code
          : "Unknown",
      details:
        error && typeof error === "object" && "details" in error
          ? error.details
          : null,
      hint:
        error && typeof error === "object" && "hint" in error
          ? error.hint
          : null,
      fullError: error,
    });
    return false;
  }
}

// Analytics functions
export async function trackEventInSupabase(
  profileId: string,
  eventType: "page_view" | "quote_view" | "profile_created",
  metadata?: Record<string, any>,
  visitorId?: string,
): Promise<void> {
  try {
    const eventData = {
      profile_id: profileId,
      event_type: eventType,
      metadata: {
        ...metadata,
        visitor_id: visitorId || undefined,
      },
    };

    const { error } = await supabase.from("analytics").insert(eventData);

    if (error) throw error;
  } catch (error) {
    console.error("Error tracking event in Supabase:");
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      code:
        error && typeof error === "object" && "code" in error
          ? error.code
          : "Unknown",
      details:
        error && typeof error === "object" && "details" in error
          ? error.details
          : null,
      hint:
        error && typeof error === "object" && "hint" in error
          ? error.hint
          : null,
      fullError: error,
    });
  }
}

export async function getAnalyticsFromSupabase() {
  try {
    const { data, error } = await supabase
      .from("analytics")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Transform to match existing analytics format with unique visitor tracking
    const totalPageViews = data.filter(
      (e) => e.event_type === "page_view",
    ).length;
    const totalQuoteViews = data.filter(
      (e) => e.event_type === "quote_view",
    ).length;

    const profileStats = data.reduce(
      (acc, event) => {
        if (!acc[event.profile_id]) {
          acc[event.profile_id] = {
            pageViews: 0,
            quoteViews: 0,
            uniqueVisitors: new Set(),
          };
        }

        if (event.event_type === "page_view") {
          acc[event.profile_id].pageViews++;

          // Track unique visitors for page views
          const visitorId = event.metadata?.visitor_id;
          if (visitorId) {
            acc[event.profile_id].uniqueVisitors.add(visitorId);
          }
        } else if (event.event_type === "quote_view") {
          acc[event.profile_id].quoteViews++;
        }

        return acc;
      },
      {} as Record<
        string,
        {
          pageViews: number;
          quoteViews: number;
          uniqueVisitors: Set<string>;
        }
      >,
    );

    return {
      totalPageViews,
      totalQuoteViews,
      profileStats: Object.entries(profileStats).map(([profileId, stats]) => ({
        profileId,
        pageViews: stats.pageViews,
        quoteViews: stats.quoteViews,
        uniqueVisitors: stats.uniqueVisitors.size, // Convert Set to count
      })),
    };
  } catch (error) {
    console.error("Error fetching analytics from Supabase:");
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      code:
        error && typeof error === "object" && "code" in error
          ? error.code
          : "Unknown",
      details:
        error && typeof error === "object" && "details" in error
          ? error.details
          : null,
      hint:
        error && typeof error === "object" && "hint" in error
          ? error.hint
          : null,
      fullError: error,
    });
    return {
      totalPageViews: 0,
      totalQuoteViews: 0,
      profileStats: [],
    };
  }
}

// Migration function to move localStorage data to Supabase
export async function migrateLocalStorageToSupabase(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const stored = localStorage.getItem("vouch_profiles");
    if (!stored) {
      return {
        success: false,
        message: "No localStorage data found to migrate",
      };
    }

    const localProfiles = JSON.parse(stored) as Profile[];
    let successCount = 0;

    for (const profile of localProfiles) {
      const success = await saveProfileToSupabase(profile);
      if (success) successCount++;
    }

    // Migrate analytics data
    const analyticsStored = localStorage.getItem("vouch_analytics");
    if (analyticsStored) {
      const analyticsEvents = JSON.parse(analyticsStored);
      for (const event of analyticsEvents) {
        await trackEventInSupabase(event.profileId, event.type, event.metadata);
      }
    }

    return {
      success: true,
      message: `Successfully migrated ${successCount}/${localProfiles.length} profiles to Supabase`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Migration failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

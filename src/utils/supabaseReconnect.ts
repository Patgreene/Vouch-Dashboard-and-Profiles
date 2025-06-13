import { supabase } from "../lib/supabase";
import { dataProvider } from "../lib/dataProvider";

/**
 * Supabase Reconnection Utility
 * Use this after storage/plan upgrades to refresh the connection
 */

export async function reconnectSupabase(): Promise<{
  success: boolean;
  profileCount: number;
  message: string;
}> {
  console.group("🔄 Reconnecting to Supabase");

  try {
    // 1. Test basic connection
    console.log("1️⃣ Testing upgraded Supabase connection...");
    const { data: connectionTest, error: connectionError } = await supabase
      .from("profiles")
      .select("count")
      .limit(1);

    if (connectionError) {
      console.error("❌ Connection still failing:", connectionError);
      return {
        success: false,
        profileCount: 0,
        message: `Connection failed: ${connectionError.message}`,
      };
    }

    console.log("✅ Basic connection working!");

    // 2. Test profile fetching
    console.log("2️⃣ Fetching your user profiles...");
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, name, title, created_at")
      .order("created_at", { ascending: false });

    if (profilesError) {
      console.error("❌ Profile fetching failed:", profilesError);
      return {
        success: false,
        profileCount: 0,
        message: `Profile fetch failed: ${profilesError.message}`,
      };
    }

    const profileCount = profiles?.length || 0;
    console.log(`✅ Successfully loaded ${profileCount} user profiles!`);

    if (profileCount > 0) {
      console.log("📋 Your profiles:");
      profiles.forEach((profile, index) => {
        console.log(
          `${index + 1}. ${profile.name} (${profile.title}) - ${profile.id}`,
        );
      });
    }

    // 3. Test analytics
    console.log("3️⃣ Testing analytics...");
    const { data: analytics, error: analyticsError } = await supabase
      .from("analytics")
      .select("count")
      .limit(1);

    if (analyticsError) {
      console.warn("⚠️ Analytics table issue:", analyticsError);
    } else {
      console.log("✅ Analytics table accessible");
    }

    // 4. Test transcripts
    console.log("4️⃣ Testing transcripts...");
    const { data: transcripts, error: transcriptsError } = await supabase
      .from("transcripts")
      .select("count")
      .limit(1);

    if (transcriptsError) {
      console.warn("⚠️ Transcripts table issue:", transcriptsError);
    } else {
      console.log("✅ Transcripts table accessible");
    }

    console.groupEnd();

    return {
      success: true,
      profileCount,
      message: `Successfully reconnected! Found ${profileCount} user profiles.`,
    };
  } catch (error) {
    console.error("❌ Reconnection failed:", error);
    console.groupEnd();

    return {
      success: false,
      profileCount: 0,
      message: `Reconnection failed: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

// Force refresh the admin dashboard data
export async function forceRefreshAdminData(): Promise<void> {
  console.log("🔄 Force refreshing admin dashboard data...");

  try {
    // Clear any cached states
    if (typeof window !== "undefined") {
      // Clear any error states in localStorage
      const errorKeys = Object.keys(localStorage).filter((key) =>
        key.includes("error"),
      );
      errorKeys.forEach((key) => localStorage.removeItem(key));
    }

    // Force reload profiles through data provider
    console.log("📥 Reloading profiles...");
    const profiles = await dataProvider.getAllProfiles();
    console.log(`✅ Loaded ${profiles.length} profiles`);

    // Force reload analytics
    console.log("📊 Reloading analytics...");
    const analytics = await dataProvider.getAnalytics();
    console.log("✅ Analytics loaded:", analytics);

    // Reload the page to refresh the dashboard
    console.log("🔄 Reloading page to refresh dashboard...");
    window.location.reload();
  } catch (error) {
    console.error("❌ Force refresh failed:", error);
    throw error;
  }
}

// Quick storage space check
export async function checkSupabaseStorage(): Promise<void> {
  console.group("💾 Supabase Storage Check");

  try {
    // Get a rough estimate of data size by counting records
    const profileCount = await supabase
      .from("profiles")
      .select("count", { count: "exact" });

    const transcriptCount = await supabase
      .from("transcripts")
      .select("count", { count: "exact" });

    const analyticsCount = await supabase
      .from("analytics")
      .select("count", { count: "exact" });

    console.log("📊 Database Statistics:");
    console.log(`  Profiles: ${profileCount.count || 0}`);
    console.log(`  Transcripts: ${transcriptCount.count || 0}`);
    console.log(`  Analytics Events: ${analyticsCount.count || 0}`);

    // Test a large query to see if storage works
    const largeQuery = await supabase.from("profiles").select("*").limit(100);

    if (largeQuery.error) {
      console.error("❌ Large query failed:", largeQuery.error);
    } else {
      console.log("✅ Large queries working - storage upgrade successful!");
    }
  } catch (error) {
    console.error("❌ Storage check failed:", error);
  }

  console.groupEnd();
}

// Expose to window for console access
if (typeof window !== "undefined") {
  (window as any).reconnectSupabase = reconnectSupabase;
  (window as any).forceRefreshAdmin = forceRefreshAdminData;
  (window as any).checkStorage = checkSupabaseStorage;

  console.log("🔄 Supabase reconnection tools available:");
  console.log("  - reconnectSupabase() - Test connection after upgrade");
  console.log("  - forceRefreshAdmin() - Force refresh admin dashboard");
  console.log("  - checkStorage() - Check current storage usage");
}

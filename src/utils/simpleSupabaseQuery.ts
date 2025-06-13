import { supabase } from "../lib/supabase";

/**
 * Simplified Supabase queries to debug data retrieval issues
 * These bypass all the complex error handling to get raw data
 */

export async function getSimpleProfileList() {
  console.group("🔍 Simple Supabase Profile Query");

  try {
    console.log("Executing simple profiles query...");

    // Most basic query possible
    const { data, error, count } = await supabase
      .from("profiles")
      .select("*", { count: "exact" });

    console.log("Query completed:");
    console.log("Error:", error);
    console.log("Data count:", data?.length);
    console.log("Total count:", count);

    if (error) {
      console.error("❌ Query failed:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      console.error("Error details:", error.details);
      console.error("Error hint:", error.hint);
      return { success: false, error, data: [], count: 0 };
    }

    if (!data) {
      console.warn("⚠️ Query succeeded but no data returned");
      return { success: true, data: [], count: 0 };
    }

    console.log("✅ Query successful!");
    console.log("📋 Profiles found:");
    data.forEach((profile, index) => {
      console.log(`${index + 1}. ${profile.name} (${profile.title})`);
      console.log(`   ID: ${profile.id}`);
      console.log(`   Created: ${profile.created_at}`);
    });

    console.groupEnd();
    return { success: true, data, count: data.length, error: null };
  } catch (exception) {
    console.error("❌ Exception during query:", exception);
    console.groupEnd();
    return { success: false, error: exception, data: [], count: 0 };
  }
}

export async function getSimpleTranscriptList() {
  console.group("🔍 Simple Supabase Transcripts Query");

  try {
    const { data, error, count } = await supabase
      .from("transcripts")
      .select("*", { count: "exact" });

    console.log("Transcripts query result:");
    console.log("Error:", error);
    console.log("Data count:", data?.length);
    console.log("Total count:", count);

    if (error) {
      console.error("❌ Transcripts query failed:", error);
      return { success: false, error, data: [], count: 0 };
    }

    console.log("✅ Transcripts query successful!");
    console.groupEnd();
    return { success: true, data: data || [], count: count || 0, error: null };
  } catch (exception) {
    console.error("❌ Exception during transcripts query:", exception);
    console.groupEnd();
    return { success: false, error: exception, data: [], count: 0 };
  }
}

export async function diagnoseSupabaseData() {
  console.group("🔍 Complete Supabase Data Diagnosis");

  // Test connection
  console.log("Testing basic connection...");
  try {
    const { data: testData, error: testError } = await supabase
      .from("profiles")
      .select("count")
      .limit(1);

    if (testError) {
      console.error("❌ Basic connection failed:", testError);
      console.groupEnd();
      return;
    }
    console.log("✅ Basic connection working");
  } catch (err) {
    console.error("❌ Connection test exception:", err);
    console.groupEnd();
    return;
  }

  // Get profiles
  console.log("\n--- PROFILES ---");
  const profileResult = await getSimpleProfileList();

  // Get transcripts
  console.log("\n--- TRANSCRIPTS ---");
  const transcriptResult = await getSimpleTranscriptList();

  // Summary
  console.log("\n--- SUMMARY ---");
  console.log(`Profiles: ${profileResult.count} found`);
  console.log(`Transcripts: ${transcriptResult.count} found`);

  if (profileResult.success && profileResult.count > 0) {
    console.log("🎉 Your data is accessible in Supabase!");
    console.log(
      "📋 Profile IDs:",
      profileResult.data.map((p: any) => p.id),
    );
  } else {
    console.log("⚠️ No profiles found or query failed");
  }

  console.groupEnd();

  return {
    profiles: profileResult,
    transcripts: transcriptResult,
  };
}

// Quick function to force reload admin dashboard with fresh data
export async function emergencyAdminReload() {
  console.log("🚨 Emergency Admin Dashboard Reload");

  try {
    // Get fresh data
    const diagnosis = await diagnoseSupabaseData();

    if (diagnosis?.profiles.success && diagnosis.profiles.count > 0) {
      console.log(
        `✅ Found ${diagnosis.profiles.count} profiles - reloading dashboard`,
      );

      // Force clear any cached states
      sessionStorage.clear();

      // Reload the page
      window.location.href = "/admin-stats-d1g3Yt9";
    } else {
      console.error("❌ No profiles found - check Supabase data");
    }
  } catch (error) {
    console.error("❌ Emergency reload failed:", error);
  }
}

// Expose to window for console access
if (typeof window !== "undefined") {
  (window as any).getSimpleProfiles = getSimpleProfileList;
  (window as any).diagnoseSupabaseData = diagnoseSupabaseData;
  (window as any).emergencyAdminReload = emergencyAdminReload;

  console.log("🔧 Simple Supabase tools available:");
  console.log("  - getSimpleProfiles() - Raw profile query");
  console.log("  - diagnoseSupabaseData() - Complete data diagnosis");
  console.log(
    "  - emergencyAdminReload() - Force reload admin with fresh data",
  );
}

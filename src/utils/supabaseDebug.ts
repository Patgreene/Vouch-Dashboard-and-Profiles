import { testSupabaseConnection } from "../lib/supabaseData";
import { supabase } from "../lib/supabase";

/**
 * Debugging utilities for Supabase issues
 * These functions can be called from the browser console for debugging
 */

// Test Supabase connection and configuration
export async function debugSupabaseConnection() {
  console.group("🔍 Supabase Connection Debug");

  // Check environment variables
  console.log("Environment variables:");
  console.log("VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
  console.log(
    "VITE_SUPABASE_ANON_KEY present:",
    !!import.meta.env.VITE_SUPABASE_ANON_KEY,
  );

  // Test connection
  const connectionTest = await testSupabaseConnection();
  console.log("Connection test result:", connectionTest);

  // Test individual table access
  console.log("\nTesting table access...");

  try {
    // Test profiles table
    const profilesTest = await supabase.from("profiles").select("id").limit(1);
    console.log(
      "Profiles table access:",
      profilesTest.error ? "❌ Failed" : "✅ Success",
    );
    if (profilesTest.error) {
      console.error("Profiles error:", profilesTest.error);
    }

    // Test transcripts table
    const transcriptsTest = await supabase
      .from("transcripts")
      .select("id")
      .limit(1);
    console.log(
      "Transcripts table access:",
      transcriptsTest.error ? "❌ Failed" : "✅ Success",
    );
    if (transcriptsTest.error) {
      console.error("Transcripts error:", transcriptsTest.error);
    }

    // Test analytics table
    const analyticsTest = await supabase
      .from("analytics")
      .select("id")
      .limit(1);
    console.log(
      "Analytics table access:",
      analyticsTest.error ? "❌ Failed" : "✅ Success",
    );
    if (analyticsTest.error) {
      console.error("Analytics error:", analyticsTest.error);
    }
  } catch (error) {
    console.error("Table access test failed:", error);
  }

  console.groupEnd();
}

// Test fetching all profiles with detailed error reporting
export async function debugProfileFetch() {
  console.group("🔍 Profile Fetch Debug");

  try {
    console.log("Attempting to fetch profiles...");

    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*");

    if (profilesError) {
      console.error("❌ Profiles fetch failed:");
      console.error("Error code:", profilesError.code);
      console.error("Error message:", profilesError.message);
      console.error("Error details:", profilesError.details);
      console.error("Error hint:", profilesError.hint);
      console.error("Full error:", profilesError);
      return;
    }

    console.log("✅ Profiles fetched successfully!");
    console.log("Profile count:", profiles?.length || 0);
    console.log("Sample profile:", profiles?.[0]);

    // Now test transcripts
    console.log("Attempting to fetch transcripts...");

    const { data: transcripts, error: transcriptsError } = await supabase
      .from("transcripts")
      .select("*");

    if (transcriptsError) {
      console.error("❌ Transcripts fetch failed:");
      console.error("Error code:", transcriptsError.code);
      console.error("Error message:", transcriptsError.message);
      console.error("Error details:", transcriptsError.details);
      console.error("Error hint:", transcriptsError.hint);
      console.error("Full error:", transcriptsError);
      return;
    }

    console.log("✅ Transcripts fetched successfully!");
    console.log("Transcript count:", transcripts?.length || 0);
  } catch (error) {
    console.error("❌ Unexpected error during profile fetch:");
    console.error(error);
  }

  console.groupEnd();
}

// Expose debugging functions to global window for easy console access
if (typeof window !== "undefined") {
  (window as any).debugSupabase = debugSupabaseConnection;
  (window as any).debugProfiles = debugProfileFetch;

  console.log("🔧 Supabase debugging functions available:");
  console.log("  - debugSupabase() - Test connection and configuration");
  console.log("  - debugProfiles() - Test profile/transcript fetching");
}

// Functions are already exported above

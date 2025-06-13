import { supabase } from "../lib/supabase";

/**
 * Supabase Connection Fixer
 * This utility helps fix common Supabase issues that cause 500 errors
 */

export async function fixSupabaseConnection(): Promise<{
  success: boolean;
  issues: string[];
  fixes: string[];
}> {
  const issues: string[] = [];
  const fixes: string[] = [];

  console.group("🔧 Fixing Supabase Connection");

  try {
    // 1. Test basic connection
    console.log("1️⃣ Testing basic connection...");
    const { data: testData, error: testError } = await supabase
      .from("profiles")
      .select("count")
      .limit(1);

    if (testError) {
      console.error("❌ Basic connection failed:", testError);

      if (
        testError.message.includes("relation") &&
        testError.message.includes("does not exist")
      ) {
        issues.push("Database tables don't exist");
        fixes.push("Run the database schema setup in Supabase SQL Editor");

        // Provide the schema creation script
        console.log(
          "🔧 Database schema needs to be created. Run this in Supabase SQL Editor:",
        );
        console.log(`
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  company TEXT,
  photo TEXT,
  linkedin TEXT,
  cv TEXT,
  portfolio TEXT,
  key_takeaways JSONB NOT NULL DEFAULT '{"strengths":[],"weaknesses":[],"communicationStyle":[],"waysToBringOutBest":[]}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transcripts table  
CREATE TABLE IF NOT EXISTS transcripts (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  speaker_name TEXT NOT NULL,
  speaker_role TEXT NOT NULL,
  speaker_photo TEXT,
  interview_date DATE,
  interviewed_by TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('page_view', 'quote_view', 'profile_created')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Allow public access (for this demo app)
CREATE POLICY IF NOT EXISTS "Allow all operations" ON profiles FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all operations" ON transcripts FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all operations" ON analytics FOR ALL USING (true);
        `);
      }

      if (testError.message.includes("permission")) {
        issues.push("Permission denied - RLS policy issue");
        fixes.push("Check Row Level Security policies in Supabase");
      }
    } else {
      console.log("✅ Basic connection working");
    }

    // 2. Test if tables exist and are accessible
    console.log("2️⃣ Testing table access...");

    const tables = ["profiles", "transcripts", "analytics"];
    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select("*").limit(1);
        if (error) {
          console.error(`❌ Table '${table}' error:`, error);
          issues.push(`Table '${table}' not accessible: ${error.message}`);
        } else {
          console.log(`✅ Table '${table}' accessible`);
        }
      } catch (err) {
        console.error(`❌ Table '${table}' test failed:`, err);
        issues.push(`Table '${table}' test failed`);
      }
    }

    // 3. Test specific query that was failing
    console.log("3️⃣ Testing the exact failing query...");
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) {
        console.error("❌ Profiles query failed:", profilesError);
        issues.push(`Profiles query failed: ${profilesError.message}`);
        fixes.push("Check database schema and data integrity");
      } else {
        console.log("✅ Profiles query working!");
        console.log(`📊 Found ${profiles?.length || 0} profiles in database`);

        if (profiles && profiles.length > 0) {
          console.log(
            "📋 Profile IDs:",
            profiles.map((p) => p.id),
          );
          console.log("👤 Sample profile:", profiles[0]);
        }
      }
    } catch (err) {
      console.error("❌ Query test failed:", err);
      issues.push(`Query execution failed: ${err}`);
    }
  } catch (error) {
    console.error("❌ Connection fixer failed:", error);
    issues.push(`Connection fixer failed: ${error}`);
  }

  console.groupEnd();

  const success = issues.length === 0;

  if (success) {
    console.log(
      "🎉 Supabase connection is working! Your user profiles should load now.",
    );
  } else {
    console.error("❌ Issues found:");
    issues.forEach((issue) => console.error(`  - ${issue}`));
    console.log("💡 Fixes needed:");
    fixes.forEach((fix) => console.log(`  - ${fix}`));
  }

  return { success, issues, fixes };
}

// Quick function to show current profiles in Supabase
export async function showSupabaseProfiles() {
  console.group("📋 Current Supabase Profiles");

  try {
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id, name, title, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Failed to fetch profiles:", error);
      return;
    }

    if (!profiles || profiles.length === 0) {
      console.log("📭 No profiles found in Supabase database");
      console.log("💡 This means either:");
      console.log("  - No profiles have been created yet");
      console.log("  - Database connection is not working");
      console.log("  - Tables don't exist");
    } else {
      console.log(`✅ Found ${profiles.length} profiles:`);
      profiles.forEach((profile, index) => {
        console.log(
          `${index + 1}. ${profile.name} (${profile.title}) - ID: ${profile.id}`,
        );
      });
    }
  } catch (error) {
    console.error("❌ Error fetching profiles:", error);
  }

  console.groupEnd();
}

// Expose to window for console access
if (typeof window !== "undefined") {
  (window as any).fixSupabase = fixSupabaseConnection;
  (window as any).showSupabaseProfiles = showSupabaseProfiles;

  console.log("🔧 Supabase fixer tools available:");
  console.log("  - fixSupabase() - Diagnose and fix connection issues");
  console.log("  - showSupabaseProfiles() - Show current profiles in database");
}

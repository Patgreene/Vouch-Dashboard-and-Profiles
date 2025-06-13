import { supabase } from "../lib/supabase";

/**
 * Database Health Check Utility
 *
 * This utility helps diagnose Supabase database issues,
 * especially 500 errors that might be caused by schema problems.
 */

export async function checkDatabaseHealth(): Promise<{
  success: boolean;
  issues: string[];
  recommendations: string[];
}> {
  const issues: string[] = [];
  const recommendations: string[] = [];

  console.group("🏥 Database Health Check");

  try {
    // 1. Test basic connection
    console.log("1️⃣ Testing basic connection...");
    const { data: connectionTest, error: connectionError } =
      await supabase.rpc("now"); // Built-in function that should always work

    if (connectionError) {
      issues.push(`Connection failed: ${connectionError.message}`);
      recommendations.push(
        "Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY",
      );
    } else {
      console.log("✅ Basic connection working");
    }

    // 2. Test table existence
    console.log("2️⃣ Testing table existence...");

    const tables = ["profiles", "transcripts", "analytics"];
    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select("*").limit(0); // Don't fetch data, just test table access

        if (error) {
          issues.push(`Table '${table}' not accessible: ${error.message}`);
          recommendations.push(
            `Create table '${table}' using the schema.sql file`,
          );
        } else {
          console.log(`✅ Table '${table}' exists and is accessible`);
        }
      } catch (err) {
        issues.push(`Table '${table}' test failed: ${err}`);
      }
    }

    // 3. Test specific problematic queries
    console.log("3️⃣ Testing specific queries...");

    // Test the exact query that's failing
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, title")
        .limit(1);

      if (error) {
        issues.push(`Basic profiles query failed: ${error.message}`);
        if (error.code === "500") {
          recommendations.push(
            "Database server error - check Supabase dashboard for outages",
          );
          recommendations.push("Verify database schema is correctly set up");
        }
      } else {
        console.log("✅ Basic profiles query working");
      }
    } catch (err) {
      issues.push(`Profiles query exception: ${err}`);
    }

    // 4. Test JSON field access (common 500 error cause)
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("key_takeaways")
        .limit(1);

      if (error) {
        issues.push(`JSON field access failed: ${error.message}`);
        recommendations.push("Check key_takeaways field structure in database");
      } else {
        console.log("✅ JSON field access working");
      }
    } catch (err) {
      issues.push(`JSON field test exception: ${err}`);
    }

    // 5. Test ordering (sometimes causes issues)
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        issues.push(`Ordering query failed: ${error.message}`);
        recommendations.push(
          "Check if created_at column exists and has proper type",
        );
      } else {
        console.log("✅ Ordering query working");
      }
    } catch (err) {
      issues.push(`Ordering test exception: ${err}`);
    }
  } catch (error) {
    issues.push(`Health check failed: ${error}`);
    recommendations.push("Check Supabase connection and authentication");
  }

  console.groupEnd();

  const success = issues.length === 0;

  if (success) {
    console.log("🎉 Database health check passed!");
  } else {
    console.error("❌ Database health check found issues:");
    issues.forEach((issue) => console.error(`  - ${issue}`));
    console.log("💡 Recommendations:");
    recommendations.forEach((rec) => console.log(`  - ${rec}`));
  }

  return { success, issues, recommendations };
}

// Expose to global window for easy console access
if (typeof window !== "undefined") {
  (window as any).checkDatabaseHealth = checkDatabaseHealth;
  console.log("🏥 Database health check available: checkDatabaseHealth()");
}

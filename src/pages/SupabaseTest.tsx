import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function SupabaseTest() {
  const [status, setStatus] = useState("testing");
  const [profiles, setProfiles] = useState<any[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function testSupabase() {
      try {
        console.log("Testing Supabase connection...");

        // Test 1: Basic connection
        const { data: testData, error: testError } = await supabase
          .from("profiles")
          .select("count", { count: "exact", head: true });

        if (testError) {
          throw new Error(`Connection test failed: ${testError.message}`);
        }

        console.log("✅ Basic connection successful");

        // Test 2: Fetch all profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("*");

        if (profilesError) {
          throw new Error(`Profiles fetch failed: ${profilesError.message}`);
        }

        console.log("✅ Profiles fetch successful:", profilesData);
        setProfiles(profilesData || []);

        // Test 3: Fetch transcripts
        const { data: transcriptsData, error: transcriptsError } =
          await supabase.from("transcripts").select("*");

        if (transcriptsError) {
          throw new Error(
            `Transcripts fetch failed: ${transcriptsError.message}`,
          );
        }

        console.log("✅ Transcripts fetch successful:", transcriptsData);

        setStatus("success");
      } catch (err) {
        console.error("❌ Supabase test failed:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setStatus("error");
      }
    }

    testSupabase();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Supabase Connection Test</h1>

        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-bold mb-4">Connection Status</h2>
            <div
              className={`text-lg font-semibold ${
                status === "success"
                  ? "text-green-600"
                  : status === "error"
                    ? "text-red-600"
                    : "text-blue-600"
              }`}
            >
              {status === "testing" && "🔄 Testing connection..."}
              {status === "success" && "✅ All tests passed!"}
              {status === "error" && "❌ Connection failed"}
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
                <div className="text-red-800 font-semibold">Error Details:</div>
                <div className="text-red-700 text-sm mt-2">{error}</div>
              </div>
            )}
          </div>

          {/* Environment Check */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-bold mb-4">Environment Variables</h2>
            <div className="space-y-2 text-sm">
              <div>
                <strong>VITE_SUPABASE_URL:</strong>{" "}
                {import.meta.env.VITE_SUPABASE_URL
                  ? `${import.meta.env.VITE_SUPABASE_URL.substring(0, 30)}...`
                  : "❌ NOT SET"}
              </div>
              <div>
                <strong>VITE_SUPABASE_ANON_KEY:</strong>{" "}
                {import.meta.env.VITE_SUPABASE_ANON_KEY
                  ? `${import.meta.env.VITE_SUPABASE_ANON_KEY.substring(0, 20)}...`
                  : "❌ NOT SET"}
              </div>
            </div>
          </div>

          {/* Profiles Data */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-bold mb-4">
              Profiles Found ({profiles.length})
            </h2>
            {profiles.length > 0 ? (
              <div className="space-y-2">
                {profiles.map((profile, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded border">
                    <div>
                      <strong>ID:</strong> {profile.id}
                    </div>
                    <div>
                      <strong>Name:</strong> {profile.name}
                    </div>
                    <div>
                      <strong>Title:</strong> {profile.title}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500">No profiles found in database</div>
            )}
          </div>

          {/* Actions */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-bold mb-4">Actions</h2>
            <div className="space-x-4">
              <a
                href="/admin-stats-d1g3Yt9"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Go to Admin Dashboard
              </a>
              <a
                href="/"
                className="inline-block bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Go Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { dataProvider } from "@/lib/dataProvider";

export default function DebugDashboard() {
  const [status, setStatus] = useState("initializing");
  const [error, setError] = useState<string | null>(null);
  const [envCheck, setEnvCheck] = useState({
    url: import.meta.env.VITE_SUPABASE_URL || "NOT SET",
    key: import.meta.env.VITE_SUPABASE_ANON_KEY || "NOT SET",
  });

  useEffect(() => {
    async function debug() {
      try {
        setStatus("testing data provider");
        console.log("Environment check:", envCheck);

        const storageType = dataProvider.getStorageType();
        console.log("Storage type:", storageType);

        setStatus("loading profiles");
        const profiles = await dataProvider.getAllProfiles();
        console.log("Profiles loaded:", profiles);

        setStatus("loading analytics");
        const analytics = await dataProvider.getAnalytics();
        console.log("Analytics loaded:", analytics);

        setStatus("success");
      } catch (err) {
        console.error("Debug error:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setStatus("error");
      }
    }

    debug();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Dashboard</h1>

        <div className="space-y-4">
          <div className="bg-white p-4 rounded border">
            <h2 className="font-bold mb-2">Environment Variables</h2>
            <div className="text-sm">
              <div>URL: {envCheck.url.substring(0, 50)}...</div>
              <div>Key: {envCheck.key.substring(0, 20)}...</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded border">
            <h2 className="font-bold mb-2">Status</h2>
            <div
              className={`text-sm ${status === "error" ? "text-red-600" : status === "success" ? "text-green-600" : "text-blue-600"}`}
            >
              {status}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded">
              <h2 className="font-bold text-red-800 mb-2">Error</h2>
              <div className="text-red-700 text-sm">{error}</div>
            </div>
          )}

          <div className="bg-white p-4 rounded border">
            <h2 className="font-bold mb-2">Actions</h2>
            <div className="space-x-2">
              <a
                href="/admin-stats-d1g3Yt9"
                className="text-blue-600 underline"
              >
                Try Admin Dashboard
              </a>
              <a href="/" className="text-blue-600 underline">
                Go Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

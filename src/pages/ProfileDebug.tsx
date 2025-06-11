import { useEffect, useState } from "react";
import { dataProvider } from "@/lib/dataProvider";
import { Profile } from "@/lib/data";

export default function ProfileDebug() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    async function loadProfiles() {
      console.log("🔄 ProfileDebug: Starting to load profiles...");

      try {
        setError(null);
        console.log("📞 ProfileDebug: Calling dataProvider.getAllProfiles()");

        const allProfiles = await dataProvider.getAllProfiles();
        console.log("📋 ProfileDebug: Received profiles:", allProfiles);
        console.log(
          "📊 ProfileDebug: Number of profiles:",
          allProfiles?.length || 0,
        );

        // Force state updates
        setProfiles(allProfiles || []);
        setLoading(false);
        setRenderKey((prev) => prev + 1); // Force re-render

        console.log("✅ ProfileDebug: State updated - loading set to false");
      } catch (err) {
        console.error("❌ ProfileDebug: Error loading profiles:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setProfiles([]);
        setLoading(false);
      }
    }

    loadProfiles();
  }, []);

  // Add render logging
  console.log("🎨 ProfileDebug render:", {
    loading,
    profilesCount: profiles.length,
    error,
    renderKey,
  });

  return (
    <div key={renderKey} className="p-8">
      <h1 className="text-2xl font-bold mb-4">Profile Debug</h1>
      <p className="mb-4">Storage type: {dataProvider.getStorageType()}</p>
      <p className="mb-4">Render key: {renderKey}</p>

      {loading ? (
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
          <p className="text-blue-600">⏳ Loading profiles...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
          <p className="text-red-600">❌ Error: {error}</p>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded p-4 mb-4">
          <p className="text-green-600">
            ✅ Loaded {profiles.length} profiles successfully!
          </p>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-4">
          {profiles.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
              <p className="text-yellow-700">⚠️ No profiles found</p>
            </div>
          ) : (
            profiles.map((profile, index) => (
              <div
                key={`${profile.id}-${index}`}
                className="border border-gray-300 p-4 rounded bg-white shadow-sm"
              >
                <h3 className="font-bold text-lg text-gray-900">
                  {profile.name}
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <strong>ID:</strong> {profile.id}
                  </p>
                  <p>
                    <strong>Title:</strong> {profile.title}
                  </p>
                  <p>
                    <strong>Company:</strong>{" "}
                    {profile.company || "Not specified"}
                  </p>
                  <p>
                    <strong>Transcripts:</strong>{" "}
                    {profile.transcripts?.length || 0}
                  </p>
                </div>
                <div className="mt-3">
                  <a
                    href={`/profile/${profile.id}`}
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    View Profile →
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-bold mb-2">Debug Info:</h3>
        <pre className="text-xs">
          {JSON.stringify(
            {
              loading,
              profilesCount: profiles.length,
              error,
              storageType: dataProvider.getStorageType(),
              renderKey,
            },
            null,
            2,
          )}
        </pre>
      </div>
    </div>
  );
}

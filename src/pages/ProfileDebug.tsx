import { useEffect, useState } from "react";
import { dataProvider } from "@/lib/dataProvider";
import { Profile } from "@/lib/data";

export default function ProfileDebug() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadProfiles() {
      try {
        console.log("🔄 Loading all profiles for debug...");
        setLoading(true);
        setError(null);

        const allProfiles = await dataProvider.getAllProfiles();
        console.log("📋 All available profiles:", allProfiles);

        if (mounted) {
          console.log(
            "📊 Setting profiles state with",
            allProfiles?.length || 0,
            "profiles",
          );

          // Force state updates in sequence
          setProfiles(allProfiles || []);
          setTimeout(() => {
            if (mounted) {
              setLoading(false);
              console.log("✅ Profiles state updated and loading set to false");
            }
          }, 10);
        }
      } catch (err) {
        console.error("❌ Error loading profiles:", err);
        if (mounted) {
          setError(err instanceof Error ? err.message : "Unknown error");
          setProfiles([]);
          setLoading(false);
        }
      }
    }

    // Add delay to ensure component is mounted
    setTimeout(loadProfiles, 200);

    return () => {
      mounted = false;
    };
  }, []);

  console.log(
    "🔍 ProfileDebug render - loading:",
    loading,
    "profiles:",
    profiles.length,
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Profile Debug</h1>
      <p className="mb-4">Storage type: {dataProvider.getStorageType()}</p>

      {loading && <p className="text-blue-600">Loading profiles...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && !error && (
        <>
          <p className="mb-4 text-green-600">
            ✅ Total profiles found: {profiles.length}
          </p>

          <div className="space-y-4">
            {profiles.length === 0 ? (
              <p className="text-gray-500">No profiles found</p>
            ) : (
              profiles.map((profile) => (
                <div key={profile.id} className="border p-4 rounded bg-gray-50">
                  <h3 className="font-bold text-lg">{profile.name}</h3>
                  <p className="text-sm text-gray-600">ID: {profile.id}</p>
                  <p className="text-sm text-gray-600">
                    Title: {profile.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    Transcripts: {profile.transcripts?.length || 0}
                  </p>
                  <a
                    href={`/profile/${profile.id}`}
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    View Profile →
                  </a>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

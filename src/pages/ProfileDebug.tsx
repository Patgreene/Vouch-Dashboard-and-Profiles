import { useEffect, useState } from "react";
import { dataProvider } from "@/lib/dataProvider";
import { Profile } from "@/lib/data";

export default function ProfileDebug() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfiles() {
      try {
        console.log("🔄 Loading all profiles for debug...");
        const allProfiles = await dataProvider.getAllProfiles();
        console.log("📋 All available profiles:", allProfiles);
        setProfiles(allProfiles);
      } catch (error) {
        console.error("❌ Error loading profiles:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProfiles();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Profile Debug</h1>
        <p>Loading profiles...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Profile Debug</h1>
      <p className="mb-4">Storage type: {dataProvider.getStorageType()}</p>
      <p className="mb-4">Total profiles found: {profiles.length}</p>

      <div className="space-y-4">
        {profiles.map((profile) => (
          <div key={profile.id} className="border p-4 rounded">
            <h3 className="font-bold">{profile.name}</h3>
            <p>ID: {profile.id}</p>
            <p>Title: {profile.title}</p>
            <p>Transcripts: {profile.transcripts.length}</p>
            <a
              href={`/profile/${profile.id}`}
              className="text-blue-600 underline"
            >
              View Profile
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

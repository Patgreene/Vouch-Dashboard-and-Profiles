import { getAllProfiles } from "@/lib/data";

export function ProfileDebug() {
  const profiles = getAllProfiles();

  return (
    <div className="fixed top-4 right-4 bg-white border p-4 rounded shadow-lg max-w-sm z-50">
      <h3 className="font-bold mb-2">Available Profiles ({profiles.length})</h3>
      {profiles.map((profile) => (
        <div key={profile.id} className="text-xs mb-2 p-2 border rounded">
          <div>
            <strong>ID:</strong> {profile.id}
          </div>
          <div>
            <strong>Name:</strong> {profile.name}
          </div>
          <div>
            <strong>URL:</strong> /profile/{profile.id}
          </div>
        </div>
      ))}
    </div>
  );
}

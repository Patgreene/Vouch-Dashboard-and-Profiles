import { getAllProfiles, getUserProfiles } from "@/lib/data";
import { useParams } from "react-router-dom";

export function ProfileDebug() {
  const { id } = useParams<{ id: string }>();
  const allProfiles = getAllProfiles();
  const userProfiles = getUserProfiles();

  return (
    <div className="fixed top-4 right-4 bg-white border p-4 rounded shadow-lg max-w-sm z-50 text-xs">
      <h3 className="font-bold mb-2">Profile Debug</h3>

      <div className="mb-3 p-2 bg-blue-50 rounded">
        <strong>Current URL ID:</strong> {id || "None"}
      </div>

      <div className="mb-3">
        <strong>Total Profiles:</strong> {allProfiles.length}
        <div className="ml-2">
          <div>Sample: 2</div>
          <div>User Created: {userProfiles.length}</div>
        </div>
      </div>

      <div className="mb-3">
        <strong>localStorage Data:</strong>
        <div className="ml-2">
          {userProfiles.length > 0 ? (
            userProfiles.map((profile, index) => (
              <div key={index} className="text-xs">
                • {profile.name} ({profile.id})
              </div>
            ))
          ) : (
            <div className="text-gray-500">No user profiles</div>
          )}
        </div>
      </div>

      <div>
        <strong>All Available:</strong>
        {allProfiles.map((profile) => (
          <div key={profile.id} className="text-xs mb-1 p-1 border rounded">
            <div>
              <strong>ID:</strong> {profile.id}
            </div>
            <div>
              <strong>Name:</strong> {profile.name}
            </div>
            <div
              className={profile.id === id ? "text-green-600 font-bold" : ""}
            >
              URL: /profile/{profile.id}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

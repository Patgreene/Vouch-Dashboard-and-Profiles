import { getAllProfiles, getUserProfiles, canEditProfile } from "@/lib/data";

export function ProfileEditDebug() {
  const allProfiles = getAllProfiles();
  const userProfiles = getUserProfiles();

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-50 border border-yellow-200 p-4 rounded shadow-lg max-w-sm z-50 text-xs">
      <h3 className="font-bold mb-2">Profile Edit Debug</h3>

      <div className="mb-3">
        <strong>All Profiles ({allProfiles.length}):</strong>
        {allProfiles.map((profile) => (
          <div key={profile.id} className="ml-2 text-xs">
            • {profile.name} ({profile.id}) -
            <span
              className={
                canEditProfile(profile.id) ? "text-green-600" : "text-red-600"
              }
            >
              {canEditProfile(profile.id) ? " Editable" : " Not Editable"}
            </span>
          </div>
        ))}
      </div>

      <div className="mb-3">
        <strong>User Profiles ({userProfiles.length}):</strong>
        {userProfiles.length > 0 ? (
          userProfiles.map((profile) => (
            <div key={profile.id} className="ml-2 text-xs text-green-600">
              • {profile.name} ({profile.id})
            </div>
          ))
        ) : (
          <div className="ml-2 text-red-600">None found</div>
        )}
      </div>

      <div className="text-xs bg-gray-100 p-2 rounded">
        <strong>localStorage data:</strong>
        <div>{localStorage.getItem("vouch_profiles") || "null"}</div>
      </div>
    </div>
  );
}

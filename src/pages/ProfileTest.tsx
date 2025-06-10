import { getAllProfiles, getUserProfiles } from "@/lib/data";
import { Link } from "react-router-dom";

export default function ProfileTest() {
  const allProfiles = getAllProfiles();
  const userProfiles = getUserProfiles();

  const clearStorage = () => {
    localStorage.removeItem("vouch_profiles");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile Debug Page</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">
              All Profiles ({allProfiles.length})
            </h2>
            {allProfiles.map((profile) => (
              <div key={profile.id} className="border p-4 mb-4 rounded">
                <div>
                  <strong>ID:</strong> {profile.id}
                </div>
                <div>
                  <strong>Name:</strong> {profile.name}
                </div>
                <div>
                  <strong>Title:</strong> {profile.title}
                </div>
                <div className="mt-2 space-x-2">
                  <Link
                    to={`/profile/${profile.id}`}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                  >
                    View Profile
                  </Link>
                  <a
                    href={`/profile/${profile.id}`}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Direct Link
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">
              User Created Profiles ({userProfiles.length})
            </h2>
            {userProfiles.length > 0 ? (
              userProfiles.map((profile) => (
                <div
                  key={profile.id}
                  className="border p-4 mb-4 rounded bg-yellow-50"
                >
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
              ))
            ) : (
              <div className="text-gray-500">
                No user-created profiles found
              </div>
            )}

            <div className="mt-6">
              <h3 className="font-bold mb-2">localStorage Debug:</h3>
              <div className="bg-gray-100 p-3 rounded text-xs">
                <pre>{JSON.stringify(userProfiles, null, 2)}</pre>
              </div>
              <button
                onClick={clearStorage}
                className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm"
              >
                Clear localStorage
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Test URLs</h2>
          <div className="space-y-2">
            <div>
              <strong>Sample Profile:</strong>
              <a
                href="/profile/lara-ruso"
                className="ml-2 text-blue-500 underline"
              >
                /profile/lara-ruso
              </a>
            </div>
            <div>
              <strong>Alex Morgan:</strong>
              <a
                href="/profile/alex-morgan"
                className="ml-2 text-blue-500 underline"
              >
                /profile/alex-morgan
              </a>
            </div>
            <div>
              <strong>Matthew Collings:</strong>
              <a
                href="/profile/matthew-collings"
                className="ml-2 text-blue-500 underline"
              >
                /profile/matthew-collings
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

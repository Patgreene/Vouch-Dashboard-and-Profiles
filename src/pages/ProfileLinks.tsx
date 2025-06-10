import { getAllProfiles } from "@/lib/data";
import { Link } from "react-router-dom";

export default function ProfileLinks() {
  const profiles = getAllProfiles();

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      alert("URL copied to clipboard!");
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile Links</h1>

        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Working Profile Links</h2>
          <p className="text-gray-600 mb-6">
            Use these links to access profiles. Router navigation works, but
            direct URL access might not work due to server configuration.
          </p>

          {profiles.map((profile) => {
            const profileUrl = `${window.location.origin}/profile/${profile.id}`;

            return (
              <div key={profile.id} className="border p-4 mb-4 rounded">
                <div className="mb-2">
                  <strong>Name:</strong> {profile.name}
                </div>
                <div className="mb-2">
                  <strong>Title:</strong> {profile.title}
                </div>
                <div className="mb-3">
                  <strong>Profile ID:</strong>{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    {profile.id}
                  </code>
                </div>

                <div className="space-y-2">
                  <div>
                    <strong>Full URL:</strong>
                    <div className="bg-gray-100 p-2 rounded mt-1 text-sm break-all">
                      {profileUrl}
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Link
                      to={`/profile/${profile.id}`}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      🔗 Router Navigation
                    </Link>

                    <a
                      href={`/profile/${profile.id}`}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      🌐 Direct Link (New Tab)
                    </a>

                    <button
                      onClick={() => copyToClipboard(profileUrl)}
                      className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                    >
                      📋 Copy URL
                    </button>

                    <button
                      onClick={() =>
                        window.open(`/profile/${profile.id}`, "_self")
                      }
                      className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                    >
                      🔄 Force Navigate
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
          <h3 className="text-lg font-bold mb-2">🚨 Direct URL Issue</h3>
          <p className="text-sm text-gray-700 mb-4">
            If direct URLs don't work, it's because your server needs to be
            configured to serve the React app for all routes. The router
            navigation should work perfectly though.
          </p>

          <div className="text-xs text-gray-600">
            <strong>Available Profile IDs:</strong>
            <ul className="list-disc list-inside mt-2">
              {profiles.map((profile) => (
                <li key={profile.id}>
                  <code>{profile.id}</code> → {profile.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

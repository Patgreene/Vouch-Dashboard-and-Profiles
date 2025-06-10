import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Simple fallback admin that just uses localStorage
import { getAllProfiles, Profile } from "@/lib/data";

export default function SimpleAdmin() {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    try {
      const loadedProfiles = getAllProfiles();
      setProfiles(loadedProfiles);
      console.log("Loaded profiles:", loadedProfiles);
    } catch (error) {
      console.error("Error loading profiles:", error);
      setProfiles([]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Simple Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Emergency fallback - using localStorage
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button asChild variant="outline">
                <Link to="/">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Site
                </Link>
              </Button>
              <Button
                onClick={() =>
                  alert(
                    "Profile creation temporarily disabled in fallback mode",
                  )
                }
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{profiles.length}</div>
              <div className="text-gray-600">Total Profiles</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">
                {profiles.reduce((sum, p) => sum + p.transcripts.length, 0)}
              </div>
              <div className="text-gray-600">Total Transcripts</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">✅</div>
              <div className="text-gray-600">Working</div>
            </CardContent>
          </Card>
        </div>

        {/* Profiles List */}
        <Card>
          <CardHeader>
            <CardTitle>Profiles</CardTitle>
          </CardHeader>
          <CardContent>
            {profiles.length > 0 ? (
              <div className="space-y-4">
                {profiles.map((profile) => (
                  <div
                    key={profile.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {profile.name}
                      </h3>
                      <p className="text-sm text-gray-600">{profile.title}</p>
                      <p className="text-xs text-gray-500">ID: {profile.id}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/profile/${profile.id}`}>View Profile</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No profiles found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-bold text-blue-800 mb-2">
              🛠️ Emergency Fallback Mode
            </h3>
            <p className="text-blue-700 text-sm">
              This is a simple admin dashboard using localStorage. Once the
              Supabase issue is fixed, you can switch back to the full
              dashboard.
            </p>
            <div className="mt-4 space-x-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/admin-stats-d1g3Yt9">Try Full Dashboard</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/debug">Debug Page</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

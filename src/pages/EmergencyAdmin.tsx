import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

export default function EmergencyAdmin() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfiles() {
      try {
        console.log("Emergency admin: Loading profiles...");
        const { data, error } = await supabase.from("profiles").select("*");

        if (error) {
          console.error("Error:", error);
          setProfiles([]);
        } else {
          console.log("Emergency admin: Loaded profiles:", data);
          setProfiles(data || []);
        }
      } catch (err) {
        console.error("Exception:", err);
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    }

    loadProfiles();
  }, []);

  const copyUrl = (profileId: string) => {
    const url = `${window.location.origin}/profile/${profileId}`;
    navigator.clipboard.writeText(url);
    alert(`Copied: ${url}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6 bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-800">
              🚨 Emergency Admin Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 mb-4">
              This is a simplified admin dashboard that bypasses the main admin
              issues.
            </p>
            <div className="flex gap-4">
              <Link
                to="/admin-stats-d1g3Yt9"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Try Main Dashboard
              </Link>
              <Link
                to="/supabase-test"
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Supabase Test
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Your Profiles ({loading ? "Loading..." : profiles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p>Loading profiles...</p>
              </div>
            ) : profiles.length > 0 ? (
              <div className="space-y-4">
                {profiles.map((profile) => (
                  <div
                    key={profile.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white"
                  >
                    <div>
                      <h3 className="font-bold text-lg">{profile.name}</h3>
                      <p className="text-gray-600">{profile.title}</p>
                      <p className="text-sm text-gray-500">ID: {profile.id}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => copyUrl(profile.id)}
                        variant="outline"
                        size="sm"
                      >
                        Copy URL
                      </Button>
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
      </div>
    </div>
  );
}

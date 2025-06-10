import { useState } from "react";
import { Eye, Database, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LocalStorageCheck() {
  const [showDetails, setShowDetails] = useState(false);

  const getLocalStorageData = () => {
    try {
      const profiles = localStorage.getItem("vouch_profiles");
      const analytics = localStorage.getItem("vouch_analytics");

      return {
        profiles: profiles ? JSON.parse(profiles) : [],
        analytics: analytics ? JSON.parse(analytics) : [],
        profilesRaw: profiles,
        analyticsRaw: analytics,
      };
    } catch (error) {
      return {
        profiles: [],
        analytics: [],
        profilesRaw: null,
        analyticsRaw: null,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  const clearLocalStorage = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all localStorage data? This cannot be undone.",
      )
    ) {
      localStorage.removeItem("vouch_profiles");
      localStorage.removeItem("vouch_analytics");
      window.location.reload();
    }
  };

  const data = getLocalStorageData();

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          localStorage Debug
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-lg font-semibold">
                {data.profiles.length}
              </div>
              <div className="text-sm text-gray-600">
                Profiles in localStorage
              </div>
            </div>
            <div>
              <div className="text-lg font-semibold">
                {data.analytics.length}
              </div>
              <div className="text-sm text-gray-600">Analytics events</div>
            </div>
          </div>

          {data.profiles.length > 0 && (
            <div>
              <div className="font-semibold mb-2">Profiles found:</div>
              {data.profiles.map((profile: any, index: number) => (
                <div
                  key={index}
                  className="text-sm bg-gray-100 p-2 rounded mb-1"
                >
                  • <strong>{profile.name}</strong> ({profile.id})
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={() => setShowDetails(!showDetails)}
              variant="outline"
              size="sm"
            >
              <Eye className="h-4 w-4 mr-1" />
              {showDetails ? "Hide" : "Show"} Raw Data
            </Button>
            {(data.profiles.length > 0 || data.analytics.length > 0) && (
              <Button
                onClick={clearLocalStorage}
                variant="outline"
                size="sm"
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear localStorage
              </Button>
            )}
          </div>

          {showDetails && (
            <div className="space-y-2">
              <div>
                <div className="font-semibold text-xs">Profiles Data:</div>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                  {data.profilesRaw || "null"}
                </pre>
              </div>
              <div>
                <div className="font-semibold text-xs">Analytics Data:</div>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                  {data.analyticsRaw || "null"}
                </pre>
              </div>
            </div>
          )}

          {data.error && (
            <div className="text-red-600 text-sm">Error: {data.error}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

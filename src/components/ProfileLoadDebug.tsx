import { useState, useEffect } from "react";
import { AlertCircle, Database, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dataProvider } from "@/lib/dataProvider";

export function ProfileLoadDebug() {
  const [status, setStatus] = useState("loading");
  const [profiles, setProfiles] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [storageType, setStorageType] = useState("");

  const loadProfiles = async () => {
    try {
      setStatus("loading");
      setError(null);

      console.log("Debug: Loading profiles...");
      const storageTypeInfo = dataProvider.getStorageType();
      setStorageType(storageTypeInfo);

      const loadedProfiles = await dataProvider.getAllProfiles();
      console.log("Debug: Loaded profiles:", loadedProfiles);

      setProfiles(loadedProfiles);
      setStatus("success");
    } catch (err) {
      console.error("Debug: Error loading profiles:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Profile Loading Debug
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-semibold">Storage Type</div>
              <div className="text-blue-700">{storageType}</div>
            </div>
            <div>
              <div className="font-semibold">Status</div>
              <div
                className={
                  status === "error"
                    ? "text-red-600"
                    : status === "success"
                      ? "text-green-600"
                      : "text-blue-600"
                }
              >
                {status}
              </div>
            </div>
            <div>
              <div className="font-semibold">Profiles Found</div>
              <div className="text-blue-700">{profiles.length}</div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <span className="font-semibold">Error:</span>
              </div>
              <div className="text-red-700 text-sm mt-1">{error}</div>
            </div>
          )}

          {profiles.length > 0 && (
            <div>
              <div className="font-semibold text-sm mb-2">Found Profiles:</div>
              <div className="space-y-1">
                {profiles.map((profile, index) => (
                  <div
                    key={index}
                    className="text-sm bg-white p-2 rounded border"
                  >
                    <div>
                      <strong>Name:</strong> {profile.name}
                    </div>
                    <div>
                      <strong>ID:</strong> {profile.id}
                    </div>
                    <div>
                      <strong>Title:</strong> {profile.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={loadProfiles} size="sm" variant="outline">
              <RefreshCw className="h-4 w-4 mr-1" />
              Reload Profiles
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

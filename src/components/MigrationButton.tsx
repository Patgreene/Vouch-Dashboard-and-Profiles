import { useState } from "react";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { migrateLocalStorageToSupabase } from "@/lib/supabaseData";

interface MigrationButtonProps {
  onMigrationComplete: () => void;
}

export function MigrationButton({ onMigrationComplete }: MigrationButtonProps) {
  const [migrating, setMigrating] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Check if there are localStorage profiles to migrate
  const hasLocalStorageProfiles = () => {
    try {
      const stored = localStorage.getItem("vouch_profiles");
      const profiles = stored ? JSON.parse(stored) : [];
      return profiles.length > 0;
    } catch {
      return false;
    }
  };

  const handleMigrate = async () => {
    setMigrating(true);
    setResult(null);

    try {
      const migrationResult = await migrateLocalStorageToSupabase();
      setResult(migrationResult);

      if (migrationResult.success) {
        setTimeout(() => {
          onMigrationComplete();
        }, 2000);
      }
    } catch (error) {
      setResult({
        success: false,
        message: `Migration failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    } finally {
      setMigrating(false);
    }
  };

  if (!hasLocalStorageProfiles()) {
    return null; // Don't show if no localStorage profiles
  }

  if (result?.success) {
    return (
      <Card className="border-green-200 bg-green-50 mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 text-green-700">
            <CheckCircle className="h-5 w-5" />
            <span className="font-semibold">✅ {result.message}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50 mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-blue-800 mb-1">
              📦 Migrate Your Profiles to Supabase
            </div>
            <div className="text-sm text-blue-600">
              Your profiles are currently in localStorage. Migrate them to
              Supabase to make them globally accessible.
            </div>
            {result?.success === false && (
              <div className="text-sm text-red-600 mt-2">{result.message}</div>
            )}
          </div>
          <Button
            onClick={handleMigrate}
            disabled={migrating}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {migrating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Migrating...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Migrate Now
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

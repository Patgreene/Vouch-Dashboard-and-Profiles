import { useState } from "react";
import { Database, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dataProvider } from "@/lib/dataProvider";
import { migrateLocalStorageToSupabase } from "@/lib/supabaseData";

interface SupabaseMigrationProps {
  onComplete: () => void;
}

export function SupabaseMigration({ onComplete }: SupabaseMigrationProps) {
  const [migrating, setMigrating] = useState(false);
  const [migrated, setMigrated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const storageType = dataProvider.getStorageType();
  const isSupabaseConfigured = storageType === "supabase";

  const handleMigrate = async () => {
    setMigrating(true);
    setError(null);

    try {
      const result = await migrateLocalStorageToSupabase();

      if (result.success) {
        setMigrated(true);
        setTimeout(() => {
          onComplete();
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError(
        `Migration failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setMigrating(false);
    }
  };

  if (!isSupabaseConfigured) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800">
            <AlertCircle className="h-5 w-5" />
            Supabase Not Configured
          </CardTitle>
        </CardHeader>
        <CardContent className="text-yellow-700">
          <p className="mb-4">
            You're currently using localStorage for data storage. To make
            profiles accessible from any device:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Set up a Supabase project (see SUPABASE_SETUP.md)</li>
            <li>Add your environment variables to .env</li>
            <li>Restart your development server</li>
            <li>Come back here to migrate your data</li>
          </ol>
        </CardContent>
      </Card>
    );
  }

  if (migrated) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-3 text-green-700">
            <CheckCircle className="h-6 w-6" />
            <span className="font-semibold">
              Migration completed successfully!
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Database className="h-5 w-5" />
          Migrate to Supabase
        </CardTitle>
      </CardHeader>
      <CardContent className="text-blue-700">
        <p className="mb-4">
          ✅ Supabase is configured! You can now migrate your existing
          localStorage data to make it globally accessible.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <Button onClick={handleMigrate} disabled={migrating} className="w-full">
          {migrating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Migrating...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Migrate Data to Supabase
            </>
          )}
        </Button>

        <p className="text-xs mt-2 text-blue-600">
          This will copy all your profiles and analytics to Supabase, making
          them accessible from any device.
        </p>
      </CardContent>
    </Card>
  );
}

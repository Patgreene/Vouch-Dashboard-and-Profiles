import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

export function SupabaseTest() {
  const [status, setStatus] = useState<"testing" | "connected" | "error">(
    "testing",
  );
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("count", { count: "exact", head: true });

        if (error) {
          throw error;
        }

        setStatus("connected");
      } catch (err) {
        console.error("Supabase connection test failed:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setStatus("error");
      }
    }

    testConnection();
  }, []);

  return (
    <Card
      className={`border-2 ${
        status === "connected"
          ? "border-green-200 bg-green-50"
          : status === "error"
            ? "border-red-200 bg-red-50"
            : "border-blue-200 bg-blue-50"
      }`}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Supabase Connection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          {status === "testing" && (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-blue-700">Testing connection...</span>
            </>
          )}

          {status === "connected" && (
            <>
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-700 font-semibold">
                ✅ Connected to Supabase!
              </span>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="h-5 w-5 text-red-600" />
              <div className="text-red-700">
                <div className="font-semibold">❌ Connection failed</div>
                <div className="text-sm mt-1">
                  {error.includes("relation") ||
                  error.includes("does not exist")
                    ? "Database tables not found. Please run the schema SQL in your Supabase SQL Editor."
                    : error}
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

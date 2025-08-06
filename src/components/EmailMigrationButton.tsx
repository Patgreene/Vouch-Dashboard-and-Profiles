import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Mail, Database } from "lucide-react";
import { 
  migrateExistingProfilesWithEmails, 
  validateEmailMigration,
  getCurrentMappings,
  type MigrationResult
} from "@/utils/emailMigration";

export function EmailMigrationButton() {
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showMappings, setShowMappings] = useState(false);

  const handleMigration = async () => {
    setIsLoading(true);
    setMigrationResult(null);
    
    try {
      const result = await migrateExistingProfilesWithEmails();
      setMigrationResult(result);
    } catch (error) {
      setMigrationResult({
        success: false,
        message: `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        updatedProfiles: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validation = validateEmailMigration();
  const mappings = getCurrentMappings();

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Migration Tool
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          <p>This tool adds email fields to existing profiles and transcripts for better identification.</p>
          <p className="mt-1">
            <strong>Important:</strong> This migration will add placeholder emails that should be updated with real ones.
          </p>
        </div>

        {/* Validation Status */}
        <div className="flex items-center gap-2">
          {validation.valid ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-700">Email mappings configured</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-yellow-700">
                {validation.issues.length} mapping issue(s) found
              </span>
            </>
          )}
        </div>

        {/* Show Mappings */}
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMappings(!showMappings)}
          >
            {showMappings ? "Hide" : "Show"} Email Mappings
          </Button>
          
          {showMappings && (
            <div className="mt-4 space-y-3">
              <div>
                <h4 className="font-medium text-sm mb-2">Profile Emails:</h4>
                <div className="space-y-1">
                  {Object.entries(mappings.profiles).map(([id, email]) => (
                    <div key={id} className="flex items-center justify-between text-xs">
                      <span className="font-mono">{id}</span>
                      <Badge variant="outline">{email}</Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-2">Speaker Emails:</h4>
                <div className="space-y-1">
                  {Object.entries(mappings.speakers).map(([name, email]) => (
                    <div key={name} className="flex items-center justify-between text-xs">
                      <span>{name}</span>
                      <Badge variant="outline">{email}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Migration Button */}
        <Button 
          onClick={handleMigration} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Running Migration...
            </>
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" />
              Run Email Migration
            </>
          )}
        </Button>

        {/* Migration Result */}
        {migrationResult && (
          <div className={`p-3 rounded-lg ${
            migrationResult.success 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {migrationResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <span className={`font-medium ${
                migrationResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {migrationResult.message}
              </span>
            </div>
            
            {migrationResult.errors.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium text-red-700 mb-1">Issues:</p>
                <ul className="text-xs text-red-600 space-y-1">
                  {migrationResult.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
          <p><strong>After migration:</strong></p>
          <ul className="mt-1 space-y-1">
            <li>• Update placeholder emails with real ones in the admin dashboard</li>
            <li>• Test the "Given" and "Received" tabs on profiles</li>
            <li>• New profiles will require email addresses</li>
            <li>• New transcripts will require speaker emails</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

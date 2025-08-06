import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Mail, Database, Save, Edit } from "lucide-react";
import { dataProvider } from "@/lib/dataProvider";
import { Profile } from "@/lib/data";

interface EmailMappings {
  profiles: Record<string, string>;
  speakers: Record<string, string>;
}

interface MigrationResult {
  success: boolean;
  message: string;
  updatedProfiles: number;
  errors: string[];
}

export function EmailMigrationButton() {
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showMappings, setShowMappings] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [allSpeakers, setAllSpeakers] = useState<string[]>([]);

  // Editable email mappings
  const [emailMappings, setEmailMappings] = useState<EmailMappings>({
    profiles: {
      "danielle-davis": "danielle.davis@meta.com",
      "alex-morgan": "alex.morgan@spotify.com",
    },
    speakers: {
      "John Smith": "john.smith@meta.com",
      "Sarah Chen": "sarah.chen@meta.com",
      "Mike Rodriguez": "mike.rodriguez@meta.com",
      "Emma Wilson": "emma.wilson@spotify.com",
    }
  });

  // Load existing profiles and speakers
  useEffect(() => {
    async function loadData() {
      try {
        const profilesData = await dataProvider.getAllProfiles();
        setProfiles(profilesData);

        // Extract all unique speakers
        const speakers = new Set<string>();
        profilesData.forEach(profile => {
          profile.transcripts.forEach(transcript => {
            speakers.add(transcript.speakerName);
          });
        });
        setAllSpeakers(Array.from(speakers));

        // Initialize mappings for existing profiles that don't have emails
        const newProfileMappings = { ...emailMappings.profiles };
        const newSpeakerMappings = { ...emailMappings.speakers };

        profilesData.forEach(profile => {
          if (!profile.email && !newProfileMappings[profile.id]) {
            // Generate suggested email
            const suggested = `${profile.name.toLowerCase().replace(/\s+/g, '.')}@company.com`;
            newProfileMappings[profile.id] = suggested;
          }
        });

        speakers.forEach(speaker => {
          if (!newSpeakerMappings[speaker]) {
            // Generate suggested email
            const suggested = `${speaker.toLowerCase().replace(/\s+/g, '.')}@company.com`;
            newSpeakerMappings[speaker] = suggested;
          }
        });

        setEmailMappings({
          profiles: newProfileMappings,
          speakers: newSpeakerMappings
        });
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    }
    loadData();
  }, []);

  const updateProfileEmail = (profileId: string, email: string) => {
    setEmailMappings(prev => ({
      ...prev,
      profiles: {
        ...prev.profiles,
        [profileId]: email
      }
    }));
  };

  const updateSpeakerEmail = (speakerName: string, email: string) => {
    setEmailMappings(prev => ({
      ...prev,
      speakers: {
        ...prev.speakers,
        [speakerName]: email
      }
    }));
  };

  const runMigration = async () => {
    setIsLoading(true);
    setMigrationResult(null);

    try {
      const errors: string[] = [];
      let updatedProfiles = 0;

      for (const profile of profiles) {
        let needsUpdate = false;
        let updatedProfile = { ...profile };

        // 1. Add email to profile if missing
        if (!profile.email || profile.email === "") {
          const mappedEmail = emailMappings.profiles[profile.id];
          if (mappedEmail && mappedEmail.trim()) {
            updatedProfile.email = mappedEmail.trim();
            needsUpdate = true;
            console.log(`✅ Added email ${mappedEmail} to profile ${profile.name}`);
          } else {
            errors.push(`❌ No email provided for profile: ${profile.name} (ID: ${profile.id})`);
            continue;
          }
        }

        // 2. Add speaker emails to transcripts if missing
        updatedProfile.transcripts = profile.transcripts.map(transcript => {
          if (!transcript.speakerEmail || transcript.speakerEmail === "") {
            const mappedEmail = emailMappings.speakers[transcript.speakerName];
            if (mappedEmail && mappedEmail.trim()) {
              console.log(`✅ Added speaker email ${mappedEmail} for ${transcript.speakerName}`);
              needsUpdate = true;
              return { ...transcript, speakerEmail: mappedEmail.trim() };
            } else {
              errors.push(`❌ No email provided for speaker: ${transcript.speakerName}`);
              return transcript;
            }
          }
          return transcript;
        });

        // Save updated profile if changes were made
        if (needsUpdate) {
          try {
            console.log(`🔄 Attempting to save profile: ${profile.name}`, updatedProfile);
            const success = await dataProvider.saveProfile(updatedProfile);
            if (success) {
              updatedProfiles++;
              console.log(`✅ Updated profile: ${profile.name}`);
            } else {
              console.error(`❌ Save returned false for profile: ${profile.name}`);
              errors.push(`❌ Failed to save profile: ${profile.name} (save returned false)`);
            }
          } catch (error) {
            console.error(`❌ Exception saving profile ${profile.name}:`, error);
            errors.push(`❌ Error saving profile ${profile.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      }

      const result: MigrationResult = {
        success: errors.length === 0,
        message: `Migration completed. Updated ${updatedProfiles} profiles.`,
        updatedProfiles,
        errors
      };

      setMigrationResult(result);

      // Reload profiles to reflect changes
      if (updatedProfiles > 0) {
        const refreshedProfiles = await dataProvider.getAllProfiles();
        setProfiles(refreshedProfiles);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setMigrationResult({
        success: false,
        message: `Migration failed: ${errorMessage}`,
        updatedProfiles: 0,
        errors: [errorMessage]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getProfilesNeedingEmails = () => {
    return profiles.filter(p => !p.email || p.email === "");
  };

  const getSpeakersNeedingEmails = () => {
    const speakersWithoutEmails = new Set<string>();
    profiles.forEach(profile => {
      profile.transcripts.forEach(transcript => {
        if (!transcript.speakerEmail || transcript.speakerEmail === "") {
          speakersWithoutEmails.add(transcript.speakerName);
        }
      });
    });
    return Array.from(speakersWithoutEmails);
  };

  const profilesNeedingEmails = getProfilesNeedingEmails();
  const speakersNeedingEmails = getSpeakersNeedingEmails();

  // Check if all emails are configured in the form (not just in the database)
  const allProfileEmailsConfigured = profilesNeedingEmails.every(profile =>
    emailMappings.profiles[profile.id] && emailMappings.profiles[profile.id].trim() !== ""
  );

  const allSpeakerEmailsConfigured = speakersNeedingEmails.every(speaker =>
    emailMappings.speakers[speaker] && emailMappings.speakers[speaker].trim() !== ""
  );

  const isReady = allProfileEmailsConfigured && allSpeakerEmailsConfigured;

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
          <p>Add email addresses to existing profiles and transcripts for better identification.</p>
          <p className="mt-1">
            <strong>Found:</strong> {profiles.length} profiles, {profilesNeedingEmails.length} need emails
          </p>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          {isReady ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-700">All emails configured - ready to migrate!</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-yellow-700">
                {profilesNeedingEmails.length + speakersNeedingEmails.length} emails need configuration
              </span>
            </>
          )}
        </div>

        {/* Toggle Edit Mode */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditMode(!editMode)}
          >
            <Edit className="h-4 w-4 mr-2" />
            {editMode ? "View Mode" : "Edit Emails"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMappings(!showMappings)}
          >
            {showMappings ? "Hide" : "Show"} All Mappings
          </Button>
        </div>

        {/* Edit Interface */}
        {editMode && (
          <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium">Configure Email Addresses</h4>

            {/* Profiles needing emails */}
            {profilesNeedingEmails.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-red-700">
                  Profiles Missing Emails ({profilesNeedingEmails.length})
                </Label>
                <div className="space-y-2 mt-2">
                  {profilesNeedingEmails.map(profile => (
                    <div key={profile.id} className="flex items-center gap-2">
                      <span className="text-sm font-medium w-32 truncate">
                        {profile.name}
                      </span>
                      <Input
                        type="email"
                        placeholder="email@company.com"
                        value={emailMappings.profiles[profile.id] || ""}
                        onChange={(e) => updateProfileEmail(profile.id, e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Speakers needing emails */}
            {speakersNeedingEmails.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-red-700">
                  Speakers Missing Emails ({speakersNeedingEmails.length})
                </Label>
                <div className="space-y-2 mt-2">
                  {speakersNeedingEmails.map(speaker => (
                    <div key={speaker} className="flex items-center gap-2">
                      <span className="text-sm font-medium w-32 truncate">
                        {speaker}
                      </span>
                      <Input
                        type="email"
                        placeholder="email@company.com"
                        value={emailMappings.speakers[speaker] || ""}
                        onChange={(e) => updateSpeakerEmail(speaker, e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Show All Mappings */}
        {showMappings && (
          <div className="mt-4 space-y-3 border rounded-lg p-4">
            <div>
              <h4 className="font-medium text-sm mb-2">All Profile Emails:</h4>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {Object.entries(emailMappings.profiles).map(([id, email]) => {
                  const profile = profiles.find(p => p.id === id);
                  return (
                    <div key={id} className="flex items-center justify-between text-xs">
                      <span className="truncate max-w-40">
                        {profile?.name || id}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {email}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm mb-2">All Speaker Emails:</h4>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {Object.entries(emailMappings.speakers).map(([name, email]) => (
                  <div key={name} className="flex items-center justify-between text-xs">
                    <span className="truncate max-w-40">{name}</span>
                    <Badge variant="outline" className="text-xs">
                      {email}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Migration Button */}
        <Button
          onClick={runMigration}
          disabled={isLoading || !isReady}
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
              {isReady ? "Run Email Migration" : "Configure Emails First"}
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
                <ul className="text-xs text-red-600 space-y-1 max-h-40 overflow-y-auto">
                  {migrationResult.errors.map((error, index) => (
                    <li key={index}>��� {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
          <p><strong>How to use:</strong></p>
          <ul className="mt-1 space-y-1">
            <li>1. Click "Edit Emails" to add email addresses</li>
            <li>2. Fill in emails for all profiles and speakers</li>
            <li>3. Click "Run Email Migration" when ready</li>
            <li>4. Test the "Given" and "Received" tabs on profiles</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

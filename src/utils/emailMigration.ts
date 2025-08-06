import { dataProvider } from "@/lib/dataProvider";
import { Profile } from "@/lib/data";

// Manual email assignments for existing profiles
const PROFILE_EMAIL_MAPPINGS: Record<string, string> = {
  "danielle-davis": "danielle.davis@meta.com",
  "alex-morgan": "alex.morgan@spotify.com",
  // Add Patrick's email here
  "patrick-greene": "patrick.greene@company.com", // Update with actual email
};

// Manual speaker email assignments based on names
const SPEAKER_EMAIL_MAPPINGS: Record<string, string> = {
  "John Smith": "john.smith@meta.com",
  "Sarah Chen": "sarah.chen@meta.com", 
  "Mike Rodriguez": "mike.rodriguez@meta.com",
  "Emma Wilson": "emma.wilson@spotify.com",
  "Patrick Greene": "patrick.greene@company.com", // Update with actual email
};

export interface MigrationResult {
  success: boolean;
  message: string;
  updatedProfiles: number;
  errors: string[];
}

export async function migrateExistingProfilesWithEmails(): Promise<MigrationResult> {
  const errors: string[] = [];
  let updatedProfiles = 0;

  try {
    console.log("🔄 Starting email migration for existing profiles...");
    
    const profiles = await dataProvider.getAllProfiles();
    
    for (const profile of profiles) {
      let needsUpdate = false;
      let updatedProfile = { ...profile };

      // 1. Add email to profile if missing
      if (!profile.email || profile.email === "") {
        const suggestedEmail = PROFILE_EMAIL_MAPPINGS[profile.id];
        if (suggestedEmail) {
          updatedProfile.email = suggestedEmail;
          needsUpdate = true;
          console.log(`✅ Added email ${suggestedEmail} to profile ${profile.name}`);
        } else {
          errors.push(`❌ No email mapping found for profile: ${profile.name} (ID: ${profile.id})`);
          // Generate a placeholder email based on name
          const placeholder = `${profile.name.toLowerCase().replace(/\s+/g, '.')}@placeholder.com`;
          updatedProfile.email = placeholder;
          needsUpdate = true;
          console.log(`⚠️ Used placeholder email ${placeholder} for ${profile.name}`);
        }
      }

      // 2. Add speaker emails to transcripts if missing
      updatedProfile.transcripts = profile.transcripts.map(transcript => {
        if (!transcript.speakerEmail || transcript.speakerEmail === "") {
          const suggestedEmail = SPEAKER_EMAIL_MAPPINGS[transcript.speakerName];
          if (suggestedEmail) {
            console.log(`✅ Added speaker email ${suggestedEmail} for ${transcript.speakerName}`);
            needsUpdate = true;
            return { ...transcript, speakerEmail: suggestedEmail };
          } else {
            const placeholder = `${transcript.speakerName.toLowerCase().replace(/\s+/g, '.')}@placeholder.com`;
            errors.push(`❌ No speaker email mapping found for: ${transcript.speakerName}, using ${placeholder}`);
            needsUpdate = true;
            return { ...transcript, speakerEmail: placeholder };
          }
        }
        return transcript;
      });

      // Save updated profile if changes were made
      if (needsUpdate) {
        const success = await dataProvider.saveProfile(updatedProfile);
        if (success) {
          updatedProfiles++;
          console.log(`✅ Updated profile: ${profile.name}`);
        } else {
          errors.push(`❌ Failed to save profile: ${profile.name}`);
        }
      }
    }

    const result: MigrationResult = {
      success: errors.length === 0,
      message: `Migration completed. Updated ${updatedProfiles} profiles.`,
      updatedProfiles,
      errors
    };

    console.log("🎉 Migration completed:", result);
    return result;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Migration failed:", errorMessage);
    
    return {
      success: false,
      message: `Migration failed: ${errorMessage}`,
      updatedProfiles,
      errors: [errorMessage, ...errors]
    };
  }
}

export function validateEmailMigration(): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  // Check if all expected profiles have email mappings
  const expectedProfiles = ["danielle-davis", "alex-morgan", "patrick-greene"];
  const expectedSpeakers = ["John Smith", "Sarah Chen", "Mike Rodriguez", "Emma Wilson", "Patrick Greene"];

  expectedProfiles.forEach(profileId => {
    if (!PROFILE_EMAIL_MAPPINGS[profileId]) {
      issues.push(`Missing email mapping for profile: ${profileId}`);
    }
  });

  expectedSpeakers.forEach(speakerName => {
    if (!SPEAKER_EMAIL_MAPPINGS[speakerName]) {
      issues.push(`Missing email mapping for speaker: ${speakerName}`);
    }
  });

  return {
    valid: issues.length === 0,
    issues
  };
}

// Helper function to add new email mappings
export function addEmailMapping(type: 'profile' | 'speaker', key: string, email: string) {
  if (type === 'profile') {
    PROFILE_EMAIL_MAPPINGS[key] = email;
  } else {
    SPEAKER_EMAIL_MAPPINGS[key] = email;
  }
  console.log(`✅ Added ${type} email mapping: ${key} -> ${email}`);
}

// Helper to get current mappings for review
export function getCurrentMappings() {
  return {
    profiles: { ...PROFILE_EMAIL_MAPPINGS },
    speakers: { ...SPEAKER_EMAIL_MAPPINGS }
  };
}

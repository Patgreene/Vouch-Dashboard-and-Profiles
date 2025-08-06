import { dataProvider } from "@/lib/dataProvider";

export interface MigrationResult {
  success: boolean;
  message: string;
  updatedProfiles: number;
  errors: string[];
}

export async function runSafeEmailMigration(
  profileEmails: Record<string, string>,
  speakerEmails: Record<string, string>
): Promise<MigrationResult> {
  const errors: string[] = [];
  let updatedProfiles = 0;

  try {
    console.log("🔄 Starting safe email migration...");
    
    // Get current profiles
    const profiles = await dataProvider.getAllProfiles();
    console.log(`📋 Found ${profiles.length} profiles to check`);

    for (const profile of profiles) {
      try {
        let needsUpdate = false;
        
        // Create a properly typed profile object
        const updatedProfile: any = {
          id: profile.id,
          name: profile.name,
          title: profile.title,
          email: (profile as any).email || profileEmails[profile.id] || "",
          company: profile.company || "",
          photo: profile.photo || "",
          linkedIn: profile.linkedIn || "",
          cv: profile.cv || "",
          portfolio: profile.portfolio || "",
          keyTakeaways: profile.keyTakeaways,
          transcripts: []
        };

        // Check if profile needs email
        if (!updatedProfile.email || updatedProfile.email === "") {
          const mappedEmail = profileEmails[profile.id];
          if (mappedEmail && mappedEmail.trim()) {
            updatedProfile.email = mappedEmail.trim();
            needsUpdate = true;
            console.log(`✅ Adding email ${mappedEmail} to profile ${profile.name}`);
          } else {
            errors.push(`❌ No email mapping for profile: ${profile.name}`);
            continue;
          }
        }

        // Process transcripts
        updatedProfile.transcripts = profile.transcripts.map((transcript: any) => {
          const updatedTranscript = {
            id: transcript.id,
            speakerName: transcript.speakerName,
            speakerRole: transcript.speakerRole,
            speakerEmail: transcript.speakerEmail || "",
            speakerPhoto: transcript.speakerPhoto || "",
            content: transcript.content,
            interviewDate: transcript.interviewDate || "",
            interviewedBy: transcript.interviewedBy || ""
          };

          // Check if transcript needs speaker email
          if (!updatedTranscript.speakerEmail || updatedTranscript.speakerEmail === "") {
            const mappedEmail = speakerEmails[transcript.speakerName];
            if (mappedEmail && mappedEmail.trim()) {
              updatedTranscript.speakerEmail = mappedEmail.trim();
              needsUpdate = true;
              console.log(`✅ Adding speaker email ${mappedEmail} for ${transcript.speakerName}`);
            } else {
              errors.push(`❌ No email mapping for speaker: ${transcript.speakerName}`);
            }
          }

          return updatedTranscript;
        });

        // Save if needed
        if (needsUpdate) {
          console.log(`🔄 Saving profile: ${profile.name}`);
          
          // Use direct Supabase save if possible, otherwise use dataProvider
          const storageType = dataProvider.getStorageType();
          
          if (storageType === 'supabase') {
            // Import Supabase function directly
            const { saveProfileToSupabase } = await import("@/lib/supabaseData");
            const success = await saveProfileToSupabase(updatedProfile);
            
            if (success) {
              updatedProfiles++;
              console.log(`✅ Successfully saved profile: ${profile.name}`);
            } else {
              errors.push(`❌ Supabase save failed for: ${profile.name}`);
            }
          } else {
            // Use regular dataProvider for localStorage
            const success = await dataProvider.saveProfile(updatedProfile);
            
            if (success) {
              updatedProfiles++;
              console.log(`✅ Successfully saved profile: ${profile.name}`);
            } else {
              errors.push(`❌ localStorage save failed for: ${profile.name}`);
            }
          }
        } else {
          console.log(`⏭️ Profile ${profile.name} already has all required fields`);
        }

      } catch (profileError) {
        const errorMsg = profileError instanceof Error ? profileError.message : String(profileError);
        console.error(`❌ Error processing profile ${profile.name}:`, profileError);
        errors.push(`❌ Failed to process ${profile.name}: ${errorMsg}`);
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

  } catch (globalError) {
    const errorMessage = globalError instanceof Error ? globalError.message : "Unknown error";
    console.error("❌ Global migration error:", globalError);
    
    return {
      success: false,
      message: `Migration failed: ${errorMessage}`,
      updatedProfiles,
      errors: [errorMessage, ...errors]
    };
  }
}

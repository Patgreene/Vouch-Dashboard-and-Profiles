-- Migration to add email fields to existing Vouch Profiles database
-- Run this AFTER creating a backup of your data
-- Run this in your Supabase SQL Editor

-- Step 1: Add email column to profiles table (allow NULL temporarily for migration)
ALTER TABLE profiles ADD COLUMN email TEXT;

-- Step 2: Add speaker_email column to transcripts table (allow NULL temporarily)
ALTER TABLE transcripts ADD COLUMN speaker_email TEXT;

-- Step 3: Create indexes for the new email fields
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_transcripts_speaker_email ON transcripts(speaker_email);

-- Step 4: Update existing profiles with placeholder emails
-- IMPORTANT: Replace these with actual emails before running!
UPDATE profiles SET email = 'danielle.davis@meta.com' WHERE id = 'danielle-davis';
UPDATE profiles SET email = 'alex.morgan@spotify.com' WHERE id = 'alex-morgan';
-- Add more profile email updates as needed:
-- UPDATE profiles SET email = 'patrick.greene@company.com' WHERE id = 'patrick-greene';

-- Step 5: Update existing transcripts with speaker emails
-- IMPORTANT: Replace these with actual emails before running!
UPDATE transcripts SET speaker_email = 'john.smith@meta.com' WHERE speaker_name = 'John Smith';
UPDATE transcripts SET speaker_email = 'sarah.chen@meta.com' WHERE speaker_name = 'Sarah Chen';  
UPDATE transcripts SET speaker_email = 'mike.rodriguez@meta.com' WHERE speaker_name = 'Mike Rodriguez';
UPDATE transcripts SET speaker_email = 'emma.wilson@spotify.com' WHERE speaker_name = 'Emma Wilson';
-- Add more speaker email updates as needed:
-- UPDATE transcripts SET speaker_email = 'patrick.greene@company.com' WHERE speaker_name = 'Patrick Greene';

-- Step 6: Verify all profiles have emails (should return 0 rows)
SELECT id, name FROM profiles WHERE email IS NULL OR email = '';

-- Step 7: Verify all transcripts have speaker emails (should return 0 rows)  
SELECT id, speaker_name FROM transcripts WHERE speaker_email IS NULL OR speaker_email = '';

-- Step 8: Make email fields NOT NULL after data migration
-- Only run this AFTER confirming all data has emails!
-- ALTER TABLE profiles ALTER COLUMN email SET NOT NULL;
-- ALTER TABLE transcripts ALTER COLUMN speaker_email SET NOT NULL;

-- Step 9: Add unique constraint to profile emails
-- Only run this AFTER confirming no duplicate emails!
-- ALTER TABLE profiles ADD CONSTRAINT unique_profile_email UNIQUE (email);

-- Final verification queries:
-- Check profile emails
SELECT id, name, email FROM profiles ORDER BY name;

-- Check speaker emails  
SELECT DISTINCT speaker_name, speaker_email FROM transcripts ORDER BY speaker_name;

-- Check for any duplicate emails (should return 0 rows)
SELECT email, COUNT(*) FROM profiles GROUP BY email HAVING COUNT(*) > 1;

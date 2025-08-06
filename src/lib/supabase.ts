import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.",
  );
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface DatabaseProfile {
  id: string;
  name: string;
  title: string;
  email: string;
  company?: string;
  photo?: string;
  linkedin?: string;
  cv?: string;
  portfolio?: string;
  key_takeaways: {
    strengths: string[];
    weaknesses: string[];
    communicationStyle: string[];
    waysToBringOutBest: string[];
  };
  created_at?: string;
  updated_at?: string;
}

export interface DatabaseTranscript {
  id: string;
  profile_id: string;
  speaker_name: string;
  speaker_role: string;
  speaker_email: string;
  speaker_photo?: string;
  interview_date?: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

export interface DatabaseAnalytics {
  id: string;
  profile_id: string;
  event_type: "page_view" | "quote_view" | "profile_created";
  metadata?: Record<string, any>;
  created_at?: string;
}

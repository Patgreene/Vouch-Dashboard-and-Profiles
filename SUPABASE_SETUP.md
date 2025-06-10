# Supabase Setup Instructions

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Set project name: `vouch-profiles`
5. Set a secure database password (save this!)
6. Choose a region close to your users
7. Click "Create new project"

## 2. Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the contents of `database/schema.sql`
4. Click "Run" to execute the SQL

This will create:

- `profiles` table for storing profile data
- `transcripts` table for storing reference transcripts
- `analytics` table for tracking page views and interactions
- Proper indexes and relationships
- Row Level Security policies

## 3. Get Your Credentials

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with https://)
   - **Anon public key** (starts with eyJ...)

## 4. Configure Environment Variables

1. Create a `.env` file in your project root
2. Add your Supabase credentials:

```bash
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 5. Migrate Existing Data

If you have existing profiles in localStorage:

1. Go to your admin dashboard
2. You'll see a "Migrate to Supabase" button
3. Click it to automatically transfer all profiles and analytics
4. Verify the data appears correctly

## 6. Test the Setup

1. Create a new profile in the admin dashboard
2. Visit the profile URL from a different browser/device
3. The profile should load from Supabase!

## 7. Deploy with Environment Variables

When deploying to production (Fly.io, Vercel, etc.), make sure to add your environment variables:

### Fly.io

```bash
fly secrets set VITE_SUPABASE_URL=your_url
fly secrets set VITE_SUPABASE_ANON_KEY=your_key
```

### Vercel

Add the environment variables in your Vercel dashboard under Settings → Environment Variables.

## Troubleshooting

### "Missing Supabase environment variables" error

- Make sure your `.env` file exists and has the correct variable names
- Restart your development server after adding environment variables

### Profiles not loading

- Check the browser console for error messages
- Verify your Supabase credentials are correct
- Make sure the database schema was created properly

### Permission errors

- Check that Row Level Security policies are set up correctly
- Verify the anon key has the right permissions

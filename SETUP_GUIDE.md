# HomeBeli Setup Guide

This guide will walk you through setting up HomeBeli from scratch.

## Quick Start Checklist

- [ ] Node.js 18+ installed
- [ ] Supabase account created
- [ ] Project cloned and dependencies installed
- [ ] Environment variables configured
- [ ] Supabase storage bucket created
- [ ] RLS policies configured
- [ ] Database migrated
- [ ] App running locally

## Detailed Setup Steps

### Step 1: System Requirements

Make sure you have:
- Node.js 18 or higher
- npm, yarn, or pnpm
- Git

Check your Node version:
```bash
node --version  # Should be 18.0.0 or higher
```

### Step 2: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: HomeBeli (or your choice)
   - **Database Password**: (save this securely!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free tier is fine for development
5. Wait for project to be created (~2 minutes)

### Step 3: Get Supabase Credentials

#### API Keys
1. In your Supabase project dashboard, go to **Settings** → **API**
2. Find and copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")
   - **service_role** key (click "Reveal" to see it)

#### Database Connection String
1. Go to **Settings** → **Database**
2. Scroll to "Connection string"
3. Select **Session mode** (recommended for serverless)
4. Copy the connection string
5. Replace `[YOUR-PASSWORD]` with your database password

### Step 4: Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd HomeBeli

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Step 5: Configure Environment

Create a `.env` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Database Connection (Use session pooler URL)
DATABASE_URL=postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

**Important Notes:**
- Replace all placeholder values with your actual credentials
- Never commit the `.env` file to version control
- Keep your `service_role` key secret

### Step 6: Create Storage Bucket

1. In Supabase dashboard, go to **Storage**
2. Click **New bucket**
3. Settings:
   - **Name**: `dish-images`
   - **Public bucket**: ✅ **Yes** (check this!)
   - **File size limit**: 50MB (or your preference)
4. Click **Create bucket**

#### Storage Policies (Optional but Recommended)

Add these policies to the `dish-images` bucket:

1. Go to **Storage** → **Policies** → `dish-images`
2. Click **New Policy**

**Read Policy:**
```sql
-- Allow anyone to read files
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'dish-images');
```

**Write Policy:**
```sql
-- Allow authenticated users to upload files to their own folder
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'dish-images' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

### Step 7: Set Up Authentication

#### Enable Google OAuth (Optional)

1. Go to **Authentication** → **Providers**
2. Find **Google** and click to configure
3. You'll need to:
   - Create a Google Cloud Project
   - Enable Google+ API
   - Create OAuth credentials
   - Add authorized redirect URIs:
     - `https://xxxxx.supabase.co/auth/v1/callback` (your Supabase URL)
4. Copy Client ID and Client Secret to Supabase
5. **Save** the configuration

#### Email Settings

1. Go to **Authentication** → **Email Templates**
2. Customize if desired (optional)
3. For development, check **Settings** → **Auth** → **Enable email confirmations**
   - You can disable this for faster development

### Step 8: Initialize Database

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations (creates tables)
npm run prisma:migrate

# When prompted, enter a migration name like "init"
```

This creates the `Profile` and `Dish` tables in your database.

### Step 9: Configure RLS Policies

Copy and paste this SQL into **SQL Editor** in Supabase:

```sql
-- Enable Row Level Security
ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Dish" ENABLE ROW LEVEL SECURITY;

-- Profile Policies
CREATE POLICY "Users can read own profile"
ON "Profile" FOR SELECT
USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own profile"
ON "Profile" FOR INSERT
WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own profile"
ON "Profile" FOR UPDATE
USING (auth.uid()::text = "userId");

-- Dish Policies
CREATE POLICY "Users can read own dishes"
ON "Dish" FOR SELECT
USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own dishes"
ON "Dish" FOR INSERT
WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own dishes"
ON "Dish" FOR UPDATE
USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own dishes"
ON "Dish" FOR DELETE
USING (auth.uid()::text = "userId");
```

Click **Run** to execute.

### Step 10: Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see the HomeBeli landing page! 🎉

### Step 11: Create Your First Account

1. Click **Sign In / Sign Up**
2. Create an account with email/password or Google
3. Verify your email (if email confirmation is enabled)
4. Start rating dishes!

## Optional: Seed Demo Data

If you want to populate your account with sample dishes:

1. **Create your user account first** through the app
2. Get your user ID:
   - Go to Supabase dashboard
   - **Authentication** → **Users**
   - Copy your User UID
3. Edit `prisma/seed.ts`:
   ```typescript
   const demoUserId = 'your-user-id-here' // Paste your UID here
   ```
4. Run the seed:
   ```bash
   npm run prisma:seed
   ```

## Troubleshooting

### "Cannot find module '@prisma/client'"

Run:
```bash
npm run prisma:generate
```

### Database Connection Error

- Check your `DATABASE_URL` is correct
- Ensure your password doesn't have special characters (or URL-encode them)
- Try the direct connection string instead of pooler
- Verify your IP isn't blocked in Supabase settings

### "Failed to fetch" or CORS Errors

- Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set correctly
- Restart your dev server after changing `.env`
- Check browser console for specific errors

### Authentication Issues

- Verify redirect URLs in Supabase match your local URL
- Check if email confirmation is required
- For Google OAuth, ensure redirect URIs are configured correctly

### Image Upload Fails

- Confirm `dish-images` bucket exists
- Check bucket is set to **public**
- Verify storage policies allow authenticated users to upload

### RLS "Permission Denied" Errors

- Ensure RLS policies are created (Step 9)
- Check that `userId` matches Supabase's `auth.uid()`
- Try disabling RLS temporarily to test:
  ```sql
  ALTER TABLE "Dish" DISABLE ROW LEVEL SECURITY;
  ```
  (Re-enable after testing!)

## Next Steps

- Customize bucket labels in `lib/constants.ts`
- Add more ingredients or recipe fields
- Customize the UI colors in `tailwind.config.ts`
- Deploy to Vercel or your preferred platform

## Getting Help

- Check the [README.md](./README.md) for more details
- Review Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
- Open an issue on GitHub

---

Happy cooking! 🍳


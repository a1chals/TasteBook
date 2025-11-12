# HomeBeli Quick Start

Get up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Supabase account (free tier is fine)

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Create `.env` File

```bash
# Copy the example and fill in your values
cp .env.example .env
```

Required variables:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=your_postgres_connection_string
```

### 3. Set Up Supabase

#### Create Storage Bucket
1. Go to **Storage** in Supabase dashboard
2. Create bucket named `dish-images`
3. Make it **public**

#### Run RLS Policies
Copy this SQL into **SQL Editor**:

```sql
ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Dish" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
ON "Profile" FOR SELECT
USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own profile"
ON "Profile" FOR INSERT
WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own profile"
ON "Profile" FOR UPDATE
USING (auth.uid()::text = "userId");

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

### 4. Initialize Database

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run prisma:generate # Generate Prisma client
npm run prisma:migrate  # Run migrations
npm run prisma:seed     # Seed demo data
npm run prisma:studio   # Open Prisma Studio GUI

# Code Quality
npm run lint            # Check for errors
npm run format          # Format code
npm test               # Run tests
```

## First Steps After Setup

1. **Sign Up**: Create your account at `/auth/signin`
2. **Rate Your First Dish**: Click "Rate a New Dish"
3. **Choose Category**: Select "Average" to start
4. **Fill Details**: Enter dish name (required) and any optional info
5. **Position It**: Drag to rank it (first dish goes at top by default)
6. **Save**: Click "Save Dish"

## Troubleshooting

### Database connection error?
- Check `DATABASE_URL` in `.env`
- Ensure you're using the **Session pooler** URL from Supabase

### Can't sign in?
- Verify Supabase URL and keys in `.env`
- Check if email confirmation is required (disable in Supabase → Auth settings for dev)

### Image upload fails?
- Confirm `dish-images` bucket exists
- Make sure bucket is set to **public**

### Permission denied errors?
- Run the RLS policies SQL from step 3
- Check policies exist in Supabase → Database → Policies

## Need More Help?

- **Detailed Setup**: See [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Full Documentation**: See [README.md](./README.md)
- **Project Overview**: See [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)

---

**You're all set! Start rating your dishes! 🍳**


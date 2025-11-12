# HomeBeli 🍳

**HomeBeli** is a personal ranking system for your homemade dishes. Rate, rank, and track your culinary creations with an intuitive drag-and-drop interface.

## Features

- 🎯 **Three-Tier Rating System**: Categorize dishes as "Not Great", "Average", or "Really Good"
- 📊 **Smart Scoring**: Automatically calculates scores (0-10) based on relative rankings within each category
- 🖼️ **Photo Upload**: Add photos of your dishes with Supabase Storage
- 🔄 **Drag & Drop Ranking**: Intuitively reorder dishes within categories
- 📝 **Detailed Dish Info**: Track ingredients, cooking time, recipes, and more
- 🔐 **Secure Authentication**: Email/password and Google OAuth via Supabase
- 🎨 **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: Supabase Auth (Email/Password + Google OAuth)
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Storage**: Supabase Storage
- **Drag & Drop**: dnd-kit
- **Validation**: Zod

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Supabase account and project
- PostgreSQL database (provided by Supabase)

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd HomeBeli
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project credentials:
   - Go to Project Settings > API
   - Copy the `Project URL` and `anon public` key
   - Copy the `service_role` key (keep this secret!)
3. Get your database connection string:
   - Go to Project Settings > Database
   - Copy the connection string (session pooler or direct connection)
   - Replace the password placeholder with your actual database password

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database
DATABASE_URL=your_postgres_connection_string
```

### 5. Set Up Supabase Storage Bucket

1. In your Supabase dashboard, go to Storage
2. Create a new **public** bucket named `dish-images`
3. Set the bucket to allow public access for reads

### 6. Configure Row Level Security (RLS)

Run the following SQL in your Supabase SQL Editor to set up RLS policies:

```sql
-- Enable RLS on the Dish table (if using Supabase's public schema)
-- Note: Since we're using Prisma, ensure your tables are in the right schema

-- Policy for users to read their own dishes
CREATE POLICY "Users can read their own dishes"
ON "Dish"
FOR SELECT
USING (auth.uid()::text = "userId");

-- Policy for users to insert their own dishes
CREATE POLICY "Users can insert their own dishes"
ON "Dish"
FOR INSERT
WITH CHECK (auth.uid()::text = "userId");

-- Policy for users to update their own dishes
CREATE POLICY "Users can update their own dishes"
ON "Dish"
FOR UPDATE
USING (auth.uid()::text = "userId");

-- Policy for users to delete their own dishes
CREATE POLICY "Users can delete their own dishes"
ON "Dish"
FOR DELETE
USING (auth.uid()::text = "userId");

-- Profile policies
CREATE POLICY "Users can read their own profile"
ON "Profile"
FOR SELECT
USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert their own profile"
ON "Profile"
FOR INSERT
WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update their own profile"
ON "Profile"
FOR UPDATE
USING (auth.uid()::text = "userId");
```

### 7. Set Up Google OAuth (Optional)

1. In Supabase Dashboard, go to Authentication > Providers
2. Enable Google provider
3. Follow Supabase's instructions to set up Google OAuth
4. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback` (development)
   - `https://your-domain.com/api/auth/callback` (production)

### 8. Initialize Database

Generate Prisma Client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

This will create the necessary database tables.

### 9. Seed Demo Data (Optional)

To populate your database with demo dishes:

1. First, create a user account through the app
2. Get your user ID from Supabase Dashboard > Authentication > Users
3. Update `prisma/seed.ts` and replace `demo-user-id` with your actual user ID
4. Run the seed script:

```bash
npm run prisma:seed
```

### 10. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
HomeBeli/
├── app/                      # Next.js 14 App Router
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication callbacks
│   │   ├── dishes/          # Dish CRUD operations
│   │   └── buckets/         # Bucket reordering
│   ├── auth/                # Auth pages
│   ├── dish/[id]/           # Dish detail page
│   ├── dishes/              # Dishes list page
│   ├── rate/                # Rate new dish flow
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── auth-guard.tsx       # Authentication guard
│   ├── bucket-selector.tsx  # Category selector
│   ├── dish-card.tsx        # Dish display card
│   ├── image-uploader.tsx   # Image upload component
│   └── rank-list.tsx        # Drag-and-drop ranking list
├── lib/                     # Utility libraries
│   ├── supabase/           # Supabase clients
│   ├── constants.ts        # App constants (buckets)
│   ├── score.ts            # Score computation logic
│   ├── prisma.ts           # Prisma client
│   └── utils.ts            # Utility functions
├── prisma/                  # Prisma configuration
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed script
├── __tests__/              # Test files
│   └── score.test.ts       # Score computation tests
├── middleware.ts           # Next.js middleware (auth)
├── package.json
└── README.md
```

## Key Concepts

### Score Computation

Dishes are scored on a 0-10 scale based on their position within each category:

- **Not Great**: 0 - 3.49
- **Average**: 3.5 - 6.99
- **Really Good**: 7 - 10

The score formula:
- Single dish in bucket: `score = (L + U) / 2`
- Multiple dishes: `score = L + ((U - L) * ((N - 1 - rankIndex) / (N - 1)))`

Where:
- `L` = lower bound of bucket
- `U` = upper bound of bucket
- `N` = number of dishes in bucket
- `rankIndex` = position in bucket (0 = best)

### Rating Flow

1. **Choose Bucket**: Select a category for your dish
2. **Enter Details**: Add name, ingredients, cooking time, recipe, and photo
3. **Rank It**: Drag and drop to position your dish within the category
4. **Save**: Scores are automatically calculated and saved

## Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Prisma
npm run prisma:generate # Generate Prisma Client
npm run prisma:migrate  # Run database migrations
npm run prisma:seed     # Seed demo data
npm run prisma:studio   # Open Prisma Studio

# Code Quality
npm run lint            # Run ESLint
npm run format          # Format code with Prettier
```

## Testing

Run the score computation tests:

```bash
npm test __tests__/score.test.ts
```

Note: You'll need to add a test runner like Jest. Install with:

```bash
npm install -D jest @types/jest ts-jest
```

Add to `package.json`:

```json
"scripts": {
  "test": "jest"
}
```

Create `jest.config.js`:

```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Ensure your platform supports:
- Node.js 18+
- PostgreSQL connection
- Environment variables

## Troubleshooting

### Database Connection Issues

- Verify your `DATABASE_URL` is correct
- Check if your IP is allowed in Supabase (Project Settings > Database > Connection Pooling)
- Try using the session pooler connection string for better reliability

### Authentication Issues

- Ensure redirect URLs are configured in Supabase
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Verify email confirmation is handled (check Supabase Auth settings)

### Image Upload Issues

- Confirm `dish-images` bucket exists and is public
- Check storage policies allow uploads for authenticated users
- Verify image file size doesn't exceed limits

### RLS Policy Issues

If you see "permission denied" errors:
- Ensure RLS policies are created correctly
- Verify `userId` in policies matches your user ID format
- Check that policies exist for all CRUD operations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ for home cooks everywhere**


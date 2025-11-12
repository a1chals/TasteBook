# HomeBeli - Project Overview

## What is HomeBeli?

HomeBeli is a personal dish ranking system that allows users to rate and organize their homemade dishes using an intelligent scoring system and intuitive drag-and-drop interface.

## Core Features

### 1. Three-Tier Categorization System
- **Not Great** (0-3.49): Dishes that didn't turn out well
- **Average** (3.5-6.99): Decent dishes, nothing special
- **Really Good** (7-10): Your best homemade creations

### 2. Intelligent Scoring Algorithm
- Scores are automatically calculated based on relative positioning within each category
- Uses a linear interpolation formula to distribute scores evenly
- Top-ranked dishes get higher scores, bottom-ranked get lower scores
- Recalculates automatically when dishes are reordered or moved between categories

### 3. Drag-and-Drop Ranking
- Intuitive interface powered by dnd-kit
- Real-time score preview as you drag
- Visual feedback showing the new dish in the list
- Smooth animations and transitions

### 4. Rich Dish Information
- Name (required)
- Ingredients list
- Cooking time in minutes
- Recipe notes or URL
- Photo upload with preview

### 5. Complete CRUD Operations
- **Create**: Multi-step flow to add new dishes
- **Read**: List view with filtering by category
- **Update**: Edit dish details, move between categories, reorder
- **Delete**: Remove dishes with confirmation

### 6. Secure Authentication
- Email/password authentication
- Google OAuth integration
- Row-Level Security (RLS) ensures users only see their own dishes
- Profile management

## Technical Architecture

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: React hooks, server components
- **Drag & Drop**: dnd-kit library

### Backend
- **API**: Next.js API Routes (serverless)
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma for type-safe database access
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage for images
- **Validation**: Zod for runtime type checking

### Database Schema

```prisma
model Profile {
  id        String   @id @default(uuid())
  userId    String   @unique
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Bucket {
  NOT_GREAT
  AVERAGE
  REALLY_GOOD
}

model Dish {
  id          String   @id @default(uuid())
  userId      String
  name        String
  bucket      Bucket
  rankIndex   Int
  score10     Float
  minutes     Int?
  ingredients Json?
  recipe      String?
  imageUrl    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId, bucket, rankIndex])
}
```

### Key Files Structure

```
HomeBeli/
├── app/
│   ├── api/                    # API endpoints
│   │   ├── dishes/            # Dish CRUD
│   │   │   ├── route.ts       # GET all, POST new
│   │   │   ├── [id]/route.ts  # GET, PUT, DELETE by ID
│   │   │   └── move/route.ts  # Move between buckets
│   │   ├── buckets/
│   │   │   └── [bucket]/reorder/route.ts  # Reorder within bucket
│   │   └── auth/
│   │       └── callback/route.ts  # OAuth callback
│   ├── auth/signin/page.tsx    # Sign in/up page
│   ├── dish/[id]/page.tsx      # Dish detail page
│   ├── dishes/page.tsx         # Dishes list
│   ├── rate/page.tsx           # Rate new dish flow
│   └── page.tsx                # Home page
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── auth-guard.tsx          # Protected route wrapper
│   ├── bucket-selector.tsx     # Category selector
│   ├── dish-card.tsx           # Dish display card
│   ├── image-uploader.tsx      # Image upload component
│   ├── rank-list.tsx           # Drag-and-drop list
│   ├── confirm-dialog.tsx      # Confirmation modal
│   └── empty-state.tsx         # No dishes placeholder
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser Supabase client
│   │   ├── server.ts           # Server Supabase client
│   │   └── storage.ts          # Storage helpers
│   ├── constants.ts            # Bucket definitions
│   ├── score.ts                # Score calculation logic
│   ├── prisma.ts               # Prisma client
│   └── utils.ts                # Utilities (cn helper)
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Seed data script
└── __tests__/
    └── score.test.ts           # Score calculation tests
```

## Scoring Algorithm Explained

### Formula

For a bucket with bounds [L, U] and N dishes:

**Single dish:**
```
score = (L + U) / 2
```

**Multiple dishes:**
```
score = L + ((U - L) * ((N - 1 - rankIndex) / (N - 1)))
```

Where:
- `L` = Lower bound (e.g., 0 for "Not Great")
- `U` = Upper bound (e.g., 3.49 for "Not Great")
- `N` = Total number of dishes in bucket
- `rankIndex` = Position in bucket (0 = top/best)

### Example

"Really Good" bucket with 4 dishes:
- L = 7, U = 10, N = 4

Rankings:
1. Dish A (rankIndex=0): `7 + (3 * (3/3))` = **10.00**
2. Dish B (rankIndex=1): `7 + (3 * (2/3))` = **9.00**
3. Dish C (rankIndex=2): `7 + (3 * (1/3))` = **8.00**
4. Dish D (rankIndex=3): `7 + (3 * (0/3))` = **7.00**

The top dish gets the maximum score (10), the bottom gets the minimum (7), and others are distributed evenly.

## User Flows

### 1. Rating a New Dish

1. Click "Rate a New Dish"
2. **Step 1**: Choose category (Not Great, Average, Really Good)
3. **Step 2**: Enter dish details (name, ingredients, time, recipe, photo)
4. **Step 3**: Drag to position the dish in the rankings
5. Save → Scores recalculated for entire bucket

### 2. Viewing Dishes

1. Go to "My Dishes"
2. See all dishes or filter by category
3. Each card shows: name, photo, score, category, time
4. Click any dish to view details

### 3. Managing a Dish

From dish detail page:
- **Edit Details**: Update name, ingredients, time, recipe
- **Move to Another Category**: Change category and position
- **Delete**: Remove dish permanently

## Security Model

### Row-Level Security (RLS)

All database operations are secured with RLS policies:

```sql
-- Users can only access their own dishes
POLICY "Users can read own dishes"
ON "Dish" FOR SELECT
USING (auth.uid()::text = "userId");
```

### Authentication Flow

1. User signs in with email/password or Google OAuth
2. Supabase creates session with JWT token
3. Token stored in HTTP-only cookies
4. Middleware validates session on each request
5. API routes verify user identity before operations

### Storage Security

- Images stored in user-specific folders: `{userId}/{dishId}.jpg`
- Bucket policies ensure users can only upload to their own folders
- Public read access for displaying images

## Performance Optimizations

1. **Server Components**: Most pages are server-rendered for fast initial load
2. **Optimistic Updates**: UI updates immediately, syncs with server
3. **Image Optimization**: Next.js Image component with automatic optimization
4. **Database Indexes**: Index on `[userId, bucket, rankIndex]` for fast queries
5. **Connection Pooling**: Supabase session pooler for serverless environments

## Future Enhancements

### Potential Features
- Dark mode toggle
- Export dishes to PDF/CSV
- Share rankings with friends
- Meal planning integration
- Recipe import from URLs
- Nutrition tracking
- Cost per dish
- Difficulty ratings
- Tags/categories beyond buckets
- Search and advanced filtering
- Batch operations
- Dish history/versions

### Technical Improvements
- React Native mobile app
- Progressive Web App (PWA)
- Offline support
- Image compression pipeline
- Advanced analytics
- Collaborative rankings
- Integration with recipe websites
- AI-powered suggestions

## Testing Strategy

### Current Tests
- Score calculation logic unit tests
- Edge cases (single dish, many dishes, boundary values)

### Recommended Additional Tests
- API endpoint integration tests
- Component unit tests
- E2E tests with Playwright/Cypress
- Authentication flow tests
- Image upload tests
- RLS policy tests

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] RLS policies enabled
- [ ] Storage bucket created and public
- [ ] OAuth providers configured
- [ ] Domain added to Supabase allowed list
- [ ] Email templates customized
- [ ] Error monitoring set up (e.g., Sentry)
- [ ] Analytics configured (optional)

## Support & Resources

- **Documentation**: See README.md and SETUP_GUIDE.md
- **Contributing**: See CONTRIBUTING.md
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs

---

Built with ❤️ for home cooks everywhere


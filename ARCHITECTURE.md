# HomeBeli Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Next.js 14 App (React)                   │  │
│  │                                                        │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │  │
│  │  │  Pages   │  │Components│  │  Hooks   │           │  │
│  │  │          │  │          │  │          │           │  │
│  │  │ • Home   │  │• RankList│  │• useState│           │  │
│  │  │ • Rate   │  │• DishCard│  │• useToast│           │  │
│  │  │ • Dishes │  │• BucketS │  │• useRouter          │  │
│  │  │ • Detail │  │• AuthG   │  │          │           │  │
│  │  └──────────┘  └──────────┘  └──────────┘           │  │
│  │                                                        │  │
│  │  ┌──────────────────────────────────────────────┐    │  │
│  │  │         Supabase Client (Browser)            │    │  │
│  │  │    • Auth • Database Queries • Storage       │    │  │
│  │  └──────────────────────────────────────────────┘    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              │
┌─────────────────────────────▼─────────────────────────────────┐
│                          SERVER                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              Next.js API Routes                          │  │
│  │                                                           │  │
│  │  /api/dishes         /api/dishes/[id]    /api/dishes/move│  │
│  │  • GET (list)       • GET (detail)       • POST (move)   │  │
│  │  • POST (create)    • PUT (update)                       │  │
│  │                     • DELETE              /api/buckets   │  │
│  │                                          • PUT (reorder)  │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────┐    │  │
│  │  │         Auth Middleware                         │    │  │
│  │  │    Validates user session on every request      │    │  │
│  │  └─────────────────────────────────────────────────┘    │  │
│  └─────────────────────────────────────────────────────────┘  │
│                              │                                 │
│                    ┌─────────┴──────────┐                     │
│                    │                    │                      │
│  ┌─────────────────▼──────┐  ┌─────────▼──────────────┐      │
│  │   Prisma ORM           │  │  Supabase Server       │      │
│  │   • Type-safe queries  │  │  • Auth verification   │      │
│  │   • Migrations         │  │  • Session management  │      │
│  │   • Schema validation  │  │                        │      │
│  └────────────┬───────────┘  └────────────────────────┘      │
└───────────────┼───────────────────────────────────────────────┘
                │
                │ SQL over SSL
                │
┌───────────────▼───────────────────────────────────────────────┐
│                      SUPABASE                                  │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                 PostgreSQL Database                      │  │
│  │  ┌──────────────────┐      ┌──────────────────┐        │  │
│  │  │  Profile Table   │      │   Dish Table     │        │  │
│  │  │                  │      │                  │        │  │
│  │  │ • id             │      │ • id             │        │  │
│  │  │ • userId   ──────┼──────┼─• userId         │        │  │
│  │  │ • email          │      │ • name           │        │  │
│  │  │ • name           │      │ • bucket         │        │  │
│  │  │ • createdAt      │      │ • rankIndex      │        │  │
│  │  │ • updatedAt      │      │ • score10        │        │  │
│  │  └──────────────────┘      │ • ingredients    │        │  │
│  │                            │ • minutes        │        │  │
│  │  ┌──────────────────┐      │ • recipe         │        │  │
│  │  │       RLS        │      │ • imageUrl       │        │  │
│  │  │   Policies       │      │ • createdAt      │        │  │
│  │  │   (Security)     │      │ • updatedAt      │        │  │
│  │  └──────────────────┘      └──────────────────┘        │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                    Auth System                           │  │
│  │  • Email/Password                                        │  │
│  │  • Google OAuth                                          │  │
│  │  • JWT Tokens                                            │  │
│  │  • Session Management                                    │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              Storage (dish-images bucket)                │  │
│  │  • Public bucket for dish photos                         │  │
│  │  • Path: {userId}/{dishId}.{ext}                         │  │
│  │  • Policies: User uploads to own folder only            │  │
│  └─────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Creating a New Dish

```
User                 Client              Server              Database
  │                    │                   │                    │
  │  1. Fill form      │                   │                    │
  │  2. Upload image   │                   │                    │
  │  3. Drag to rank   │                   │                    │
  │  4. Click "Save"   │                   │                    │
  ├──────────────────►│                   │                    │
  │                    │ 5. Upload image   │                    │
  │                    ├──────────────────►│                    │
  │                    │                   │ 6. Store in bucket│
  │                    │                   ├──────────────────►│
  │                    │ 7. Get URL        │                    │
  │                    │◄──────────────────┤                    │
  │                    │                   │                    │
  │                    │ 8. POST /api/dishes                   │
  │                    │   {name, bucket, orderedIds...}       │
  │                    ├──────────────────►│                    │
  │                    │                   │ 9. Verify user     │
  │                    │                   │ 10. Compute scores │
  │                    │                   │ 11. INSERT dish    │
  │                    │                   ├──────────────────►│
  │                    │                   │ 12. UPDATE ranks   │
  │                    │                   ├──────────────────►│
  │                    │                   │ 13. Confirm        │
  │                    │                   │◄──────────────────┤
  │                    │ 14. Return dish   │                    │
  │                    │◄──────────────────┤                    │
  │ 15. Show success   │                   │                    │
  │◄──────────────────┤                   │                    │
  │ 16. Redirect       │                   │                    │
```

### Reordering Dishes

```
User                 Client              Server              Database
  │                    │                   │                    │
  │  1. Drag dish      │                   │                    │
  │  2. Drop at pos    │                   │                    │
  ├──────────────────►│                   │                    │
  │                    │ 3. Update UI      │                    │
  │◄──────────────────┤    (optimistic)   │                    │
  │                    │                   │                    │
  │                    │ 4. PUT /api/buckets/{bucket}/reorder  │
  │                    │   {orderedIds: [...]}                 │
  │                    ├──────────────────►│                    │
  │                    │                   │ 5. Verify user     │
  │                    │                   │ 6. Compute scores  │
  │                    │                   │ 7. UPDATE all ranks│
  │                    │                   ├──────────────────►│
  │                    │                   │ 8. Confirm         │
  │                    │                   │◄──────────────────┤
  │                    │ 9. Return updated │                    │
  │                    │◄──────────────────┤                    │
  │ 10. Confirm UI     │                   │                    │
  │◄──────────────────┤                   │                    │
```

## Component Hierarchy

```
App Layout (layout.tsx)
│
├── Home Page (page.tsx)
│   ├── If Not Authenticated
│   │   └── Landing Page
│   │       ├── Hero Section
│   │       ├── Sign In Card
│   │       └── Features Grid
│   │
│   └── If Authenticated
│       └── Dashboard
│           ├── Welcome Header
│           ├── "Rate New Dish" Card
│           └── "See My Dishes" Card
│
├── Sign In Page (/auth/signin/page.tsx)
│   ├── Email/Password Form
│   └── Google OAuth Button
│
├── Rate Page (/rate/page.tsx) [AuthGuard]
│   ├── Step 1: Bucket Selector
│   ├── Step 2: Dish Form
│   │   ├── Name Input
│   │   ├── Ingredients Textarea
│   │   ├── Minutes Input
│   │   ├── Recipe Textarea
│   │   └── Image Uploader
│   └── Step 3: Rank List
│       └── Sortable Items
│
├── Dishes Page (/dishes/page.tsx) [AuthGuard]
│   ├── Header with Actions
│   ├── Tabs (All, Not Great, Average, Really Good)
│   └── Dish Cards Grid
│       └── Dish Card (for each dish)
│           ├── Image
│           ├── Name & Score
│           ├── Bucket Badge
│           └── "View Details" Button
│
└── Dish Detail Page (/dish/[id]/page.tsx) [AuthGuard]
    ├── Image (full width)
    ├── Dish Info
    │   ├── Name & Score
    │   ├── Bucket Badge
    │   ├── Time & Date
    │   ├── Ingredients List
    │   └── Recipe
    ├── Action Buttons
    │   ├── Edit Dialog
    │   ├── Move Dialog
    │   └── Delete Dialog
    └── Dialogs
        ├── Edit Dialog
        │   └── Edit Form
        ├── Move Dialog
        │   ├── Bucket Selector
        │   └── Rank List
        └── Confirm Delete Dialog
```

## Authentication Flow

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ 1. Navigate to /auth/signin
       │
       ▼
┌─────────────────────────┐
│   Sign In Page          │
│  • Email/Password form  │
│  • Google OAuth button  │
└──────┬──────────────────┘
       │
       │ 2. Submit credentials
       │
       ▼
┌─────────────────────────┐
│   Supabase Auth         │
│  • Verify credentials   │
│  • Create session       │
│  • Issue JWT token      │
└──────┬──────────────────┘
       │
       │ 3. Set HTTP-only cookie
       │
       ▼
┌─────────────────────────┐
│   Middleware            │
│  • Refresh session      │
│  • Update cookie        │
└──────┬──────────────────┘
       │
       │ 4. Redirect to /dishes
       │
       ▼
┌─────────────────────────┐
│   Protected Page        │
│  • AuthGuard checks     │
│  • Render if authed     │
└─────────────────────────┘
```

## Score Calculation Flow

```
Input: orderedIds = [id1, id2, id3]
       bucket = "REALLY_GOOD"

Step 1: Get Bucket Bounds
┌──────────────────────────┐
│ getBucketBounds(bucket)  │
│ Returns: {L: 7, U: 10}   │
└─────────┬────────────────┘
          │
          ▼
Step 2: Compute Scores
┌───────────────────────────────────────────────┐
│ computeScoresForOrder(orderedIds, bounds)     │
│                                                │
│ N = 3 dishes                                   │
│                                                │
│ For each dish at rankIndex i:                  │
│   score = L + ((U - L) * ((N-1-i) / (N-1)))   │
│                                                │
│ Results:                                       │
│   id1: rankIndex=0, score=10.00  (top)        │
│   id2: rankIndex=1, score=8.50   (middle)     │
│   id3: rankIndex=2, score=7.00   (bottom)     │
└─────────┬─────────────────────────────────────┘
          │
          ▼
Step 3: Update Database
┌───────────────────────────┐
│ UPDATE Dish               │
│ SET rankIndex=?, score10=?│
│ WHERE id=?                │
│                           │
│ (for each dish)           │
└───────────────────────────┘
```

## Database Schema Relationships

```
┌──────────────────┐
│   auth.users     │  (Supabase Auth)
│  ┌────────────┐  │
│  │ id (UUID)  │◄─┼──────┐
│  │ email      │  │      │
│  │ ...        │  │      │
│  └────────────┘  │      │
└──────────────────┘      │
                          │ Foreign Key (userId)
┌──────────────────┐      │
│   Profile        │      │
│  ┌────────────┐  │      │
│  │ id         │  │      │
│  │ userId  ───┼──┼──────┘
│  │ email      │  │
│  │ name       │  │
│  └────────────┘  │
└──────────────────┘
        ▲
        │ Referenced by
        │
┌───────┴───────────┐
│   Dish            │
│  ┌──────────────┐ │
│  │ id           │ │
│  │ userId  ─────┼─┘ (no FK constraint, just reference)
│  │ name         │
│  │ bucket       │ ◄──── Enum: NOT_GREAT | AVERAGE | REALLY_GOOD
│  │ rankIndex    │
│  │ score10      │
│  │ ingredients  │ ◄──── JSON: string[]
│  │ minutes      │
│  │ recipe       │
│  │ imageUrl     │
│  │ createdAt    │
│  │ updatedAt    │
│  └──────────────┘
│
│  Indexes:
│  ├─ (userId, bucket, rankIndex)  ← Composite for fast bucket queries
│  └─ id (primary)
└────────────────────┘
```

## Security Layers

```
┌──────────────────────────────────────────────────────────────┐
│                     Security Layers                           │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Layer 1: HTTPS                                               │
│  └─ All traffic encrypted                                     │
│                                                               │
│  Layer 2: Authentication                                      │
│  ├─ Supabase Auth verifies identity                          │
│  ├─ JWT tokens in HTTP-only cookies                          │
│  └─ Session refresh via middleware                           │
│                                                               │
│  Layer 3: Authorization (RLS)                                 │
│  ├─ Row-Level Security on tables                             │
│  ├─ Users can only access own data                           │
│  └─ Enforced at database level                               │
│                                                               │
│  Layer 4: API Route Protection                                │
│  ├─ getUser() verifies session                               │
│  ├─ userId validation on every operation                     │
│  └─ Return 401 if unauthorized                               │
│                                                               │
│  Layer 5: Input Validation                                    │
│  ├─ Zod schemas for all inputs                               │
│  ├─ Type checking with TypeScript                            │
│  └─ Sanitization of user data                                │
│                                                               │
│  Layer 6: Storage Security                                    │
│  ├─ User-specific folders                                     │
│  ├─ Bucket policies                                           │
│  └─ File size limits                                          │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

## Deployment Architecture (Vercel)

```
┌──────────────────────────────────────────────────────────────┐
│                      Vercel Edge Network                      │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                    CDN / Edge                           │  │
│  │  • Static assets cached                                 │  │
│  │  • Images optimized                                     │  │
│  │  • Global distribution                                  │  │
│  └──────────────────┬─────────────────────────────────────┘  │
│                     │                                         │
│  ┌──────────────────▼─────────────────────────────────────┐  │
│  │              Serverless Functions                       │  │
│  │  • API Routes (on-demand)                               │  │
│  │  • SSR Pages (on-demand)                                │  │
│  │  • Auto-scaling                                         │  │
│  └──────────────────┬─────────────────────────────────────┘  │
└────────────────────┬┼─────────────────────────────────────────┘
                     ││
           ┌─────────┘└──────────┐
           │                     │
           ▼                     ▼
┌────────────────────┐  ┌────────────────────┐
│   Supabase         │  │   Supabase         │
│   Database         │  │   Storage          │
│                    │  │                    │
│ • PostgreSQL       │  │ • Object storage   │
│ • Connection pool  │  │ • CDN delivery     │
│ • Automatic backup │  │ • Transformations  │
└────────────────────┘  └────────────────────┘
```

---

This architecture ensures:
- ✅ Security through multiple layers
- ✅ Scalability with serverless functions
- ✅ Performance with edge caching
- ✅ Reliability with managed services
- ✅ Type safety throughout the stack


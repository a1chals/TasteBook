# HomeBeli - Revolut-Style UI

A beautiful, mobile-first web app for rating and ranking homemade dishes with a clean, modern UI inspired by Revolut.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) to see the app.

## 🎨 Features

- **Home Page**: Gradient header with stats, quick access cards, and recent dishes
- **Dishes Page**: Gallery/List toggle, bucket filters, and sort options
- **Dish Detail**: Hero image, full details, and delete functionality
- **Rate Flow**: 3-step process (bucket → details → confirm)
- **Profile**: User stats and category distribution

## 🛠️ Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (mobile-first design)
- **shadcn/ui** components
- **Zustand** for state management
- **Framer Motion** for animations
- **lucide-react** for icons

## 📱 UI Design

The UI is inspired by Revolut's mobile app with:

- Clean cards with rounded corners
- Soft gradients (violet → fuchsia → emerald)
- Pill-shaped filters and badges
- Photo-forward dish tiles
- Floating action button (FAB)
- Bottom navigation
- Glass-morphism effects

## 🎯 Pages

- `/` - Home with welcome cards
- `/rate` - 3-step rating flow
- `/dishes` - Browse all dishes (gallery/list view)
- `/dish/[id]` - Individual dish details
- `/profile` - User profile and stats

## 📦 Mock Data

The app uses Zustand with pre-seeded sample dishes and Unsplash images. No backend required for this UI-only version.

## 🎨 Color Palette

- Primary gradient: `from-violet-500 via-fuchsia-500 to-emerald-400`
- Background: `neutral-50`
- Cards: `white` with soft shadows
- Text: `neutral-900` (primary), `neutral-600` (secondary)

## 📱 Responsive Design

Mobile-first approach with:
- Max width: `max-w-md` (centered on desktop)
- Optimized for 375-480px screens
- Scales beautifully to larger screens

Enjoy building with HomeBeli! 🍳


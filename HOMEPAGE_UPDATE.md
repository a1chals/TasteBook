# Homepage Redesign - Clean & Simple

## ✨ What Changed

The homepage has been completely simplified with a beautiful stacked card design inspired by modern UI patterns.

## 🎨 New Design

### Clean Layout
- **Minimal header** with HomeBeli branding and tagline
- **Centered content** with clear call-to-action
- **Stacked interactive cards** with hover effects
- **Bottom navigation** for easy access

### Two Main Actions

#### Card 1: Rate a New Dish (Front)
- **Icon**: Plus icon in violet
- **Title**: "Rate a New Dish"
- **Description**: "Add and rank your latest creation"
- **Action**: Links to `/rate` page
- **Hover**: Lifts up on hover, reveals grayscale → color

#### Card 2: View Your Dishes (Back)
- **Icon**: List icon in emerald
- **Title**: "View Your Dishes"
- **Description**: "Browse and manage X dishes"
- **Action**: Links to `/dishes` page
- **Hover**: Lifts up on hover, reveals grayscale → color

## 🎯 Features

### Stacked Card Design
- Cards are visually stacked with perspective
- Hover reveals the back card
- Smooth transitions and animations
- Grayscale filter on inactive state
- Color reveal on hover
- Skewed design for modern look

### Interactive
- Click any card to navigate
- Front card → Rate page
- Back card → Dishes page
- Smooth routing with Next.js

### Responsive
- Centered on all screen sizes
- Works beautifully on mobile and desktop
- Maintains aspect ratio
- Touch-friendly on mobile

## 🛠️ Technical Implementation

### New Component: DisplayCards
Location: `/components/ui/display-cards.tsx`

Features:
- Reusable card component
- Configurable icons, titles, descriptions
- Stacked grid layout
- Custom hover animations
- Click handling support

### Updated Homepage
Location: `/app/page.tsx`

Structure:
```tsx
- Header (HomeBeli branding)
- Main Content (centered)
  - Title & subtitle
  - Stacked cards (2 cards)
- Bottom Navigation
```

### Dependencies
- `lucide-react` - Icons (Plus, List)
- `next/navigation` - Router for navigation
- `zustand` - State management (dish count)

## 🎨 Design System

### Colors
- **Violet**: Rate action (Plus icon)
- **Emerald**: View action (List icon)
- **Gradient**: Header text (violet → fuchsia → emerald)

### Typography
- **Header**: 3xl, bold, gradient text
- **Card titles**: lg, medium
- **Descriptions**: base, muted

### Spacing
- Clean, generous padding
- Centered layout with max-width
- Consistent gap between elements

## 📱 User Experience

### Clear Intent
- Immediately shows two main actions
- No clutter or distraction
- Beautiful, modern design
- Hover feedback for interactivity

### Navigation Flow
1. Land on homepage
2. See two stacked cards
3. Hover to reveal back card
4. Click to navigate:
   - Front card → Start rating
   - Back card → View collection

### Mobile Friendly
- Touch targets are large
- No hover dependency (cards always visible)
- Bottom nav for easy thumb access
- Responsive layout

## ✅ What's Better

### Before
- Busy gradient header with stats
- Multiple action cards
- Recent dishes section
- Information overload

### After
- Clean, minimal header
- Two clear actions
- Beautiful stacked design
- Focused experience
- Less is more

## 🚀 Live Now

The new homepage is running at **http://localhost:3000**

### Try It:
1. Hover over the cards to see animations
2. Click "Rate a New Dish" to start rating
3. Click "View Your Dishes" to browse collection
4. Use bottom nav for quick access

---

**Clean. Simple. Beautiful.** 🎉


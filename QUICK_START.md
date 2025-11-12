# HomeBeli - Quick Start Guide

## 🚀 Launch the App

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

## 📱 Navigation

### Bottom Nav
- **🏠 Home**: Welcome page with stats and recent dishes
- **📋 Dishes**: Browse all dishes (gallery/list view)
- **👤 Profile**: User stats and analytics

### Floating Button
- **➕ Rate**: Quick access to rate a new dish (visible on all pages)

## 🎯 Pages Overview

### 1. Home (`/`)
**What you'll see:**
- Gradient header with your stats (Total, Avg Score, This Week)
- Two big action cards
- Recent dishes carousel

**Actions:**
- Click "Rate a New Dish" → Start rating flow
- Click "See My Dishes" → View all dishes
- Tap any recent dish → View details

---

### 2. Dishes (`/dishes`)
**What you'll see:**
- Toggle between Gallery (grid) and List views
- Filter pills (All, Not Great, Average, Really Good)
- Sort dropdown (Newest, Highest, Fastest)
- Photo cards or compact rows

**Actions:**
- Switch view: Click grid/list icon (top right)
- Filter: Tap any pill to filter by bucket
- Sort: Select from dropdown
- View dish: Click any card/row

---

### 3. Rate (`/rate`)
**3-Step Flow:**

**Step 1: Choose Bucket**
- Select: Not Great / Average / Really Good
- See score range and description
- Click "Continue"

**Step 2: Add Details**
- Enter dish name (required)
- Add ingredients (one per line)
- Set cooking time (minutes)
- Add recipe (text or URL)
- Paste image URL (live preview)
- Click "Continue"

**Step 3: Confirm**
- Review your dish
- See current bucket info
- Click "Save Dish"

---

### 4. Dish Detail (`/dish/[id]`)
**What you'll see:**
- Hero image with gradient
- Dish name and score
- Time, date, category
- Ingredients list
- Recipe (text or link)
- Edit/Delete buttons

**Actions:**
- Back: Click arrow (top left)
- Delete: Click delete → Confirm
- Edit: (disabled for demo)

---

### 5. Profile (`/profile`)
**What you'll see:**
- Stats cards (Total, Avg Score, Avg Minutes)
- Top-rated dish
- Category distribution (progress bars)
- Time statistics

---

## 🍽️ Sample Dishes

**9 pre-loaded dishes across all buckets:**

### Really Good (3)
1. 🥞 Fluffy Pancakes (9.2) - 15 min
2. 🍝 Creamy Carbonara (8.7) - 25 min
3. 🍛 Butter Chicken Curry (8.1) - 45 min

### Average (3)
1. 🍣 Salmon Sushi Roll (6.4) - 30 min
2. 🍔 Classic Burger (5.8) - 20 min
3. 🌮 Street Tacos (5.2) - 20 min

### Not Great (3)
1. 🍜 Tonkotsu Ramen (3.1) - 90 min
2. 🥗 Garden Salad (2.3) - 10 min
3. 🥩 Grilled Ribeye (1.8) - 25 min

---

## 🎨 Visual Guide

### Score Colors
- 🟢 **7.0-10.0**: Emerald (Really Good)
- 🟡 **3.5-6.9**: Amber (Average)
- 🔴 **0-3.4**: Rose (Not Great)

### Button Colors
- **Purple gradient**: Primary actions (Rate, Save)
- **White**: Secondary actions (View, Cancel)
- **Red**: Destructive actions (Delete)

---

## 💡 Tips

### Adding a New Dish
1. Click the ➕ button (bottom right)
2. Choose how good it was
3. Add name + optional details
4. Save!

### Using Filters
- Filter by bucket to focus on specific categories
- Sort by score to see your best/worst
- Sort by time to find quick recipes

### Image URLs
Use any image URL (Unsplash recommended):
```
https://images.unsplash.com/photo-[id]?auto=format&fit=crop&w=1200&q=80
```

### Mobile Experience
- Best viewed on mobile (375-480px)
- Works great on desktop too (centered, max-width)
- All touch targets are 44px+ for easy tapping

---

## 🛠️ Common Tasks

### View All Dishes
1. Tap "Dishes" in bottom nav
2. Choose Gallery or List view
3. Filter/sort as needed

### Rate a Dish
1. Tap ➕ button anywhere
2. Follow 3-step flow
3. Dish appears in your collection

### Delete a Dish
1. Open dish detail page
2. Tap "Delete" button
3. Confirm deletion

### Check Stats
1. Go to Profile tab
2. See total dishes, avg score
3. View category breakdown

---

## 🎯 Next Steps

### Try These Actions:
1. ✅ Browse all 9 sample dishes
2. ✅ Rate your own dish
3. ✅ Toggle Gallery/List view
4. ✅ Filter by bucket
5. ✅ Sort by different criteria
6. ✅ View dish details
7. ✅ Check your profile stats
8. ✅ Delete a dish

### Customize:
- Add your own dishes
- Try different images
- Play with filters
- Explore the UI

---

## 📚 Documentation

- **IMPLEMENTATION_SUMMARY.md**: Complete technical details
- **WHATS_NEW.md**: What changed in this version
- **README_UI.md**: Overview and features

---

**Enjoy HomeBeli! 🍳**

Questions? The code is clean and well-commented. Just explore! 🚀


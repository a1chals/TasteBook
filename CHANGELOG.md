# Changelog

All notable changes to HomeBeli will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-11-12

### Added
- Initial release of HomeBeli
- Three-tier dish categorization system (Not Great, Average, Really Good)
- Intelligent scoring algorithm with linear interpolation
- Drag-and-drop ranking interface with dnd-kit
- Multi-step dish rating flow
- Complete CRUD operations for dishes
- Image upload with Supabase Storage
- Email/password authentication
- Google OAuth integration
- Row-Level Security (RLS) for data isolation
- Responsive UI with Tailwind CSS and shadcn/ui
- Dish detail page with full information display
- Move dishes between categories
- Edit dish details
- Delete dishes with confirmation
- Empty states and loading indicators
- Toast notifications for user feedback
- Prisma ORM for type-safe database access
- Comprehensive documentation (README, Setup Guide, Quick Start, Deployment Guide)
- Unit tests for score calculation logic
- Database seed script with demo data
- ESLint and Prettier configuration
- TypeScript for type safety throughout

### Features
- **Authentication**: Secure login with Supabase Auth
- **Dish Management**: Add, view, edit, delete, and reorder dishes
- **Smart Scoring**: Automatic score calculation based on ranking
- **Photo Upload**: Store dish images in Supabase Storage
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Optimistic UI updates for better UX
- **Category Filtering**: View dishes by category or see all
- **Detailed Views**: Rich dish information including ingredients, recipe, and cooking time

### Technical
- Built with Next.js 14 (App Router)
- TypeScript for type safety
- Tailwind CSS for styling
- shadcn/ui components
- Supabase for backend (Auth, Database, Storage)
- Prisma as ORM
- dnd-kit for drag-and-drop
- Zod for validation

## [Unreleased]

### Planned Features
- Dark mode support
- Export dishes to PDF/CSV
- Share rankings with friends
- Meal planning integration
- Recipe import from URLs
- Nutrition information tracking
- Cost tracking per dish
- Difficulty ratings
- Tags and custom categories
- Advanced search and filtering
- Batch operations
- Mobile app (React Native)

---

For more details on upcoming features, see [CONTRIBUTING.md](./CONTRIBUTING.md)


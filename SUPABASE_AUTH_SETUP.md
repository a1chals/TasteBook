# Supabase Authentication Setup Guide

## ✅ Authentication is Now Integrated!

Your TasteBook app now has full Supabase authentication! Here's what's set up:

## 🎯 What's Working

### Authentication Flow
1. **Homepage** - Shows sign in button if not authenticated
2. **Magic Link Sign In** - Email-based passwordless authentication
3. **Auth Callback** - Handles email link verification
4. **Protected Routes** - Dishes, Rate, and Profile pages require login
5. **Sign Out** - Clean logout functionality

### Files Added/Updated

#### New Files:
- `/app/auth/signin/page.tsx` - Sign in page with email input
- `/app/auth/callback/route.ts` - OAuth callback handler

#### Updated Files:
- `/app/page.tsx` - Now checks authentication state
- Middleware already configured for auth

## 🔑 Your Supabase Credentials

Your `.env` file should already have these credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://nrasgqqnvyjryatjxhhv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=your-pooler-connection-string
DIRECT_URL=your-direct-connection-string
```

## 🚀 How to Use

### For Users:

1. **Visit Homepage** - http://localhost:3000
2. **Click "Sign In"** or "Get Started"
3. **Enter your email**
4. **Check email for magic link**
5. **Click the link** to sign in
6. **Start rating dishes!**

### Sign Out:
- Click the "Sign Out" button in the top right

## 📧 Email Configuration in Supabase

To enable email authentication:

1. Go to your Supabase dashboard
2. Navigate to **Authentication > Providers**
3. Make sure **Email** is enabled
4. Configure email templates (optional)

### Email Template Settings:

**Confirm signup / Magic Link:**
- Subject: `Confirm your TasteBook signup`
- Body: Include the `{{ .ConfirmationURL }}` variable

## 🔒 Security Features

- ✅ **Magic Link Authentication** - No passwords to manage
- ✅ **Session Management** - Automatic token refresh
- ✅ **Protected Routes** - Middleware handles auth checks
- ✅ **Secure Cookies** - HttpOnly, secure cookies for sessions

## 🎨 User Experience

### Not Signed In:
- See landing page with gradient hero
- "Get Started" or "Sign In" buttons
- Clean, minimal design

### Signed In:
- See main app with stacked cards
- Access to Rate, Dishes, Profile
- Sign Out button in header

## 🧪 Testing Authentication

1. **Start the app:**
   ```bash
   npm run dev
   ```

2. **Go to http://localhost:3000**

3. **Click "Get Started"**

4. **Enter your email** (must be a real email you can access)

5. **Check your email inbox** for the magic link

6. **Click the link** - you'll be redirected and signed in!

7. **You should now see the main app** with your cards

## 🔧 Troubleshooting

### Email Not Arriving?
- Check spam folder
- Verify email provider is configured in Supabase
- Check Supabase logs in dashboard

### "Invalid credentials" error?
- Verify your `.env` has correct Supabase URL and keys
- Restart the dev server after changing `.env`

### Redirect not working?
- Check that callback URL is `http://localhost:3000/auth/callback`
- In Supabase dashboard, add to "Redirect URLs" under Authentication > URL Configuration

## 📱 Supabase Dashboard Setup

### Required Settings:

1. **Authentication > URL Configuration**
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

2. **Authentication > Email Auth**
   - Enable email confirmation: Yes
   - Confirm email: Yes (or No for faster testing)

## 🎯 Next Steps

### Optional Enhancements:

1. **Add Profile Creation** - Create user profiles on first sign in
2. **Social Auth** - Add Google, GitHub sign in
3. **Email Verification** - Require email confirmation
4. **Password Auth** - Add traditional email/password option
5. **User Profiles** - Store user data in Supabase

### Production Deployment:

When deploying, update these in Supabase dashboard:
- Site URL: `https://yourdomain.com`
- Redirect URLs: `https://yourdomain.com/auth/callback`

## ✨ Features Included

- 🔐 Magic link authentication
- 🔄 Automatic session refresh
- 🚪 Clean sign out
- 🎨 Beautiful sign in page
- 🔒 Protected routes
- 📧 Email-based login
- ⚡ Real-time auth state updates

## 🎉 You're All Set!

Your TasteBook app now has full authentication powered by Supabase!

Test it out:
1. Restart your dev server if needed: `npm run dev`
2. Visit http://localhost:3000
3. Sign in with your email
4. Start rating dishes!

---

**Questions?** Check the Supabase docs: https://supabase.com/docs/guides/auth


# Supabase Database Setup Guide

## Quick Start

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 3: Create Database Schema
1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy the entire contents of `supabase/schema.sql`
4. Paste and run it
5. This will create all tables, functions, triggers, and policies

### Step 4: Create Storage Bucket (for package images)
1. Go to **Storage** in Supabase Dashboard
2. Click **New bucket**
3. Name: `packages`
4. Make it **Public**
5. Click **Create**

### Step 5: Register Your Admin Account
1. Go to `/admin/register`
2. Fill in your details
3. Your account will be created with admin role automatically
4. Go to `/admin/login` and sign in

## Database Schema

The schema includes:
- **users** - User profiles with roles (admin/customer)
- **packages** - Tour packages/journeys
- **package_images** - Images for packages
- **services** - Services offered
- **contacts** - Contact form submissions
- **bookings** - Package bookings
- **reviews** - Customer reviews

## Features

✅ Row Level Security (RLS) enabled on all tables
✅ Automatic user creation trigger
✅ Admin role checking function
✅ Clean, optimized policies
✅ Performance indexes

## Troubleshooting

### "An unexpected response was received from the server" Error

This usually means:
1. **Environment variables not set** - Check `.env.local` file exists and has correct values
2. **Database not set up** - Run `supabase/schema.sql` in Supabase SQL Editor
3. **User record missing** - Your auth user exists but no record in `public.users` table

**Quick Fix:**
1. Go to `/admin/test-connection` to diagnose
2. Check browser console (F12) for detailed errors
3. Verify your user exists and has admin role:
   ```sql
   SELECT id, email, role FROM public.users WHERE email = 'your-email@example.com';
   ```

### If registration fails:
- Make sure you've run the schema.sql file
- Check that RLS policies are created
- Verify the `is_admin()` function exists

### If login doesn't work:
- Ensure your user record exists in `public.users` table
- Check that your role is set to `'admin'` (exactly, no spaces)
- Verify your Supabase credentials in `.env.local`
- Test connection at `/admin/test-connection`

### To manually set admin role:
```sql
-- First, get your user ID from Authentication → Users
-- Then run:
UPDATE public.users 
SET role = 'admin' 
WHERE id = 'your-user-id-here';
```

### Common Issues:

**Issue:** Environment variables not loading
- Make sure `.env.local` is in root directory
- Restart dev server after adding variables

**Issue:** "User record not found"
- Register again at `/admin/register`
- Or manually insert:
  ```sql
  INSERT INTO public.users (id, email, role)
  VALUES ('your-auth-user-id', 'your-email@example.com', 'admin');
  ```

## Next Steps

After setup:
1. Register your admin account at `/admin/register`
2. Login at `/admin/login`
3. Start managing your content!



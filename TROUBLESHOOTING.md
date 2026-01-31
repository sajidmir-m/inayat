# Troubleshooting Guide

## "An unexpected response was received from the server" Error

This error typically occurs when there's an issue with server actions or database connection. Follow these steps:

### Step 1: Check Environment Variables

1. Make sure you have a `.env.local` file in the root directory
2. Verify it contains:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
3. Restart your development server after adding/changing environment variables

### Step 2: Test Connection

1. Go to `/admin/test-connection`
2. Click "Test Connection"
3. Check the results:
   - ✅ Green checkmarks = Good
   - ❌ Red X = Problem found

### Step 3: Verify Database Setup

1. Go to Supabase Dashboard → SQL Editor
2. Run the schema: Copy and paste `supabase/schema.sql`
3. Make sure all tables are created
4. Verify the `is_admin()` function exists:
   ```sql
   SELECT is_admin();
   ```

### Step 4: Check Your User Record

1. Go to Supabase Dashboard → Authentication → Users
2. Find your user and copy the User ID
3. Go to SQL Editor and run:
   ```sql
   SELECT id, email, role FROM public.users WHERE id = 'your-user-id-here';
   ```
4. If the record doesn't exist or role is not 'admin':
   ```sql
   INSERT INTO public.users (id, email, role)
   VALUES ('your-user-id-here', 'your-email@example.com', 'admin')
   ON CONFLICT (id) DO UPDATE SET role = 'admin';
   ```

### Step 5: Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Try logging in again
4. Look for any error messages
5. Check Network tab for failed requests

### Step 6: Common Issues

#### Issue: Environment variables not loading
**Solution:** 
- Make sure `.env.local` is in the root directory (same level as `package.json`)
- Restart the dev server: Stop (Ctrl+C) and run `npm run dev` again

#### Issue: Database connection fails
**Solution:**
- Verify your Supabase URL and key are correct
- Check Supabase project is active
- Verify network connection

#### Issue: User record doesn't exist
**Solution:**
- Register again at `/admin/register`
- Or manually create the record using SQL (see Step 4)

#### Issue: Role is not 'admin'
**Solution:**
- Run the SQL update query from Step 4
- Make sure role is exactly `'admin'` (lowercase, no spaces)

### Step 7: Clear Cache and Retry

1. Clear browser cookies for localhost
2. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. Try logging in again

## Still Having Issues?

1. Check the browser console for detailed errors
2. Check the terminal/console where you're running `npm run dev` for server errors
3. Verify all steps above are completed
4. Make sure you've run `npm install` to install Supabase dependencies


-- ============================================
-- FIX BOOKINGS RLS POLICIES - CORRECTED VERSION
-- ============================================
-- Run this in Supabase SQL Editor to fix booking insert permissions
-- This will allow public users (anonymous) to create bookings
-- ============================================

-- Step 1: Drop ALL existing bookings policies (clean slate)
DROP POLICY IF EXISTS "Public can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can manage bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can delete bookings" ON public.bookings;

-- Step 2: Ensure RLS is enabled on bookings table
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Step 3: Grant necessary permissions to anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.bookings TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Step 4: CRITICAL - Create INSERT policy that allows ANYONE (including anonymous) to create bookings
-- This MUST explicitly allow 'anon' role for public booking forms to work
CREATE POLICY "Public can create bookings"
  ON public.bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Step 5: Create SELECT policy - Allow authenticated users to view their own bookings
CREATE POLICY "Users can view own bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Step 6: Create SELECT policy - Allow admins to view ALL bookings (for admin panel)
CREATE POLICY "Admins can view all bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Step 7: Create UPDATE policy - Allow admins to update bookings
CREATE POLICY "Admins can update bookings"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Step 8: Create DELETE policy - Allow admins to delete bookings
CREATE POLICY "Admins can delete bookings"
  ON public.bookings FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify policies are created:

-- Check if policies exist:
-- SELECT * FROM pg_policies WHERE tablename = 'bookings';

-- Test if anon can insert (this should return true):
-- SELECT EXISTS (
--   SELECT 1 FROM pg_policies 
--   WHERE tablename = 'bookings' 
--   AND policyname = 'Public can create bookings'
--   AND roles = '{anon,authenticated}'
-- );

-- ============================================
-- TESTING INSTRUCTIONS
-- ============================================
-- After running this script:
-- 1. Go to your website: /packages/[any-package-id]
-- 2. Fill out the booking form
-- 3. Submit the form
-- 4. It should work without "new row violates row-level security policy" error
-- 5. Check /admin/bookings to see the booking was created


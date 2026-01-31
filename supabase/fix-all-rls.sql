-- ============================================
-- FIX ALL RLS POLICIES FOR BOOKINGS AND CONTACTS
-- ============================================
-- Run this in Supabase SQL Editor to fix both booking and contact insert permissions
-- ============================================

-- ============================================
-- FIX CONTACTS POLICIES
-- ============================================

-- Drop existing contacts policies
DROP POLICY IF EXISTS "Public can create contacts" ON public.contacts;
DROP POLICY IF EXISTS "Admins can manage contacts" ON public.contacts;
DROP POLICY IF EXISTS "Admins can view all contacts" ON public.contacts;
DROP POLICY IF EXISTS "Admins can update contacts" ON public.contacts;
DROP POLICY IF EXISTS "Admins can delete contacts" ON public.contacts;

-- Allow anyone to INSERT contacts
CREATE POLICY "Public can create contacts"
  ON public.contacts FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow admins to view all contacts
CREATE POLICY "Admins can view all contacts"
  ON public.contacts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Allow admins to UPDATE contacts
CREATE POLICY "Admins can update contacts"
  ON public.contacts FOR UPDATE
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

-- Allow admins to DELETE contacts
CREATE POLICY "Admins can delete contacts"
  ON public.contacts FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- ============================================
-- FIX BOOKINGS POLICIES
-- ============================================

-- Drop existing bookings policies
DROP POLICY IF EXISTS "Public can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can manage bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can delete bookings" ON public.bookings;

-- Allow anyone to INSERT bookings
CREATE POLICY "Public can create bookings"
  ON public.bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users to view their own bookings
CREATE POLICY "Users can view own bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow admins to view all bookings
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

-- Allow admins to UPDATE bookings
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

-- Allow admins to DELETE bookings
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
-- ENSURE GRANTS ARE CORRECT
-- ============================================
GRANT ALL ON TABLE public.contacts TO anon, authenticated;
GRANT ALL ON TABLE public.bookings TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;


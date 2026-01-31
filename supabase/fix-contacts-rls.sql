-- ============================================
-- FIX CONTACTS RLS POLICIES
-- ============================================
-- Run this in Supabase SQL Editor to fix contact insert permissions
-- ============================================

-- Drop existing contacts policies to recreate them properly
DROP POLICY IF EXISTS "Public can create contacts" ON public.contacts;
DROP POLICY IF EXISTS "Admins can manage contacts" ON public.contacts;
DROP POLICY IF EXISTS "Admins can view all contacts" ON public.contacts;
DROP POLICY IF EXISTS "Admins can update contacts" ON public.contacts;
DROP POLICY IF EXISTS "Admins can delete contacts" ON public.contacts;

-- Policy 1: Allow anyone (including anonymous users) to INSERT contacts
-- This is critical for the public contact form to work
CREATE POLICY "Public can create contacts"
  ON public.contacts FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy 2: Allow admins to view all contacts (for admin panel)
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

-- Policy 3: Allow admins to UPDATE contacts
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

-- Policy 4: Allow admins to DELETE contacts
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

-- Ensure grants are correct
GRANT ALL ON TABLE public.contacts TO anon, authenticated;


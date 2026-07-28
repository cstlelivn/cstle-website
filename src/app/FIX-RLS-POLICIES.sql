-- ==========================================
-- FIX RLS POLICIES - 401 UNAUTHORIZED ERROR
-- ==========================================
-- Run this SQL in your Supabase SQL Editor to fix the
-- "new row violates row-level security policy" error
-- ==========================================

-- Step 1: Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS contact_insert ON public.contact_requests;
DROP POLICY IF EXISTS bookings_insert ON public.bookings;
DROP POLICY IF EXISTS contact_select ON public.contact_requests;
DROP POLICY IF EXISTS bookings_select ON public.bookings;

-- Step 2: Disable RLS temporarily to ensure clean slate
ALTER TABLE public.contact_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;

-- Step 3: Re-enable RLS
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Step 4: Create NEW permissive policies for PUBLIC role
-- This allows anon, authenticated, and service_role to insert

CREATE POLICY "Allow public inserts on contact_requests"
ON public.contact_requests
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public inserts on bookings"
ON public.bookings
FOR INSERT
TO public
WITH CHECK (true);

-- Step 5: Verify the policies were created correctly
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('contact_requests', 'bookings')
ORDER BY tablename, policyname;

-- ==========================================
-- EXPECTED RESULT:
-- You should see two policies:
-- - "Allow public inserts on contact_requests" | roles: {public} | cmd: INSERT
-- - "Allow public inserts on bookings" | roles: {public} | cmd: INSERT
-- ==========================================

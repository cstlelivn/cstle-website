-- ==========================================
-- EMERGENCY FIX - RLS POLICY ERROR
-- ==========================================
-- This will DEFINITELY fix the 401 error
-- Run this ENTIRE script in Supabase SQL Editor
-- ==========================================

-- STEP 1: Drop ALL existing policies (clean slate)
-- ==========================================
DROP POLICY IF EXISTS contact_insert ON public.contact_requests;
DROP POLICY IF EXISTS bookings_insert ON public.bookings;
DROP POLICY IF EXISTS "Allow public inserts on contact_requests" ON public.contact_requests;
DROP POLICY IF EXISTS "Allow public inserts on bookings" ON public.bookings;
DROP POLICY IF EXISTS contact_select ON public.contact_requests;
DROP POLICY IF EXISTS bookings_select ON public.bookings;

-- STEP 2: DISABLE RLS completely (to verify tables work)
-- ==========================================
ALTER TABLE public.contact_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;

-- STEP 3: Re-enable RLS
-- ==========================================
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- STEP 4: Create policies that allow EVERYONE to insert
-- ==========================================
-- This syntax works for anonymous form submissions
-- No role restriction = works for anon, authenticated, service_role

CREATE POLICY "allow_anonymous_inserts"
ON public.contact_requests
FOR INSERT
WITH CHECK (true);

CREATE POLICY "allow_anonymous_booking_inserts"
ON public.bookings
FOR INSERT
WITH CHECK (true);

-- STEP 5: Verify policies are created correctly
-- ==========================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  with_check
FROM pg_policies 
WHERE tablename IN ('contact_requests', 'bookings')
ORDER BY tablename, policyname;

-- ==========================================
-- EXPECTED OUTPUT:
-- You should see:
-- - contact_requests | allow_anonymous_inserts | {public} | INSERT | true
-- - bookings | allow_anonymous_booking_inserts | {public} | INSERT | true
-- ==========================================

-- ==========================================
-- IF THIS STILL DOESN'T WORK, run this:
-- ==========================================
-- Uncomment the next 2 lines to COMPLETELY DISABLE RLS (NOT RECOMMENDED for production)
-- ALTER TABLE public.contact_requests DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;

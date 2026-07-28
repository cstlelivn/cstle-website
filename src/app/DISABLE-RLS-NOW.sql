-- ==========================================
-- IMMEDIATE FIX: DISABLE RLS COMPLETELY
-- ==========================================
-- This will fix the 401 error RIGHT NOW
-- Run this in Supabase SQL Editor
-- ==========================================

-- Simply turn off RLS for form tables
ALTER TABLE public.contact_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename IN ('contact_requests', 'bookings')
AND schemaname = 'public';

-- ==========================================
-- EXPECTED RESULT:
-- Both tables should show rowsecurity = false
-- ==========================================

-- ==========================================
-- IMPORTANT:
-- This disables all security on these tables.
-- Only use this for TESTING.
-- Before going to production, re-enable RLS:
--
-- ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
--
-- Then create proper policies using EMERGENCY-FIX-RLS.sql
-- ==========================================

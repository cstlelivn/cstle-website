-- ==========================================
-- SETUP LEADS TABLE FOR WEB FORM SUBMISSIONS
-- ==========================================
-- Run this in Supabase → SQL Editor
-- Safe to run multiple times (idempotent)
-- ==========================================

-- Ensure leads has all fields we need from web forms
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS first_name       text,
  ADD COLUMN IF NOT EXISTS last_name        text,
  ADD COLUMN IF NOT EXISTS name             text,         -- fallback single-field name
  ADD COLUMN IF NOT EXISTS email            text,
  ADD COLUMN IF NOT EXISTS phone            text,
  ADD COLUMN IF NOT EXISTS project_type     text,
  ADD COLUMN IF NOT EXISTS project_address  text,
  ADD COLUMN IF NOT EXISTS project_details  text,
  ADD COLUMN IF NOT EXISTS message          text,
  ADD COLUMN IF NOT EXISTS source_page      text DEFAULT '/contact',
  ADD COLUMN IF NOT EXISTS status           text DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS created_at       timestamptz NOT NULL DEFAULT now();

-- Enable RLS (if not already enabled)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists (idempotent)
DROP POLICY IF EXISTS leads_insert_web ON public.leads;

-- Create policy to allow anonymous inserts from website
CREATE POLICY leads_insert_web
  ON public.leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create helpful indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status      ON public.leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_email       ON public.leads (email);

-- Verify the setup
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'leads'
ORDER BY policyname;

-- ==========================================
-- EXPECTED RESULT:
-- You should see: leads_insert_web | {anon} | INSERT
-- ==========================================

-- Migration: Add consultation_time column to leads table
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/sql

-- Add consultation_time column to leads table
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS consultation_time TEXT;

-- Add comment to document the column
COMMENT ON COLUMN public.leads.consultation_time IS 'Preferred consultation time in HH:MM format (24-hour) from BookService form';

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'leads'
  AND column_name = 'consultation_time';

-- Test query to check existing data
SELECT id, name, consultation_date, consultation_time, created_at
FROM public.leads
ORDER BY created_at DESC
LIMIT 5;

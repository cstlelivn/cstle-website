-- ==========================================
-- CSTLE LIVN - DATABASE MIGRATIONS
-- ==========================================
-- Run this SQL in your Supabase SQL Editor
-- Project: mlxsfhdzlcxtvqeshgjx
-- ==========================================

-- ==========================================
-- 1. CREATE CONTACT REQUESTS TABLE
-- ==========================================
create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  project_type text,
  message text not null,
  source_page text default '/contact',
  created_at timestamptz not null default now()
);

-- ==========================================
-- 2. CREATE BOOKINGS TABLE
-- ==========================================
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  project_address text not null,
  preferred_date date,
  service_type text not null,
  project_details text not null,
  status text not null default 'new',
  source_page text default '/book',
  created_at timestamptz not null default now()
);

-- ==========================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ==========================================
alter table public.contact_requests enable row level security;
alter table public.bookings enable row level security;

-- ==========================================
-- 4. CREATE RLS POLICIES - ALLOW PUBLIC INSERTS
-- ==========================================
-- Drop existing policies if they exist
drop policy if exists contact_insert on public.contact_requests;
drop policy if exists bookings_insert on public.bookings;

-- Allow ALL roles (public) to insert - this includes anon, authenticated, and service_role
create policy "Allow public inserts on contact_requests" 
  on public.contact_requests
  for insert 
  to public 
  with check (true);

create policy "Allow public inserts on bookings" 
  on public.bookings
  for insert 
  to public 
  with check (true);

-- ==========================================
-- 5. CREATE INDEXES FOR PERFORMANCE
-- ==========================================
create index if not exists idx_contact_requests_created_at 
  on public.contact_requests(created_at desc);

create index if not exists idx_bookings_created_at 
  on public.bookings(created_at desc);

create index if not exists idx_bookings_status 
  on public.bookings(status);

-- ==========================================
-- SETUP COMPLETE
-- ==========================================
-- Next steps:
-- 1. Configure CORS in Supabase Dashboard:
--    Authentication → URL Configuration
--    - Site URL: https://cstlelivn.ca
--    - Additional Redirect URLs:
--      * https://www.cstlelivn.ca
--      * https://admin.cstlelivn.ca
--      * https://work.cstlelivn.ca
--
-- 2. Deploy the notify-admin edge function (see EDGE-FUNCTION-notify-admin.ts)
--
-- 3. Set edge function environment variables:
--    - ADMIN_NOTIFY_EMAIL=info@cstlelivn.ca
--    - RESEND_API_KEY=your_resend_api_key
--
-- ==========================================
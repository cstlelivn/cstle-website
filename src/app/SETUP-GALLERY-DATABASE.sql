-- =====================================================
-- 🎨 GALLERY CMS DATABASE SETUP
-- =====================================================
-- Copy this ENTIRE file and paste it into Supabase SQL Editor
-- This creates the tables needed for your Google Drive gallery
--
-- HOW TO RUN:
-- 1. Go to: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx
-- 2. Click "SQL Editor" in the left sidebar
-- 3. Click "New Query"
-- 4. Copy everything below this line
-- 5. Paste into the editor
-- 6. Click "Run" button (or press Cmd/Ctrl + Enter)
--
-- You should see: "Success. No rows returned"
-- =====================================================

-- Step 1: Create gallery_albums table
-- This stores info about each Google Drive subfolder (album)
CREATE TABLE IF NOT EXISTS public.gallery_albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,                    -- URL-friendly name (e.g., "kitchen-renovations")
  name TEXT NOT NULL,                           -- Display name (e.g., "Kitchen Renovations")
  drive_folder_id TEXT NOT NULL,                -- Google Drive folder ID
  max_items INTEGER NOT NULL DEFAULT 4,         -- How many images to show from this album
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true       -- Show/hide album
);

-- Step 2: Create gallery_images table
-- This stores info about each image synced from Google Drive
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id UUID NOT NULL REFERENCES public.gallery_albums(id) ON DELETE CASCADE,
  drive_file_id TEXT NOT NULL,                  -- Google Drive file ID
  title TEXT NOT NULL,                          -- Image title (from filename)
  category TEXT,                                -- Category/album name
  url TEXT NOT NULL,                            -- Google Drive image URL
  position INTEGER NOT NULL DEFAULT 0,          -- Sort order (0 = first)
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Step 3: Create indexes for fast queries
CREATE INDEX IF NOT EXISTS gallery_images_album_id_idx 
  ON public.gallery_images(album_id);

CREATE INDEX IF NOT EXISTS gallery_images_album_position_idx 
  ON public.gallery_images(album_id, position);

-- Step 4: Enable Row Level Security (RLS)
ALTER TABLE public.gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Step 5: Allow public to READ active albums
DROP POLICY IF EXISTS "gallery_albums_public_read" ON public.gallery_albums;
CREATE POLICY "gallery_albums_public_read" 
  ON public.gallery_albums
  FOR SELECT
  USING (is_active = true);  -- Only show active albums to public

-- Step 6: Allow service role FULL ACCESS to albums (for sync script)
DROP POLICY IF EXISTS "gallery_albums_service_all" ON public.gallery_albums;
CREATE POLICY "gallery_albums_service_all" 
  ON public.gallery_albums
  FOR ALL
  USING (auth.role() = 'service_role');

-- Step 7: Allow public to READ all images
DROP POLICY IF EXISTS "gallery_images_public_read" ON public.gallery_images;
CREATE POLICY "gallery_images_public_read" 
  ON public.gallery_images
  FOR SELECT
  USING (true);  -- Anyone can view images

-- Step 8: Allow service role FULL ACCESS to images (for sync script)
DROP POLICY IF EXISTS "gallery_images_service_all" ON public.gallery_images;
CREATE POLICY "gallery_images_service_all" 
  ON public.gallery_images
  FOR ALL
  USING (auth.role() = 'service_role');

-- Step 9: Grant permissions to anonymous and authenticated users
GRANT SELECT ON public.gallery_albums TO anon, authenticated;
GRANT SELECT ON public.gallery_images TO anon, authenticated;
GRANT ALL ON public.gallery_albums TO service_role;
GRANT ALL ON public.gallery_images TO service_role;

-- Step 10: Add helpful comments (for documentation)
COMMENT ON TABLE public.gallery_albums IS 'Albums auto-discovered from Google Drive subfolders';
COMMENT ON TABLE public.gallery_images IS 'Images synced from Google Drive folders';
COMMENT ON COLUMN public.gallery_albums.slug IS 'URL-friendly identifier generated from folder name';
COMMENT ON COLUMN public.gallery_albums.drive_folder_id IS 'Google Drive folder ID';
COMMENT ON COLUMN public.gallery_albums.max_items IS 'Maximum number of images to display from this album (default: 4)';
COMMENT ON COLUMN public.gallery_images.drive_file_id IS 'Google Drive file ID';
COMMENT ON COLUMN public.gallery_images.position IS 'Sort order within album (0-based, 0 = first)';

-- =====================================================
-- ✅ DONE!
-- =====================================================
-- If you see "Success. No rows returned" - it worked!
--
-- VERIFY:
-- 1. Go to "Table Editor" in the left sidebar
-- 2. You should see two new tables:
--    - gallery_albums
--    - gallery_images
--
-- NEXT STEPS:
-- 1. Run the sync script: node run-sync.js
-- 2. Check this table again - you should see data!
-- =====================================================

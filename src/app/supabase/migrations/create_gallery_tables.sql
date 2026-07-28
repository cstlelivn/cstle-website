-- =====================================================
-- Gallery CMS Schema: Albums and Images from Google Drive
-- =====================================================
-- This migration creates the tables needed for the Google Drive-based gallery CMS.
-- Run this in your Supabase SQL editor or via CLI migrations.

-- 1. Create gallery_albums table
CREATE TABLE IF NOT EXISTS public.gallery_albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  drive_folder_id TEXT NOT NULL,
  max_items INTEGER NOT NULL DEFAULT 4,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- 2. Create gallery_images table
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id UUID NOT NULL REFERENCES public.gallery_albums(id) ON DELETE CASCADE,
  drive_file_id TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT,
  url TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS gallery_images_album_id_idx ON public.gallery_images(album_id);
CREATE INDEX IF NOT EXISTS gallery_images_album_position_idx ON public.gallery_images(album_id, position);

-- 4. Enable Row Level Security
ALTER TABLE public.gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for gallery_albums
-- Public read access
DROP POLICY IF EXISTS "gallery_albums_public_read" ON public.gallery_albums;
CREATE POLICY "gallery_albums_public_read" 
  ON public.gallery_albums
  FOR SELECT
  USING (is_active = true);

-- Service role full access (for sync script and admin)
DROP POLICY IF EXISTS "gallery_albums_service_all" ON public.gallery_albums;
CREATE POLICY "gallery_albums_service_all" 
  ON public.gallery_albums
  FOR ALL
  USING (auth.role() = 'service_role');

-- 6. RLS Policies for gallery_images
-- Public read access
DROP POLICY IF EXISTS "gallery_images_public_read" ON public.gallery_images;
CREATE POLICY "gallery_images_public_read" 
  ON public.gallery_images
  FOR SELECT
  USING (true);

-- Service role full access (for sync script and admin)
DROP POLICY IF EXISTS "gallery_images_service_all" ON public.gallery_images;
CREATE POLICY "gallery_images_service_all" 
  ON public.gallery_images
  FOR ALL
  USING (auth.role() = 'service_role');

-- 7. Grant necessary permissions
GRANT SELECT ON public.gallery_albums TO anon, authenticated;
GRANT SELECT ON public.gallery_images TO anon, authenticated;
GRANT ALL ON public.gallery_albums TO service_role;
GRANT ALL ON public.gallery_images TO service_role;

-- 8. Comments for documentation
COMMENT ON TABLE public.gallery_albums IS 'Albums auto-discovered from Google Drive subfolders';
COMMENT ON TABLE public.gallery_images IS 'Images synced from Google Drive folders';
COMMENT ON COLUMN public.gallery_albums.slug IS 'URL-friendly identifier generated from folder name';
COMMENT ON COLUMN public.gallery_albums.drive_folder_id IS 'Google Drive folder ID';
COMMENT ON COLUMN public.gallery_albums.max_items IS 'Maximum number of images to display from this album';
COMMENT ON COLUMN public.gallery_images.drive_file_id IS 'Google Drive file ID';
COMMENT ON COLUMN public.gallery_images.position IS 'Sort order within album (0-based)';

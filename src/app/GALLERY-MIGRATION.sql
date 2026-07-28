-- ============================================================
-- Gallery Schema Migration — Run in Supabase SQL Editor
-- Safe to re-run: ADD COLUMN IF NOT EXISTS throughout
-- ============================================================

-- ── gallery_albums ───────────────────────────────────────────

ALTER TABLE public.gallery_albums
  ADD COLUMN IF NOT EXISTS drive_folder_id    text,
  ADD COLUMN IF NOT EXISTS source_folder_name text,
  ADD COLUMN IF NOT EXISTS public_title       text,
  ADD COLUMN IF NOT EXISTS public_slug        text,
  ADD COLUMN IF NOT EXISTS description        text,
  ADD COLUMN IF NOT EXISTS service_category   text,
  ADD COLUMN IF NOT EXISTS status             text DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS cover_image_id     uuid,
  ADD COLUMN IF NOT EXISTS cover_url          text,
  ADD COLUMN IF NOT EXISTS display_position   integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_active          boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS last_seen_at       timestamptz,
  ADD COLUMN IF NOT EXISTS last_synced_at     timestamptz;

-- Back-fill from existing data
UPDATE public.gallery_albums SET
  source_folder_name = COALESCE(source_folder_name, name),
  public_title       = COALESCE(public_title, name),
  public_slug        = COALESCE(public_slug, slug)
WHERE public_title IS NULL OR public_slug IS NULL;

-- ── gallery_images ───────────────────────────────────────────

ALTER TABLE public.gallery_images
  ADD COLUMN IF NOT EXISTS drive_file_id      text,
  ADD COLUMN IF NOT EXISTS source_filename    text,
  ADD COLUMN IF NOT EXISTS display_title      text,
  ADD COLUMN IF NOT EXISTS caption            text,
  ADD COLUMN IF NOT EXISTS thumbnail_url      text,
  ADD COLUMN IF NOT EXISTS drive_created_at   timestamptz,
  ADD COLUMN IF NOT EXISTS drive_modified_at  timestamptz,
  ADD COLUMN IF NOT EXISTS display_position   integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS manual_position    integer,
  ADD COLUMN IF NOT EXISTS is_active          boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS last_seen_at       timestamptz,
  ADD COLUMN IF NOT EXISTS last_synced_at     timestamptz;

-- Back-fill display_title from existing title
UPDATE public.gallery_images SET
  display_title    = COALESCE(display_title, title),
  display_position = COALESCE(display_position, position)
WHERE display_title IS NULL;

-- ── Unique indexes ────────────────────────────────────────────

CREATE UNIQUE INDEX IF NOT EXISTS gallery_albums_drive_folder_id_key
  ON public.gallery_albums (drive_folder_id)
  WHERE drive_folder_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS gallery_images_drive_file_id_key
  ON public.gallery_images (drive_file_id)
  WHERE drive_file_id IS NOT NULL;

-- ── gallery_sync_runs ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.gallery_sync_runs (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at        timestamptz NOT NULL DEFAULT now(),
  finished_at       timestamptz,
  status            text        NOT NULL DEFAULT 'running',
  trigger_type      text        NOT NULL DEFAULT 'manual',
  albums_discovered integer     DEFAULT 0,
  images_discovered integer     DEFAULT 0,
  added_count       integer     DEFAULT 0,
  updated_count     integer     DEFAULT 0,
  deactivated_count integer     DEFAULT 0,
  reactivated_count integer     DEFAULT 0,
  error_summary     text,
  created_at        timestamptz NOT NULL DEFAULT now()
);

-- ── RLS policies ─────────────────────────────────────────────
-- Run these only after the columns above have been added.

ALTER TABLE public.gallery_albums    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_sync_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read gallery_albums" ON public.gallery_albums;
DROP POLICY IF EXISTS "Public read gallery_images" ON public.gallery_images;

CREATE POLICY "Public read gallery_albums"
  ON public.gallery_albums FOR SELECT TO anon
  USING (is_active = true);

CREATE POLICY "Public read gallery_images"
  ON public.gallery_images FOR SELECT TO anon
  USING (is_active = true);

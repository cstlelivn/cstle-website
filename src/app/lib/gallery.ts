/**
 * Gallery Data Fetching — Supabase
 * Works with both the original schema and the extended schema (post-migration).
 */

import { supabase } from '../utils/supabase/client';
import { convertToThumbnailUrl } from '../utils/imageHelpers';

export type GalleryImage = {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  position: number;
  stage: 'Before' | 'Progress' | 'Completed' | 'Concept' | null;
  altText: string;
  caption: string | null;
};

export type GalleryAlbum = {
  id: string;
  name: string;
  slug: string;
  coverUrl: string | null;
  imageCount: number;
  images: GalleryImage[];
  summary: string | null;
  status: string | null;
  services: string[];
  projectType: string | null;
  locationLabel: string | null;
};

export type GalleryItem = {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  albumSlug: string;
  albumName: string;
  position: number;
  category: string | null;
};

// ─────────────────────────────────────────────────────────────────────────────

/** Derive display URL for a raw DB image row (any schema version) */
function resolveImageUrl(row: Record<string, unknown>, size: 'thumb' | 'full' = 'thumb'): string {
  // Post-migration: use pre-built URLs from sync script
  if (size === 'thumb' && typeof row.thumbnail_url === 'string' && row.thumbnail_url) {
    return row.thumbnail_url;
  }
  const rawUrl = (typeof row.url === 'string' ? row.url : '') as string;
  if (!rawUrl) return '';
  // convertToThumbnailUrl now has the fixed regex — safe to call on lh3 URLs
  return size === 'thumb' ? convertToThumbnailUrl(rawUrl, 800) : convertToThumbnailUrl(rawUrl, 1600);
}

/** Sort images: display_position (if available) then position */
function sortImages(images: Record<string, unknown>[]): Record<string, unknown>[] {
  return [...images].sort((a, b) => {
    const aPos = typeof a.display_position === 'number' ? a.display_position
               : typeof a.position === 'number' ? a.position : 9999;
    const bPos = typeof b.display_position === 'number' ? b.display_position
               : typeof b.position === 'number' ? b.position : 9999;
    return aPos - bPos;
  });
}

function imageStage(row: Record<string, unknown>): GalleryImage['stage'] {
  const explicit = typeof row.stage === 'string' ? row.stage.toLowerCase() : '';
  const source = `${row.source_filename ?? ''} ${row.display_title ?? ''} ${row.title ?? ''}`.toLowerCase();
  const value = explicit || source;
  if (value.includes('concept') || value.includes('visualization')) return 'Concept';
  if (value.includes('before') || value.includes('early stage')) return 'Before';
  if (value.includes('progress') || value.includes('installation')) return 'Progress';
  if (value.includes('complete') || value.includes('finished')) return 'Completed';
  return null;
}

function albumServices(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string' && Boolean(item.trim()));
  if (typeof value !== 'string') return [];
  return value.split(/[,|]/).map((item) => item.trim()).filter(Boolean);
}

/** Cover selection priority per spec */
function selectCover(
  images: Record<string, unknown>[],
  coverImageId: string | null | undefined
): Record<string, unknown> | null {
  if (images.length === 0) return null;

  // 1. Explicit cover_image_id set by admin or sync
  if (coverImageId) {
    const explicit = images.find((img) => img.id === coverImageId);
    if (explicit) return explicit;
  }

  // 2. Filename starting with 01-cover or 01_cover
  const exactCover = images.find((img) => {
    const fname = (img.source_filename as string) ?? '';
    return /^01[-_]cover/i.test(fname);
  });
  if (exactCover) return exactCover;

  // 3. Position 0
  const atZero = images.find((img) => {
    const pos = typeof img.display_position === 'number' ? img.display_position
              : typeof img.position === 'number' ? img.position : -1;
    return pos === 0;
  });
  if (atZero) return atZero;

  // 4. First image
  return images[0];
}

// ─────────────────────────────────────────────────────────────────────────────

export async function fetchGalleryAlbums(): Promise<GalleryAlbum[]> {
  // Select * to pick up new columns post-migration without erroring pre-migration.
  // No is_active filter here — post-migration RLS enforces it; pre-migration all are active.
  const { data: albums, error: albumsErr } = await supabase
    .from('gallery_albums')
    .select('*')
    .order('display_position', { ascending: true, nullsFirst: false })
    .order('name', { ascending: true });

  if (albumsErr) {
    console.error('[gallery] albums query failed:', albumsErr.code, albumsErr.message);
    throw albumsErr;
  }
  if (!albums || albums.length === 0) return [];

  const albumIds = albums.map((a) => a.id as string);

  // Fetch all images for these albums — select * to pick up thumbnail_url, display_position etc.
  const { data: allImages, error: imagesErr } = await supabase
    .from('gallery_images')
    .select('*')
    .in('album_id', albumIds)
    .order('position', { ascending: true });

  if (imagesErr) {
    console.error('[gallery] images query failed:', imagesErr.code, imagesErr.message);
    throw imagesErr;
  }

  // Group images by album_id
  const imagesByAlbum = new Map<string, Record<string, unknown>[]>();
  for (const img of (allImages ?? []) as Record<string, unknown>[]) {
    const albumId = img.album_id as string;
    const list = imagesByAlbum.get(albumId) ?? [];
    list.push(img);
    imagesByAlbum.set(albumId, list);
  }

  const result: GalleryAlbum[] = [];

  for (const album of albums as Record<string, unknown>[]) {
    const albumId = album.id as string;
    const rawImgs = imagesByAlbum.get(albumId) ?? [];

    // Post-migration: is_active filter (column will be undefined pre-migration → keep all)
    const activeImgs = rawImgs.filter((img) =>
      (img.is_active === undefined || img.is_active === null || img.is_active === true) &&
      (img.published === undefined || img.published === null || img.published === true)
    );

    const sorted = sortImages(activeImgs);

    // Resolve cover
    const coverRow = selectCover(sorted, album.cover_image_id as string | null);
    const coverUrl = coverRow ? resolveImageUrl(coverRow, 'thumb') : null;

    // Build typed image list
    const images: GalleryImage[] = sorted.map((img) => ({
      id:           img.id as string,
      title:        (img.display_title ?? img.title ?? '') as string,
      url:          resolveImageUrl(img, 'full'),
      thumbnailUrl: resolveImageUrl(img, 'thumb'),
      position:     (typeof img.display_position === 'number'
                      ? img.display_position
                      : (img.position as number)) ?? 0,
      stage:        imageStage(img),
      altText:      (img.alt_text ?? img.display_title ?? img.title ?? 'Cstle construction project image') as string,
      caption:      typeof img.caption === 'string' && img.caption.trim() ? img.caption : null,
    }));

    if (images.length === 0) continue;

    result.push({
      id:         albumId,
      name:       (album.public_title ?? album.name) as string,
      slug:       (album.public_slug ?? album.slug) as string,
      coverUrl,
      imageCount: images.length,
      images,
      summary:     typeof album.description === 'string' && album.description.trim() ? album.description : null,
      status:      typeof album.status === 'string' && !['active', 'inactive'].includes(album.status.toLowerCase()) ? album.status : null,
      services:    albumServices(album.service_categories ?? album.services ?? album.service_category),
      projectType: typeof album.project_type === 'string' && album.project_type.trim() ? album.project_type : null,
      locationLabel: typeof album.location_label === 'string' && album.location_label.trim() ? album.location_label : null,
    });
  }

  return result;
}

// ─────────────────────────────────────────────────────────────────────────────

export async function fetchGalleryItems(): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from('gallery_images')
    .select(`
      id,
      title,
      display_title,
      url,
      thumbnail_url,
      position,
      display_position,
      album_id,
      album:gallery_albums!inner (
        id,
        slug,
        public_slug,
        name,
        public_title
      )
    `)
    .order('position', { ascending: true });

  if (error) {
    console.error('[gallery] items query failed:', error.code, error.message);
    throw error;
  }
  if (!data) return [];

  return (data as any[]).map((row) => ({
    id:           row.id,
    title:        row.display_title ?? row.title ?? '',
    url:          resolveImageUrl(row as Record<string, unknown>, 'full'),
    thumbnailUrl: resolveImageUrl(row as Record<string, unknown>, 'thumb'),
    albumSlug:    row.album?.public_slug ?? row.album?.slug ?? 'unknown',
    albumName:    row.album?.public_title ?? row.album?.name ?? 'Unknown',
    position:     row.display_position ?? row.position ?? 0,
    category:     row.album?.public_title ?? row.album?.name ?? null,
  }));
}

// ─────────────────────────────────────────────────────────────────────────────

export function groupByAlbum(items: GalleryItem[]): Record<string, GalleryItem[]> {
  return items.reduce((acc, item) => {
    const key = item.albumSlug;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, GalleryItem[]>);
}

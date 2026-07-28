/**
 * Gallery Sync Script — Google Drive → Supabase
 *
 * Non-destructive: upserts by stable Drive IDs.
 * Covers, captions, and manual positions survive re-syncs.
 *
 * USAGE:
 *   npm run sync:gallery
 *
 * REQUIRED ENV VARS:
 *   GDRIVE_SERVICE_ACCOUNT_KEY   — Google service-account JSON (minified)
 *   SUPABASE_URL                 — e.g. https://mlxsfhdzlcxtvqeshgjx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY    — service-role key (never expose publicly)
 *
 * OPTIONAL:
 *   GDRIVE_GALLERY_ROOT_FOLDER   — defaults to 1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb
 */

import { createClient } from '@supabase/supabase-js';
import {
  listSubfolders,
  listImagesInFolder,
  getGalleryRootFolder,
} from '../lib/gdrive';

// ── Supabase client (service-role, server-side only) ──────────────────────────

const supabaseUrl = process.env.SUPABASE_URL || 'https://mlxsfhdzlcxtvqeshgjx.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceRoleKey) {
  console.error('GDRIVE_SERVICE_ACCOUNT_KEY environment variable is required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Drive file ID → embeddable lh3 URL (file must be shared "Anyone with the link") */
function buildImageUrl(fileId: string, size = 1600): string {
  return `https://lh3.googleusercontent.com/d/${fileId}=w${size}`;
}

function buildThumbnailUrl(fileId: string): string {
  return buildImageUrl(fileId, 800);
}

function toSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Neutral public titles for known internal Drive folder names.
 * Customer surnames must never appear on the public website.
 * Add new entries here as folders are created.
 */
const PUBLIC_TITLE_MAP: Record<string, string> = {
  'P001 - Trombley':   'Renovation Project 001',
  'P002 - Lentil':     'Renovation Project 002',
  'P003 - Buckingham': 'Renovation Project 003',
};

function safePublicTitle(folderName: string): string {
  return PUBLIC_TITLE_MAP[folderName] ?? folderName;
}

/**
 * "03-progress-drywall-installation.jpg" → "Progress — Drywall Installation"
 */
function filenameToDisplayTitle(filename: string): string {
  const withoutExt    = filename.replace(/\.[^/.]+$/, '');
  const withoutPrefix = withoutExt.replace(/^\d+[-_]/, '');
  const words         = withoutPrefix.split(/[-_]+/).filter(Boolean);
  if (words.length === 0) return withoutExt;
  const [first, ...rest] = words;
  if (rest.length === 0) return cap(first);
  return `${cap(first)} — ${rest.map(cap).join(' ')}`;
}

function cap(w: string): string {
  return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
}

function filenameSortOrder(filename: string): number {
  const m = filename.match(/^(\d+)/);
  return m ? parseInt(m[1], 10) : Infinity;
}

/**
 * Cover priority:
 * 1. Admin manually set cover_image_id → preserved, never overwritten
 * 2. Filename starting with "01-cover" or "01_cover"
 * 3. Filename starting with "01-" or "01_"
 * 4. First file by numeric order
 */
function selectCoverFileId(
  images: Array<{ id: string; name: string }>,
  adminCoverId: string | null
): string | null {
  if (adminCoverId) return adminCoverId;
  if (images.length === 0) return null;

  const sorted = [...images].sort((a, b) => filenameSortOrder(a.name) - filenameSortOrder(b.name));

  const coverExact = sorted.find((f) => /^01[-_]cover/i.test(f.name));
  if (coverExact) return coverExact.id;

  const firstNumeric = sorted.find((f) => /^01[-_]/i.test(f.name));
  if (firstNumeric) return firstNumeric.id;

  return sorted[0]?.id ?? null;
}

// ── Sync ──────────────────────────────────────────────────────────────────────

interface SyncStats {
  albumsDiscovered: number;
  imagesDiscovered: number;
  added: number;
  updated: number;
  deactivated: number;
  reactivated: number;
  errors: string[];
}

async function syncAlbums(stats: SyncStats): Promise<void> {
  console.log('\nDiscovering albums from Google Drive...');

  const rootFolderId = getGalleryRootFolder();
  const subfolders   = await listSubfolders(rootFolderId);
  stats.albumsDiscovered = subfolders.length;
  console.log(`Found ${subfolders.length} folder(s)`);

  const activeFolderIds = new Set(subfolders.map((f) => f.id));

  // Load existing albums for comparison
  const { data: existing } = await supabase
    .from('gallery_albums')
    .select('id, drive_folder_id, public_title, cover_image_id, is_active');

  const byDriveId = new Map((existing ?? []).map((a) => [a.drive_folder_id as string, a]));

  // Upsert discovered folders
  for (const folder of subfolders) {
    const prev        = byDriveId.get(folder.id);
    const publicTitle = prev?.public_title ?? safePublicTitle(folder.name);
    const publicSlug  = toSlug(publicTitle);

    const record = {
      drive_folder_id:    folder.id,
      source_folder_name: folder.name,
      public_title:       publicTitle,
      public_slug:        publicSlug,
      name:               folder.name,
      slug:               publicSlug,
      is_active:          true,
      last_seen_at:       new Date().toISOString(),
      last_synced_at:     new Date().toISOString(),
    };

    const { error } = await supabase
      .from('gallery_albums')
      .upsert(record, { onConflict: 'drive_folder_id' });

    if (error) {
      console.error(`Album "${folder.name}": ${error.message}`);
      stats.errors.push(`Album upsert "${folder.name}": ${error.message}`);
      continue;
    }

    if (!prev)              { stats.added++;       console.log(`  New album: "${publicTitle}"`); }
    else if (!prev.is_active) { stats.reactivated++; console.log(`  Reactivated: "${publicTitle}"`); }
    else                    { stats.updated++;     console.log(`  Updated: "${publicTitle}"`); }
  }

  // Deactivate albums whose folders are gone
  for (const [driveFolderId, album] of byDriveId) {
    if (album.is_active && !activeFolderIds.has(driveFolderId)) {
      const { error } = await supabase
        .from('gallery_albums')
        .update({ is_active: false, last_synced_at: new Date().toISOString() })
        .eq('drive_folder_id', driveFolderId);

      if (error) {
        stats.errors.push(`Deactivate album ${driveFolderId}: ${error.message}`);
      } else {
        stats.deactivated++;
        console.log(`  Deactivated (removed from Drive): ${album.public_title}`);
      }
    }
  }
}

async function syncImages(stats: SyncStats): Promise<void> {
  console.log('\nSyncing images for each album...');

  const { data: albums, error } = await supabase
    .from('gallery_albums')
    .select('id, drive_folder_id, public_title, cover_image_id')
    .eq('is_active', true);

  if (error || !albums) {
    console.error('Could not fetch active albums:', error?.message);
    return;
  }

  for (const album of albums) {
    if (!album.drive_folder_id) continue;

    console.log(`\n  ${album.public_title ?? album.id}`);

    let driveImages: Array<{ id: string; name: string; createdTime: string }>;
    try {
      driveImages = await listImagesInFolder(album.drive_folder_id);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  Drive error: ${msg}`);
      stats.errors.push(`Drive list for album ${album.id}: ${msg}`);
      continue; // never deactivate on a partial Drive failure
    }

    stats.imagesDiscovered += driveImages.length;

    const sorted       = [...driveImages].sort((a, b) => filenameSortOrder(a.name) - filenameSortOrder(b.name));
    const activeFileIds = new Set(driveImages.map((f) => f.id));

    // Load existing images for this album
    const { data: existingImages } = await supabase
      .from('gallery_images')
      .select('id, drive_file_id, is_active')
      .eq('album_id', album.id);

    const byFileId = new Map((existingImages ?? []).map((img) => [img.drive_file_id as string, img]));

    // Upsert each image
    for (let i = 0; i < sorted.length; i++) {
      const file = sorted[i];
      const prev = byFileId.get(file.id);

      const record = {
        album_id:         album.id,
        drive_file_id:    file.id,
        source_filename:  file.name,
        display_title:    filenameToDisplayTitle(file.name),
        title:            filenameToDisplayTitle(file.name),
        url:              buildImageUrl(file.id),
        thumbnail_url:    buildThumbnailUrl(file.id),
        display_position: i,
        position:         i,
        is_active:        true,
        drive_created_at: file.createdTime,
        last_seen_at:     new Date().toISOString(),
        last_synced_at:   new Date().toISOString(),
      };

      const { error: upsertErr } = await supabase
        .from('gallery_images')
        .upsert(record, { onConflict: 'drive_file_id' });

      if (upsertErr) {
        console.error(`    Image "${file.name}": ${upsertErr.message}`);
        stats.errors.push(`Image upsert "${file.name}": ${upsertErr.message}`);
      } else if (!prev)               { stats.added++; }
        else if (!prev.is_active)     { stats.reactivated++; }
        else                          { stats.updated++; }
    }

    // Deactivate images no longer in Drive
    for (const [driveFileId, img] of byFileId) {
      if (img.is_active && !activeFileIds.has(driveFileId)) {
        const { error: deErr } = await supabase
          .from('gallery_images')
          .update({ is_active: false, last_synced_at: new Date().toISOString() })
          .eq('id', img.id);

        if (deErr) stats.errors.push(`Deactivate image ${img.id}: ${deErr.message}`);
        else stats.deactivated++;
      }
    }

    // Set cover_image_id (never overwrite an admin's manual choice)
    const coverFileId = selectCoverFileId(sorted, album.cover_image_id ?? null);
    if (coverFileId) {
      const { data: coverImg } = await supabase
        .from('gallery_images')
        .select('id, url')
        .eq('drive_file_id', coverFileId)
        .eq('album_id', album.id)
        .single();

      const updatePayload: Record<string, unknown> = {
        last_synced_at: new Date().toISOString(),
        cover_url:      buildImageUrl(coverFileId, 1200),
      };

      // Only auto-assign cover_image_id if admin has not chosen one
      if (coverImg && !album.cover_image_id) {
        updatePayload.cover_image_id = coverImg.id;
      }

      await supabase
        .from('gallery_albums')
        .update(updatePayload)
        .eq('id', album.id);
    }

    console.log(`    ${sorted.length} image(s) synced`);
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n==========================================');
  console.log('  Gallery Sync: Google Drive → Supabase');
  console.log('==========================================');

  const stats: SyncStats = {
    albumsDiscovered: 0, imagesDiscovered: 0,
    added: 0, updated: 0, deactivated: 0, reactivated: 0, errors: [],
  };

  // Record sync start
  const { data: syncRun } = await supabase
    .from('gallery_sync_runs')
    .insert({ trigger_type: 'manual', status: 'running' })
    .select('id')
    .single();

  const runId = syncRun?.id;

  try {
    await syncAlbums(stats);
    await syncImages(stats);

    if (runId) {
      await supabase.from('gallery_sync_runs').update({
        finished_at:       new Date().toISOString(),
        status:            stats.errors.length > 0 ? 'partial' : 'success',
        albums_discovered: stats.albumsDiscovered,
        images_discovered: stats.imagesDiscovered,
        added_count:       stats.added,
        updated_count:     stats.updated,
        deactivated_count: stats.deactivated,
        reactivated_count: stats.reactivated,
        error_summary:     stats.errors.length > 0 ? stats.errors.join('\n') : null,
      }).eq('id', runId);
    }

    console.log('\n==========================================');
    console.log('  Sync complete');
    console.log(`  Albums: ${stats.albumsDiscovered} | Images: ${stats.imagesDiscovered}`);
    console.log(`  Added: ${stats.added} | Updated: ${stats.updated} | Deactivated: ${stats.deactivated} | Reactivated: ${stats.reactivated}`);
    if (stats.errors.length > 0) console.log(`  Errors: ${stats.errors.length} — see gallery_sync_runs`);
    console.log('==========================================\n');

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (runId) {
      await supabase.from('gallery_sync_runs').update({
        finished_at:   new Date().toISOString(),
        status:        'failed',
        error_summary: msg,
      }).eq('id', runId);
    }
    console.error('\nSync failed:', msg, '\n');
    process.exit(1);
  }
}

main();

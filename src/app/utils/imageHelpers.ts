/**
 * Helper functions for handling Google Drive image URLs
 */

/**
 * Converts a Google Drive URL to a thumbnail URL that works in img tags
 * Supports multiple URL formats and extracts the file ID
 */
export function convertToThumbnailUrl(url: string, size: number = 1600): string {
  // Extract file ID from various Google Drive URL formats
  let fileId: string | null = null;

  // Format: https://drive.google.com/uc?export=view&id=FILE_ID
  const ucMatch = url.match(/[?&]id=([^&]+)/);
  if (ucMatch) {
    fileId = ucMatch[1];
  }

  // Format: https://drive.google.com/file/d/FILE_ID/view
  const fileMatch = url.match(/\/file\/d\/([^/]+)/);
  if (fileMatch) {
    fileId = fileMatch[1];
  }

  // Format: https://lh3.googleusercontent.com/d/FILE_ID=wNNN  (stop before = or ?)
  const lh3Match = url.match(/googleusercontent\.com\/d\/([^?=]+)/);
  if (lh3Match) {
    fileId = lh3Match[1];
  }

  // If we found a file ID, return the thumbnail URL
  if (fileId) {
    return `https://lh3.googleusercontent.com/d/${fileId}=w${size}`;
  }

  // If it's already a lh3.googleusercontent.com URL, just return it
  if (url.includes('lh3.googleusercontent.com')) {
    return url;
  }

  // Fallback: return original URL
  return url;
}

/**
 * Extracts file ID from Google Drive URL
 */
export function extractFileId(url: string): string | null {
  // Format: https://drive.google.com/uc?export=view&id=FILE_ID
  const ucMatch = url.match(/[?&]id=([^&]+)/);
  if (ucMatch) {
    return ucMatch[1];
  }

  // Format: https://drive.google.com/file/d/FILE_ID/view
  const fileMatch = url.match(/\/file\/d\/([^/]+)/);
  if (fileMatch) {
    return fileMatch[1];
  }

  // Format: https://lh3.googleusercontent.com/d/FILE_ID=wNNN  (stop before = or ?)
  const lh3Match = url.match(/googleusercontent\.com\/d\/([^?=]+)/);
  if (lh3Match) {
    return lh3Match[1];
  }

  return null;
}

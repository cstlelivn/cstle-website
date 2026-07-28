/**
 * Google Drive API Helper Module
 * 
 * This module provides authenticated access to Google Drive for the gallery CMS.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a Google Cloud Project: https://console.cloud.google.com/
 * 2. Enable the Google Drive API for your project
 * 3. Create a Service Account:
 *    - Go to IAM & Admin > Service Accounts
 *    - Create a new service account (e.g., "gallery-cms-sync")
 *    - Generate a JSON key for the service account
 * 4. Share your Google Drive folder with the service account email:
 *    - Open https://drive.google.com/drive/folders/1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb
 *    - Click Share
 *    - Add the service account email (e.g., gallery-cms-sync@your-project.iam.gserviceaccount.com)
 *    - Grant "Viewer" access (read-only is sufficient)
 * 5. Set environment variables (see .env.local or deployment settings):
 *    - GDRIVE_SERVICE_ACCOUNT_KEY: Full JSON key content (minified, no line breaks)
 *    - GDRIVE_GALLERY_ROOT_FOLDER: "1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb"
 */

import { google } from 'googleapis';

// Environment variables
const SERVICE_ACCOUNT_KEY = process.env.GDRIVE_SERVICE_ACCOUNT_KEY;
const GALLERY_ROOT_FOLDER = process.env.GDRIVE_GALLERY_ROOT_FOLDER || '1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb';

export interface DriveFolder {
  id: string;
  name: string;
}

export interface DriveImage {
  id: string;
  name: string;
  createdTime: string;
}

/**
 * Creates an authenticated Google Drive client using service account credentials
 */
export function createDriveClient() {
  if (!SERVICE_ACCOUNT_KEY) {
    throw new Error('GDRIVE_SERVICE_ACCOUNT_KEY environment variable is not set');
  }

  let credentials;
  try {
    credentials = JSON.parse(SERVICE_ACCOUNT_KEY);
  } catch (error) {
    throw new Error('Invalid JSON in GDRIVE_SERVICE_ACCOUNT_KEY environment variable');
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });

  return google.drive({ version: 'v3', auth });
}

/**
 * Lists all subfolders within a parent folder
 * @param parentFolderId - Google Drive folder ID
 * @returns Array of folder objects with id and name
 */
export async function listSubfolders(parentFolderId: string): Promise<DriveFolder[]> {
  const drive = createDriveClient();

  try {
    const response = await drive.files.list({
      q: `'${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name)',
      orderBy: 'name',
    });

    return (response.data.files || []).map((file) => ({
      id: file.id!,
      name: file.name!,
    }));
  } catch (error) {
    console.error('Error listing subfolders from Google Drive:', error);
    throw new Error(`Failed to list subfolders: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Lists all image files within a folder
 * @param folderId - Google Drive folder ID
 * @returns Array of image file objects with id, name, and createdTime
 */
export async function listImagesInFolder(folderId: string): Promise<DriveImage[]> {
  const drive = createDriveClient();

  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/' and trashed=false`,
      fields: 'files(id, name, createdTime)',
      orderBy: 'createdTime desc',
    });

    return (response.data.files || []).map((file) => ({
      id: file.id!,
      name: file.name!,
      createdTime: file.createdTime!,
    }));
  } catch (error) {
    console.error('Error listing images from Google Drive:', error);
    throw new Error(`Failed to list images: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Builds a public URL for a Google Drive file
 * @param fileId - Google Drive file ID
 * @returns Public URL for viewing/downloading the file
 */
export function buildPublicUrl(fileId: string): string {
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

/**
 * Gets the gallery root folder ID from environment
 */
export function getGalleryRootFolder(): string {
  return GALLERY_ROOT_FOLDER;
}

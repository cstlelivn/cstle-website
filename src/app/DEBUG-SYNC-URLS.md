# Debug Gallery Sync URLs

If images are still showing wrong URLs after running the sync, use this debugging version.

## Add Logging to Sync Script

Open your local `scripts/syncGalleryFromDrive.js` and find the part where images are processed (around line 200-210).

Replace this section:

```javascript
const imageRecords = limitedImages.map((image, index) => ({
  album_id: album.id,
  drive_file_id: image.id,
  title: image.name.replace(/\.[^/.]+$/, ''),
  category: album.name,
  url: buildPublicUrl(image.id),
  position: index,
}));
```

With this DEBUG version:

```javascript
const imageRecords = limitedImages.map((image, index) => {
  // DEBUG: Log what we're getting from Google Drive
  console.log('      [DEBUG] Processing image:', {
    id: image.id,
    name: image.name,
    thumbnailLink: image.thumbnailLink || 'N/A',
    webContentLink: image.webContentLink || 'N/A',
    webViewLink: image.webViewLink || 'N/A',
  });

  const publicUrl = buildPublicUrl(image.id);
  console.log('      [DEBUG] Generated URL:', publicUrl);

  return {
    album_id: album.id,
    drive_file_id: image.id,
    title: image.name.replace(/\.[^/.]+$/, ''),
    category: album.name,
    url: publicUrl,
    position: index,
  };
});
```

## Run Sync and Check Output

```bash
npm run sync:gallery
```

You should see output like:

```
[DEBUG] Processing image: {
  id: '1ABC123XYZ...',
  name: 'photo1.jpg',
  thumbnailLink: 'https://lh3.googleusercontent.com/...',
  webContentLink: 'https://www.googleapis.com/...',
  webViewLink: 'https://drive.google.com/file/d/...'
}
[DEBUG] Generated URL: https://drive.google.com/uc?export=view&id=1ABC123XYZ...
```

## Check the Generated URL

1. Copy the `[DEBUG] Generated URL` from the terminal
2. Paste it in your browser
3. If it shows "403 Forbidden" → Files need to be made public in Google Drive
4. If it downloads instead of displays → Expected behavior (browser will still render in `<img>` tags)
5. If it shows the image → Perfect! ✅

## Fix Based on Debug Output

### If `id` is undefined or null:

The Google Drive API response is missing the file ID. Update `lib/gdrive.js` to request more fields:

```javascript
export async function listImagesInFolder(folderId) {
  const drive = createDriveClient();

  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/' and trashed=false`,
      fields: 'files(id, name, createdTime, mimeType)', // ← Added mimeType
      orderBy: 'createdTime desc',
    });

    return (response.data.files || []).map((file) => ({
      id: file.id,
      name: file.name,
      createdTime: file.createdTime,
    }));
  } catch (error) {
    console.error('Error listing images from Google Drive:', error);
    throw new Error(`Failed to list images: ${error.message}`);
  }
}
```

### If generated URL is correct but still 403:

The Google Drive folder is NOT public. Follow these steps:

1. Go to: https://drive.google.com/drive/folders/1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb
2. Click Share (top right)
3. Change "Restricted" to "Anyone with the link"
4. Set role to "Viewer"
5. Click Done
6. Wait 1-2 minutes
7. Test the URL again

---

**After debugging, remove the console.log statements and re-sync for clean output.**

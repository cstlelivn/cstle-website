# Fix: Images Not Loading in Browsers After Publish

## Problem

Images sync successfully but don't display when viewing the gallery page in browsers (404 or permission denied errors).

## Root Cause

Google Drive files need to be **publicly accessible** for the URL format `https://drive.google.com/uc?export=view&id={fileId}` to work in `<img>` tags.

The sync script can **read** the files (because the service account has Viewer access), but browsers can't **display** them unless they're publicly shared.

---

## Solution: Make Google Drive Folder Public

### Option 1: Share the Entire Parent Folder (Recommended)

1. **Open your "Website Photos" folder:**
   https://drive.google.com/drive/folders/1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb

2. **Click the Share button** (top right)

3. **Change permissions:**
   - Click "Change to anyone with the link"
   - Set to: **Viewer**
   - Click "Done"

4. **This will make ALL subfolders and images public automatically**

5. **No need to re-sync** - The URLs in your database are already correct

6. **Test:** Open any image URL from your database:
   ```
   https://drive.google.com/uc?export=view&id=YOUR_FILE_ID
   ```
   It should display the image directly (not a download prompt or error page)

---

### Option 2: Share Individual Subfolders (More Control)

If you want to keep some folders private:

1. Open each subfolder you want to display on the website:
   - Flooring
   - Installations
   - Painting
   - Trim & Doors

2. For each folder:
   - Click **Share**
   - Change to: **Anyone with the link**
   - Role: **Viewer**
   - Click **Done**

3. This makes only specific albums public while keeping others private

---

## Verify the Fix

### Step 1: Check a Sample Image URL

1. Go to your Supabase database:
   https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/editor

2. Open the `gallery_images` table

3. Copy any `url` value (e.g., `https://drive.google.com/uc?export=view&id=1abc123...`)

4. Paste it in your browser's address bar

5. **Expected result:** The image displays directly

6. **If you see an error:** The folder is not public yet

### Step 2: Test the Gallery Page

1. Visit: https://loud-rename-20379962.figma.site/gallery

2. Images should now load correctly

3. Test in multiple browsers (Chrome, Safari, Firefox)

4. Test in incognito/private mode (to simulate visitors without Google accounts)

---

## Important Notes

### ✅ Safe for Public Websites

- **URL format is intentional** - `uc?export=view` is Google's official way to embed images
- **No "Open in Drive" required** - Direct display in `<img>` tags
- **Anyone can view, but not download/edit** - Viewer permission only

### ⚠️ Security Considerations

- **Public = Anyone with the link can view**
- Only share folders you want visible on your website
- Don't put sensitive/private photos in public folders
- You can revoke public access anytime

### 🔄 Future Uploads

- **New images in public folders** are automatically public
- No need to change permissions for each new upload
- Just run `npm run sync:gallery` to add new images to the website

---

## Alternative: Use a Different Image Host

If you prefer not to make Google Drive files public, you can:

1. **Upload images to Supabase Storage instead:**
   - More control over access
   - Built-in CDN for faster loading
   - Requires updating sync script to upload files

2. **Use a dedicated image CDN:**
   - Cloudinary, Imgix, or Cloudflare Images
   - Requires API integration

3. **Self-hosted images:**
   - Upload to your own server
   - Full control, but requires more infrastructure

---

## Quick Verification Script

Run this in your browser console on the gallery page:

```javascript
// Check if images are loading
const images = document.querySelectorAll('img[src*="drive.google.com"]');
console.log(`Found ${images.length} Google Drive images`);

images.forEach((img, i) => {
  console.log(`Image ${i + 1}:`, {
    src: img.src,
    loaded: img.complete && img.naturalHeight > 0,
    error: img.complete && img.naturalHeight === 0
  });
});
```

If `loaded: false` or `error: true`, the files need to be made public.

---

## Still Not Working?

### Check Browser Console

1. Open gallery page
2. Open browser DevTools (F12)
3. Go to Console tab
4. Look for errors like:
   - `403 Forbidden` → Files not public
   - `404 Not Found` → File IDs don't exist
   - CORS errors → (Shouldn't happen with Google Drive)

### Check Network Tab

1. Open DevTools → Network tab
2. Refresh the gallery page
3. Filter by "Img"
4. Look for red/failed requests
5. Click on a failed request to see the error response

### Verify Permissions in Google Drive

1. Open any image file in "Website Photos" folder
2. Click "Share" or "Get link"
3. Check that it says: "Anyone with the link"
4. If it says "Restricted", change it to public

---

## Summary

**TL;DR:** 
1. Make your "Website Photos" folder public in Google Drive
2. Share settings: "Anyone with the link" + "Viewer"
3. No re-sync needed - URLs are already correct
4. Test by opening an image URL directly in browser

**Time to fix:** ~30 seconds

---

**Last Updated:** January 10, 2026

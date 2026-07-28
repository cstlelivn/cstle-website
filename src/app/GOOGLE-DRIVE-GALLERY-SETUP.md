# Google Drive Gallery CMS - Setup Guide

This guide walks you through setting up the Google Drive-based CMS for your gallery page.

## Overview

The gallery system automatically syncs images from your Google Drive folder (`Website Photos`) to the Supabase database. Each subfolder becomes an album, and images are automatically imported and displayed on the website.

**Parent Folder:**
- Title: `Website Photos`
- ID: `1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb`
- URL: https://drive.google.com/drive/folders/1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb

---

## Step 1: Database Setup

Run the migration to create the required tables in Supabase:

1. Open your Supabase SQL Editor: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/sql/new
2. Copy the contents of `/supabase/migrations/create_gallery_tables.sql`
3. Paste and execute the SQL
4. Verify the tables were created:
   - `public.gallery_albums`
   - `public.gallery_images`

This creates the schema with proper Row Level Security (RLS) policies:
- ✅ Public users can READ gallery data
- ✅ Service role can INSERT/UPDATE/DELETE (for sync script)

---

## Step 2: Create Google Service Account

### 2.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a project** → **New Project**
3. Name: `Cstle Livn Gallery CMS` (or your preference)
4. Click **Create**

### 2.2 Enable Google Drive API

1. In your new project, go to **APIs & Services** → **Library**
2. Search for "Google Drive API"
3. Click **Enable**

### 2.3 Create Service Account

1. Go to **IAM & Admin** → **Service Accounts**
2. Click **+ Create Service Account**
3. Fill in details:
   - **Name:** `gallery-cms-sync`
   - **Description:** `Service account for syncing gallery images from Google Drive`
4. Click **Create and Continue**
5. Skip the optional permissions (click **Continue**)
6. Click **Done**

### 2.4 Generate JSON Key

1. Click on the newly created service account email (e.g., `gallery-cms-sync@your-project.iam.gserviceaccount.com`)
2. Go to the **Keys** tab
3. Click **Add Key** → **Create new key**
4. Choose **JSON** format
5. Click **Create**
6. A JSON file will download automatically - **SAVE THIS FILE SECURELY**

---

## Step 3: Share Google Drive Folder with Service Account

1. Open your `Website Photos` folder in Google Drive:
   https://drive.google.com/drive/folders/1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb

2. Click the **Share** button (top right)

3. Add the service account email:
   - Email: `gallery-cms-sync@your-project.iam.gserviceaccount.com`
   - Role: **Viewer** (read-only access is sufficient)

4. Uncheck "Notify people" (service accounts don't need email notifications)

5. Click **Share**

---

## Step 4: Set Environment Variables

You need to configure these environment variables for the sync script:

### 4.1 Local Development (.env.local)

Create or update `.env.local` in your project root:

```bash
# Google Drive API
GDRIVE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project",...}'
GDRIVE_GALLERY_ROOT_FOLDER="1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb"

# Supabase (for sync script)
SUPABASE_URL="https://mlxsfhdzlcxtvqeshgjx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
```

**IMPORTANT:** 
- `GDRIVE_SERVICE_ACCOUNT_KEY` must be the **entire JSON key content** on a single line (minified, no line breaks)
- You can minify JSON at: https://www.json-formatter.org/json-minifier
- Get your Supabase service role key from: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/settings/api

### 4.2 Production/CI Environment

If deploying the sync script to a server or GitHub Actions:

**For GitHub Actions:**
1. Go to your repo → **Settings** → **Secrets and variables** → **Actions**
2. Add these repository secrets:
   - `GDRIVE_SERVICE_ACCOUNT_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

**For Vercel/Netlify:**
1. Go to your project settings → Environment Variables
2. Add the same three variables

---

## Step 5: Install Dependencies

Install the required npm packages:

```bash
npm install
```

Required packages:
- `googleapis` - Google Drive API client
- `@supabase/supabase-js` - Supabase client
- `tsx` - TypeScript execution (for running the sync script)

---

## Step 6: Run Your First Sync

Now you're ready to sync images from Google Drive to your database!

```bash
npm run sync:gallery
```

### What the Sync Does:

1. **Discovers Albums** - Lists all subfolders in `Website Photos`
2. **Creates/Updates Album Records** - Upserts them into `gallery_albums` table
3. **Syncs Images** - For each album:
   - Fetches all image files from the Drive folder
   - Limits to `max_items` per album (default: 4)
   - Inserts/updates images in `gallery_images` table
   - Builds public URLs: `https://drive.google.com/uc?export=view&id={file_id}`

### Expected Output:

```
═══════════════════════════════════════════════════
  Gallery Sync: Google Drive → Supabase
═══════════════════════════════════════════════════

📂 Discovering albums from Google Drive...
   Found 5 subfolders
   - Processing: Flooring (slug: flooring)
   ✅ Album "Flooring" synced
   - Processing: Installations (slug: installations)
   ✅ Album "Installations" synced
   ...

🖼️  Syncing images for active albums...
   📁 Album: Flooring
      Found 12 images in Drive
      Syncing first 4 images (max_items: 4)
      ✅ Synced 4 images
   ...

═══════════════════════════════════════════════════
  ✅ Sync Complete!
     Albums processed: 5
     Images synced: 20
═══════════════════════════════════════════════════
```

---

## Step 7: Verify Gallery on Website

1. Open your website: https://loud-rename-20379962.figma.site/gallery
2. The gallery grid should now display images from your Google Drive
3. Each card shows:
   - Image from Drive
   - Album name as category
   - Filename (without extension) as title
   - Hover effects (zoom + overlay)

---

## Managing Your Gallery

### Adding New Albums

1. Create a new subfolder in `Website Photos` on Google Drive
2. Add images to the subfolder
3. Run `npm run sync:gallery`
4. The new album appears automatically on the website

### Adding Images to Existing Albums

1. Upload images to any subfolder in `Website Photos`
2. Run `npm run sync:gallery`
3. New images appear (limited by `max_items` per album)

### Removing Images

1. Delete images from Google Drive subfolder
2. Run `npm run sync:gallery`
3. Images are removed from the website

### Removing Albums

1. Delete the subfolder from `Website Photos`
2. Run `npm run sync:gallery`
3. Album is marked inactive (hidden from website)

### Changing Album Display Limits

By default, each album shows 4 images. To change this:

**Option 1: Update in Database**
```sql
UPDATE gallery_albums
SET max_items = 8
WHERE slug = 'flooring';
```

**Option 2: Update Default**
Edit `/supabase/migrations/create_gallery_tables.sql` and change the default value before running the migration.

---

## Automating the Sync (Optional)

### Option A: GitHub Actions (Recommended)

Create `.github/workflows/sync-gallery.yml`:

```yaml
name: Sync Gallery from Google Drive

on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC
  workflow_dispatch:     # Manual trigger button

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run gallery sync
        run: npm run sync:gallery
        env:
          GDRIVE_SERVICE_ACCOUNT_KEY: ${{ secrets.GDRIVE_SERVICE_ACCOUNT_KEY }}
          GDRIVE_GALLERY_ROOT_FOLDER: "1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb"
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
```

**Benefits:**
- ✅ Free (GitHub Actions)
- ✅ Manual trigger button in GitHub UI
- ✅ Scheduled daily sync
- ✅ Email notifications on failures

### Option B: Supabase Edge Function + pg_cron

Create a Supabase Edge Function that runs the sync logic, then schedule it:

```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule daily sync at 2 AM
SELECT cron.schedule(
  'sync-gallery-daily',
  '0 2 * * *',
  $$SELECT net.http_post(
      url:='https://mlxsfhdzlcxtvqeshgjx.supabase.co/functions/v1/sync-gallery',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
  );$$
);
```

### Option C: Server Cron Job

If you have a Node.js server running 24/7:

```bash
# Edit crontab
crontab -e

# Add this line (daily at 2 AM)
0 2 * * * cd /path/to/project && npm run sync:gallery >> /var/log/gallery-sync.log 2>&1
```

---

## Troubleshooting

### Error: "GDRIVE_SERVICE_ACCOUNT_KEY environment variable is not set"

- ✅ Check `.env.local` exists in project root
- ✅ Verify the key is on a single line (minified JSON)
- ✅ Restart your terminal/IDE after adding env vars

### Error: "Invalid JSON in GDRIVE_SERVICE_ACCOUNT_KEY"

- ✅ Minify the JSON key (no line breaks)
- ✅ Ensure proper escaping if using shell commands
- ✅ Wrap in single quotes in `.env.local`

### Error: "Failed to list subfolders: Permission denied"

- ✅ Verify you shared the folder with the service account email
- ✅ Check the service account has "Viewer" role
- ✅ Wait 1-2 minutes for Google Drive permissions to propagate

### Error: "401 Unauthorized" from Supabase

- ✅ Verify `SUPABASE_SERVICE_ROLE_KEY` is correct (not anon key)
- ✅ Check the migration created RLS policies correctly
- ✅ Test connection: `psql "postgresql://..."` (get URL from Supabase dashboard)

### Images Not Showing on Website

- ✅ Check Google Drive file permissions (service account needs access)
- ✅ Verify images are in supported formats (JPG, PNG, GIF, WebP)
- ✅ Try accessing a Drive URL directly: `https://drive.google.com/uc?export=view&id=FILE_ID`
- ✅ Check browser console for CORS or loading errors

### Sync Works, But Gallery Shows "No items"

- ✅ Verify `is_active = true` for albums: `SELECT * FROM gallery_albums;`
- ✅ Check images exist: `SELECT * FROM gallery_images;`
- ✅ Verify Supabase client config in `/utils/supabase/client.ts`
- ✅ Check browser Network tab for failed API requests

---

## File Structure Reference

```
/
├── lib/
│   ├── gdrive.ts                  # Google Drive API helper
│   └── gallery.ts                 # Gallery data fetching
├── scripts/
│   └── syncGalleryFromDrive.ts    # Main sync script
├── supabase/
│   └── migrations/
│       └── create_gallery_tables.sql  # Database schema
├── pages/
│   └── Gallery.tsx                # Gallery page component
├── content/
│   └── gallery-content.ts         # Static hero text (title/subtitle)
├── package.json                   # npm scripts
└── .env.local                     # Environment variables (create this)
```

---

## API Reference

### Google Drive Helper (`/lib/gdrive.ts`)

```typescript
// List subfolders in a parent folder
const folders = await listSubfolders(parentFolderId);
// Returns: Array<{ id: string, name: string }>

// List images in a folder
const images = await listImagesInFolder(folderId);
// Returns: Array<{ id: string, name: string, createdTime: string }>

// Build public URL for a file
const url = buildPublicUrl(fileId);
// Returns: "https://drive.google.com/uc?export=view&id={fileId}"
```

### Gallery Data Helper (`/lib/gallery.ts`)

```typescript
// Fetch all gallery items from Supabase
const items = await fetchGalleryItems();
// Returns: Array<GalleryItem>

// Group items by album
const grouped = groupByAlbum(items);
// Returns: Record<string, GalleryItem[]>
```

---

## Security Notes

⚠️ **IMPORTANT SECURITY PRACTICES:**

1. **Never commit `.env.local`** - Already in `.gitignore`
2. **Never commit the service account JSON key** - Store in environment variables only
3. **Use service role key only server-side** - Never expose in client-side code
4. **Grant minimum permissions** - Service account only needs "Viewer" role on Drive
5. **Keep RLS enabled** - Public users can only READ gallery data
6. **Rotate keys periodically** - Generate new service account keys every 90 days

---

## Next Steps

✅ **You're all set!** Your gallery is now powered by Google Drive.

**What you can do now:**
- Upload images to Google Drive subfolders
- Run `npm run sync:gallery` to update the website
- Set up automated syncing (GitHub Actions recommended)
- Customize album display limits in the database
- Monitor sync logs for errors

**Future Enhancements:**
- Add image captions/descriptions (extend `gallery_images` schema)
- Implement image reordering (manual position override)
- Add album cover images
- Create an admin UI for managing gallery settings
- Support video files from Drive

---

## Support

If you encounter issues:

1. Check the **Troubleshooting** section above
2. Review sync logs for error messages
3. Verify environment variables are set correctly
4. Test Google Drive API access manually
5. Check Supabase logs: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/logs/explorer

---

**Last Updated:** January 9, 2026  
**Project:** Cstle Livn Website  
**Supabase Project ID:** mlxsfhdzlcxtvqeshgjx  
**Drive Folder ID:** 1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb

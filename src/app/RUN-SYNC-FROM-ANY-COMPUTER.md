# 🚀 Quick Start: Running Gallery Sync for Figma-Hosted Sites

Since your website is hosted on Figma (not on your local computer), the gallery sync script needs to run separately. This guide shows you exactly how to sync your Google Drive gallery photos to your website.

---

## ⚡ TL;DR - Run This Now

```bash
# 1. Download the project files to your computer
# 2. Open terminal in the project folder
# 3. Run this command:
node run-sync.js
```

That's it! The script handles everything automatically.

---

## 📋 Prerequisites

Before running the sync, make sure you have:

- ✅ **Node.js installed** (version 18 or higher)
  - Check: `node --version`
  - Download: https://nodejs.org/

- ✅ **Project files downloaded** to your computer
  - All the files from your Figma project
  - Including the `.env.local` file with your credentials

- ✅ **Google Drive folder shared** with service account
  - Folder ID: `1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb`
  - Shared with: `gallery-cms-sync@gallery-cms-483822.iam.gserviceaccount.com`

- ✅ **Supabase tables created** (one-time setup)
  - See section "Database Setup" below

---

## 🎯 Step-by-Step Instructions

### Step 1: Download Project Files

Since your website is hosted on Figma, you need to get the project files:

1. In Figma Make, click on your project
2. Download all project files (or clone from Git if you're using version control)
3. Save to a folder on your computer (e.g., `~/Documents/cstlelivn-website`)

**Important files you need:**
- `.env.local` (already created with your credentials)
- `run-sync.js` (the sync runner script)
- `scripts/syncGalleryFromDrive.ts` (the actual sync logic)
- `lib/gdrive.ts` (Google Drive API helper)
- `package.json` (dependencies list)

### Step 2: Open Terminal

**On Mac:**
1. Open Terminal app
2. Navigate to your project folder:
   ```bash
   cd ~/Documents/cstlelivn-website
   ```

**On Windows:**
1. Open Command Prompt or PowerShell
2. Navigate to your project folder:
   ```cmd
   cd C:\Users\YourName\Documents\cstlelivn-website
   ```

### Step 3: Run the Sync

```bash
node run-sync.js
```

The script will:
1. ✅ Check that `.env.local` exists
2. ✅ Load your credentials
3. ✅ Install dependencies if needed (automatically runs `npm install`)
4. ✅ Connect to Google Drive and Supabase
5. ✅ Sync all albums and images
6. ✅ Show you the results

**Expected output:**
```
═══════════════════════════════════════════════════════════
  Gallery Sync Runner
═══════════════════════════════════════════════════════════

Step 1: Checking environment...
✅ Found .env.local file
✅ Environment variables loaded

Step 2: Checking dependencies...
✅ Dependencies ready

Step 3: Running sync...
🚀 Starting gallery sync...

═══════════════════════════════════════════════════════════
  Gallery Sync: Google Drive → Supabase
═══════════════════════════════════════════════════════════

📂 Discovering albums from Google Drive...
   Found 3 subfolders
   - Processing: Kitchen Renovations (slug: kitchen-renovations)
   ✅ Album "Kitchen Renovations" synced
   - Processing: Bathroom Projects (slug: bathroom-projects)
   ✅ Album "Bathroom Projects" synced
   - Processing: Custom Millwork (slug: custom-millwork)
   ✅ Album "Custom Millwork" synced

🖼️  Syncing images for active albums...
   📁 Album: Kitchen Renovations
      Found 8 images in Drive
      Syncing first 4 images (max_items: 4)
      ✅ Synced 4 images
   📁 Album: Bathroom Projects
      Found 6 images in Drive
      Syncing first 4 images (max_items: 4)
      ✅ Synced 4 images
   📁 Album: Custom Millwork
      Found 10 images in Drive
      Syncing first 4 images (max_items: 4)
      ✅ Synced 4 images

═══════════════════════════════════════════════════════════
  ✅ Sync Complete!
     Albums processed: 3
     Images synced: 12
═══════════════════════════════════════════════════════════

🎉 Sync completed successfully!

═══════════════════════════════════════════════════════════
  ✅ All Done!
═══════════════════════════════════════════════════════════

Your gallery has been synced from Google Drive to Supabase.
The website will now display the latest images.
```

### Step 4: Check Your Website

1. Visit your website: https://cstlelivn.ca/gallery (or your Figma preview URL)
2. You should see all your photos from Google Drive!
3. The gallery will show images from all subfolders in your parent folder

---

## 🗄️ Database Setup (One-Time)

If you haven't already created the database tables, you need to do this **once**:

### Option A: Run SQL Migration (Recommended)

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx
2. Click "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the contents of `/supabase/migrations/create_gallery_tables.sql`
5. Paste into the SQL editor
6. Click "Run" button

### Option B: Copy-Paste This SQL

Just copy this and run it in Supabase SQL Editor:

```sql
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

-- 3. Create indexes
CREATE INDEX IF NOT EXISTS gallery_images_album_id_idx ON public.gallery_images(album_id);
CREATE INDEX IF NOT EXISTS gallery_images_album_position_idx ON public.gallery_images(album_id, position);

-- 4. Enable RLS
ALTER TABLE public.gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for gallery_albums
DROP POLICY IF EXISTS "gallery_albums_public_read" ON public.gallery_albums;
CREATE POLICY "gallery_albums_public_read" 
  ON public.gallery_albums FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "gallery_albums_service_all" ON public.gallery_albums;
CREATE POLICY "gallery_albums_service_all" 
  ON public.gallery_albums FOR ALL USING (auth.role() = 'service_role');

-- 6. RLS Policies for gallery_images
DROP POLICY IF EXISTS "gallery_images_public_read" ON public.gallery_images;
CREATE POLICY "gallery_images_public_read" 
  ON public.gallery_images FOR SELECT USING (true);

DROP POLICY IF EXISTS "gallery_images_service_all" ON public.gallery_images;
CREATE POLICY "gallery_images_service_all" 
  ON public.gallery_images FOR ALL USING (auth.role() = 'service_role');

-- 7. Grant permissions
GRANT SELECT ON public.gallery_albums TO anon, authenticated;
GRANT SELECT ON public.gallery_images TO anon, authenticated;
GRANT ALL ON public.gallery_albums TO service_role;
GRANT ALL ON public.gallery_images TO service_role;
```

**Verify it worked:**
- Go to "Table Editor" in Supabase
- You should see two new tables: `gallery_albums` and `gallery_images`

---

## 🔄 When to Run the Sync

Run the sync script whenever you:

- ✅ Add new photos to Google Drive
- ✅ Create new subfolders (albums) in your parent folder
- ✅ Remove or rename folders
- ✅ Want to update what shows on the website

**How often?**
- Manual: Run the script whenever you update photos (recommended for now)
- Automated: Set up a cron job or GitHub Action to run daily (see "Automation" below)

---

## 🤖 Automating the Sync (Optional)

### Option 1: Cron Job (Mac/Linux)

Run the sync automatically every day at 2 AM:

```bash
# Edit crontab
crontab -e

# Add this line (replace with your actual path)
0 2 * * * cd /path/to/cstlelivn-website && node run-sync.js >> /tmp/gallery-sync.log 2>&1
```

### Option 2: Task Scheduler (Windows)

1. Open Task Scheduler
2. Create new task
3. Trigger: Daily at 2:00 AM
4. Action: Run `node.exe` with argument `C:\path\to\cstlelivn-website\run-sync.js`

### Option 3: GitHub Actions (Advanced)

If your code is in GitHub, you can automate syncs with GitHub Actions:

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
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: node run-sync.js
        env:
          GDRIVE_SERVICE_ACCOUNT_KEY: ${{ secrets.GDRIVE_SERVICE_ACCOUNT_KEY }}
          GDRIVE_GALLERY_ROOT_FOLDER: ${{ secrets.GDRIVE_GALLERY_ROOT_FOLDER }}
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
```

Then add your credentials as GitHub Secrets in Settings → Secrets and variables → Actions.

---

## 🐛 Troubleshooting

### Error: "node: command not found"

**Problem:** Node.js is not installed.

**Solution:** 
1. Download Node.js from https://nodejs.org/
2. Install it
3. Restart your terminal
4. Try again

### Error: ".env.local file not found"

**Problem:** The script can't find your credentials file.

**Solution:**
1. Make sure you're in the correct folder (`cd` to project root)
2. Verify `.env.local` exists: `ls -la .env.local` (Mac) or `dir .env.local` (Windows)
3. If missing, download the file from your project

### Error: "GDRIVE_SERVICE_ACCOUNT_KEY environment variable is not set"

**Problem:** Your `.env.local` file is missing or incomplete.

**Solution:**
1. Open `.env.local` in a text editor
2. Make sure all 4 variables are set:
   - `GDRIVE_SERVICE_ACCOUNT_KEY`
   - `GDRIVE_GALLERY_ROOT_FOLDER`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Values should be in single quotes: `KEY='value'`
4. No extra spaces around the `=` sign

### Error: "Invalid JSON in GDRIVE_SERVICE_ACCOUNT_KEY"

**Problem:** The service account JSON key is malformed.

**Solution:**
1. The entire JSON must be on ONE line (no line breaks)
2. It should be wrapped in single quotes: `KEY='{"type":"service_account",...}'`
3. Check for any accidental characters or missing quotes

### Error: "Permission denied" on Google Drive

**Problem:** Service account doesn't have access to your folder.

**Solution:**
1. Open https://drive.google.com/drive/folders/1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb
2. Click "Share" button
3. Add this email: `gallery-cms-sync@gallery-cms-483822.iam.gserviceaccount.com`
4. Set permission to "Viewer"
5. Click "Send"
6. Try running the sync again

### Error: "relation \"gallery_albums\" does not exist"

**Problem:** Database tables haven't been created yet.

**Solution:**
1. See "Database Setup" section above
2. Run the SQL migration in Supabase
3. Try the sync again

### Sync runs but website doesn't update

**Problem:** Images are in the database but not showing on the website.

**Possible causes:**
1. **Cache:** Clear your browser cache and refresh
2. **RLS Policies:** Make sure public read policies are enabled (see SQL above)
3. **Image URLs:** Verify images in Supabase have valid Google Drive URLs
4. **Gallery component:** Check browser console for errors

**Debug checklist:**
- [ ] Go to Supabase → Table Editor → `gallery_images`
- [ ] Check if images exist with valid URLs
- [ ] Open one of the URLs in a browser - does the image load?
- [ ] Check browser console on your Gallery page for errors

---

## 📁 How Google Drive Sync Works

### Folder Structure

Your Google Drive folder structure becomes your gallery albums:

```
📁 Website Photos (Root: 1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb)
  ├── 📁 Kitchen Renovations      → Album on website
  │   ├── 🖼️ kitchen-1.jpg        → Gallery image
  │   ├── 🖼️ kitchen-2.jpg        → Gallery image
  │   └── 🖼️ kitchen-3.jpg        → Gallery image
  ├── 📁 Bathroom Projects        → Album on website
  │   ├── 🖼️ bathroom-1.jpg       → Gallery image
  │   └── 🖼️ bathroom-2.jpg       → Gallery image
  └── 📁 Custom Millwork          → Album on website
      ├── 🖼️ millwork-1.jpg       → Gallery image
      └── 🖼️ millwork-2.jpg       → Gallery image
```

### What Gets Synced

- ✅ **Subfolders** → Each becomes an album
- ✅ **Images in subfolders** → Displayed in gallery
- ✅ **Image order** → Sorted by upload date (newest first)
- ✅ **Max items** → 4 images per album by default (configurable in database)
- ❌ **Files in root folder** → Ignored (must be in subfolders)
- ❌ **Non-image files** → Ignored (only JPG, PNG, etc.)

### Image Limits

By default, only 4 images from each album are shown on the website. To change this:

1. Go to Supabase → Table Editor → `gallery_albums`
2. Find the album row
3. Edit the `max_items` column (e.g., change from 4 to 10)
4. Run the sync again

---

## ✅ Verification Steps

After running the sync, verify everything worked:

### 1. Check Supabase Database

1. Go to: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/editor
2. Click on `gallery_albums` table
3. You should see rows for each of your Google Drive subfolders
4. Click on `gallery_images` table
5. You should see rows for all your images with Google Drive URLs

### 2. Check Website

1. Visit: https://cstlelivn.ca/gallery (or your Figma preview URL)
2. Scroll down to see the gallery grid
3. You should see all your synced images
4. Hover over images to see titles and album names

### 3. Test Image Loading

1. Right-click on a gallery image
2. Select "Open image in new tab"
3. The Google Drive image should load directly
4. If you get an error, check sharing permissions on your Drive folder

---

## 🎓 Understanding the Files

### Core Files

| File | Purpose |
|------|---------|
| `.env.local` | Your credentials (NEVER commit to Git) |
| `run-sync.js` | Main script you run to sync |
| `scripts/syncGalleryFromDrive.ts` | Logic for syncing albums/images |
| `lib/gdrive.ts` | Google Drive API helper functions |
| `lib/gallery.ts` | Frontend data fetching (used by website) |

### How It Works Together

```
1. YOU run:          node run-sync.js
                         ↓
2. Script loads:     .env.local (credentials)
                         ↓
3. Script calls:     scripts/syncGalleryFromDrive.ts
                         ↓
4. Script uses:      lib/gdrive.ts (Google Drive API)
                         ↓
5. Script writes:    Supabase database (gallery_albums + gallery_images)
                         ↓
6. Website reads:    lib/gallery.ts (fetches from Supabase)
                         ↓
7. Website shows:    Gallery page with your photos!
```

---

## 💡 Tips and Best Practices

### Organizing Your Google Drive

1. **Use descriptive folder names** → They become album names on the website
   - ✅ "Kitchen Renovations 2024"
   - ✅ "Bathroom Remodels"
   - ❌ "Folder1", "Photos", "New"

2. **Name images clearly** → Filenames become image titles
   - ✅ "modern-kitchen-island.jpg"
   - ✅ "marble-bathroom-vanity.jpg"
   - ❌ "IMG_1234.jpg", "photo.jpg"

3. **Use high-quality images**
   - Recommended: 1200-2000px wide
   - Format: JPG or PNG
   - Keep file size under 2MB for fast loading

4. **Keep it organized**
   - One project type per folder
   - Remove old/unused images
   - Run sync after making changes

### Security Best Practices

- 🔒 **Never commit `.env.local`** to Git (it's already in `.gitignore`)
- 🔒 **Never share your service account key** publicly
- 🔒 **Never share your Supabase service role key**
- 🔒 **Keep Google Drive folder permissions minimal** (Viewer only for service account)
- 🔒 **Use HTTPS** for all image URLs (Google Drive does this automatically)

### Performance Tips

- Run sync during low-traffic hours (e.g., 2 AM)
- Limit albums to 4-6 images each for faster page loads
- Compress images before uploading to Google Drive
- Use descriptive but short folder/file names

---

## 🆘 Need More Help?

### Documentation Files

- `/GOOGLE-DRIVE-GALLERY-SETUP.md` - Full setup guide with screenshots
- `/GALLERY-SYNC-QUICKSTART.md` - Quick reference for common tasks
- `/INSTALLATION-STEPS.md` - Step-by-step installation guide
- `/GALLERY-CMS-IMPLEMENTATION-SUMMARY.md` - Technical architecture details

### Check These If You Have Issues

1. **Database problems** → See `/supabase/migrations/create_gallery_tables.sql`
2. **Google Drive API errors** → See comments in `/lib/gdrive.ts`
3. **Frontend not showing images** → Check `/pages/Gallery.tsx` and `/lib/gallery.ts`
4. **Environment variable issues** → See `.env.example`

### Useful Links

- Supabase Dashboard: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx
- Google Drive Folder: https://drive.google.com/drive/folders/1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb
- Website: https://cstlelivn.ca
- Gallery Page: https://cstlelivn.ca/gallery

---

## 🎉 You're All Set!

Now you can:
- ✅ Add photos to Google Drive subfolders
- ✅ Run `node run-sync.js` to sync
- ✅ See updates on your website immediately
- ✅ Manage your gallery without touching code

**Next steps:**
1. Try adding a test photo to one of your Drive folders
2. Run the sync script
3. Check your website to see it appear!

Enjoy your automated gallery CMS! 🚀

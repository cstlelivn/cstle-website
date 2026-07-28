# Gallery Sync: How to Run from Your Mac

## 🎯 Overview

This document explains how to sync your Google Drive gallery photos to your website's Supabase database from your local Mac.

## 📦 What You Have

All the necessary code is already built and ready to use:

1. **✅ Sync Script** (`/scripts/syncGalleryFromDrive.ts`)
   - Reads Google Drive folders and images
   - Syncs them to Supabase database
   - Idempotent (safe to run multiple times)

2. **✅ Node Runner** (`/run-sync.js`)
   - Loads environment variables
   - Validates setup
   - Provides nice CLI output

3. **✅ Database Schema** (`/supabase/migrations/create_gallery_tables.sql`)
   - Tables for albums and images
   - RLS policies for security
   - Ready to deploy

4. **✅ Frontend Integration** (`/pages/Gallery.tsx`)
   - Already fetches from Supabase
   - Displays dynamic content
   - No code changes needed

## 🚀 Quick Start (3 Commands)

```bash
# 1. Navigate to your exported project folder
cd ~/path/to/Cstle\ Make\ Website

# 2. Install dependencies (first time only)
npm install

# 3. Run the sync
npm run sync:gallery
```

That's it! Your gallery is now synced.

## ⚙️ One-Time Setup (Before First Run)

### Step 1: Create .env.local

```bash
cp .env.example .env.local
```

### Step 2: Fill in Your Credentials

Open `.env.local` and add your keys:

```bash
# Google Service Account JSON (minified - single line)
GDRIVE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}

# Google Drive folder ID (already set)
GDRIVE_GALLERY_ROOT_FOLDER=1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb

# Supabase project URL
SUPABASE_URL=https://mlxsfhdzlcxtvqeshgjx.supabase.co

# Supabase service role key (from dashboard)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
```

**Where to get these:**

1. **Service Account Key**: Google Cloud Console → IAM & Admin → Service Accounts → Create JSON key
2. **Supabase Keys**: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/settings/api

### Step 3: Run Database Migration (One Time)

1. Go to Supabase SQL Editor:
   - https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/sql

2. Copy and run the SQL from:
   - `/supabase/migrations/create_gallery_tables.sql`

This creates the `gallery_albums` and `gallery_images` tables.

### Step 4: Share Google Drive Folder

1. Go to your "Website Photos" folder:
   - https://drive.google.com/drive/folders/1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb

2. Click "Share" and add your service account email (found in the JSON key as `client_email`)

3. Grant "Viewer" access

## 🖼️ How to Organize Google Drive

The sync script reads your Google Drive folder structure:

```
📁 Website Photos (Root: 1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb)
├── 📁 Kitchen Remodel       ← This becomes an album
│   ├── 🖼️ photo1.jpg
│   ├── 🖼️ photo2.jpg
│   ├── 🖼️ photo3.jpg
│   └── 🖼️ photo4.jpg
├── 📁 Bathroom Finishes     ← This becomes an album
│   ├── 🖼️ image1.png
│   └── 🖼️ image2.png
└── 📁 Custom Millwork       ← This becomes an album
    └── 🖼️ work.jpg
```

**Rules:**
- Each **subfolder** = 1 album on the website
- Folder name = Album name (e.g., "Kitchen Remodel")
- Only image files (jpg, jpeg, png, webp) are synced
- First **4 images** per album are displayed (configurable)
- Images sorted by creation date (newest first)

## 🔄 Regular Workflow

### Adding New Photos

1. Upload photos to appropriate Google Drive folder
2. Run sync:
   ```bash
   npm run sync:gallery
   ```
3. Check your website - new photos appear automatically!

### Creating New Albums

1. Create a new subfolder in "Website Photos"
2. Add at least 4 photos
3. Run sync:
   ```bash
   npm run sync:gallery
   ```
4. New album appears on the Gallery page

### Removing Photos

1. Delete photos from Google Drive
2. Run sync:
   ```bash
   npm run sync:gallery
   ```
3. Removed photos disappear from website

## 📊 What Happens During Sync

```
Step 1: Checking environment...
✅ Found .env.local file
✅ Environment variables loaded

Step 2: Checking dependencies...
✅ Dependencies ready

Step 3: Running sync...

📂 Discovering albums from Google Drive...
   Found 3 subfolders
   - Processing: Kitchen Remodel (slug: kitchen-remodel)
   ✅ Album "Kitchen Remodel" synced
   ...

🖼️  Syncing images for active albums...
   📁 Album: Kitchen Remodel
      Found 8 images in Drive
      Syncing first 4 images (max_items: 4)
      ✅ Synced 4 images
   ...

✅ Sync Complete!
   Albums processed: 3
   Images synced: 12
```

## 🛠️ Troubleshooting

### Error: ".env.local file not found"
**Fix**: Create it from the template:
```bash
cp .env.example .env.local
```

### Error: "GDRIVE_SERVICE_ACCOUNT_KEY not set"
**Fix**: Open `.env.local` and paste your service account JSON key (minified, single line)

### Error: "Permission denied" on Google Drive
**Fix**: Share the "Website Photos" folder with your service account email

### No images showing on website
**Check**:
1. Sync completed successfully (no errors)
2. Images exist in subfolders (not in root folder)
3. Supabase tables have data:
   - https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/editor

## 🔒 Security Notes

- ✅ `.env.local` is already in `.gitignore`
- ✅ Never commit API keys to version control
- ✅ Service role key is for local use only
- ✅ Google Drive folder should not be public

## 📚 File Structure

```
Cstle Make Website/
├── .env.local                          ← Create this with your secrets
├── .env.example                        ← Template
├── package.json                        ← npm scripts
├── run-sync.js                         ← Sync runner
├── scripts/
│   └── syncGalleryFromDrive.ts        ← Main sync logic
├── lib/
│   ├── gdrive.ts                      ← Google Drive API
│   └── gallery.ts                     ← Data fetching
├── pages/
│   └── Gallery.tsx                    ← Gallery page (auto-updates)
└── supabase/
    └── migrations/
        └── create_gallery_tables.sql  ← Database schema
```

## ✅ Verification

After sync, verify everything worked:

1. **Check CLI Output**: Should show "Sync Complete!" with counts
2. **Check Supabase**: Tables should have data:
   - https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/editor
3. **Check Website**: Gallery page should show your photos:
   - https://loud-rename-20379962.figma.site/Gallery

## 🎯 Next Steps

1. **Run your first sync** following the Quick Start above
2. **Test by adding a photo** to Google Drive and re-syncing
3. **Adjust max_items** in the database if you want more/fewer photos per album
4. **Set up automated sync** (optional) using cron or GitHub Actions

## 📖 Additional Documentation

- **Detailed Setup**: `/GALLERY-SYNC-SETUP.md`
- **Quick Checklist**: `/GALLERY-SYNC-CHECKLIST.md`
- **Full Technical Guide**: `/GOOGLE-DRIVE-GALLERY-SETUP.md`
- **API Reference**: See inline comments in code files

---

**Ready to sync?** Run:
```bash
npm run sync:gallery
```

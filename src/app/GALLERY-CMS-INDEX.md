# 📸 Google Drive Gallery CMS - Complete Setup

Your gallery is now fully configured to sync from Google Drive! This index helps you find what you need.

---

## 🎯 Start Here

**First time setup?** → [`/START-HERE-GALLERY-SYNC.md`](/START-HERE-GALLERY-SYNC.md)

**Need detailed instructions?** → [`/RUN-SYNC-FROM-ANY-COMPUTER.md`](/RUN-SYNC-FROM-ANY-COMPUTER.md)

---

## 📋 Quick Reference

### Run the Sync

```bash
node run-sync.js
```

### How Often to Run

- **Manual:** After adding photos to Google Drive
- **Automated:** Set up cron job or GitHub Actions (see documentation)

### What Gets Synced

- ✅ All subfolders in `1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb` → Albums
- ✅ All images in those subfolders → Gallery images
- ✅ Up to 4 images per album (configurable)

---

## 📁 File Reference

### Essential Files

| File | Purpose | When to Use |
|------|---------|-------------|
| `START-HERE-GALLERY-SYNC.md` | Quick 3-step setup guide | First time setup |
| `RUN-SYNC-FROM-ANY-COMPUTER.md` | Complete documentation | Troubleshooting & automation |
| `SETUP-GALLERY-DATABASE.sql` | Database setup script | One-time database setup |
| `.env.local` | Your credentials | Already configured! |
| `run-sync.js` | Main sync runner | Run this to sync |

### Code Files

| File | Purpose |
|------|---------|
| `scripts/syncGalleryFromDrive.ts` | Core sync logic |
| `lib/gdrive.ts` | Google Drive API helper |
| `lib/gallery.ts` | Frontend data fetching |
| `pages/Gallery.tsx` | Gallery page component |
| `package.json` | Dependencies list |

### Documentation

| File | Purpose |
|------|---------|
| `GOOGLE-DRIVE-GALLERY-SETUP.md` | Full technical documentation |
| `GALLERY-SYNC-QUICKSTART.md` | Quick reference card |
| `INSTALLATION-STEPS.md` | Detailed step-by-step guide |
| `GALLERY-CMS-IMPLEMENTATION-SUMMARY.md` | Architecture overview |

---

## 🔗 Important Links

- **Supabase Dashboard:** https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx
- **Google Drive Folder:** https://drive.google.com/drive/folders/1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb
- **Live Gallery Page:** https://cstlelivn.ca/gallery
- **Admin App:** https://admin.cstlelivn.ca (manages all content)

---

## ✅ Setup Checklist

### One-Time Setup (Already Done!)

- [x] Google Cloud Project created
- [x] Google Drive API enabled
- [x] Service account created
- [x] Service account email: `gallery-cms-sync@gallery-cms-483822.iam.gserviceaccount.com`
- [x] Google Drive folder shared with service account
- [x] `.env.local` file created with credentials
- [x] All project files ready to download

### What You Need to Do

- [ ] Run the SQL migration in Supabase (one time only)
- [ ] Download project files to your computer
- [ ] Run `node run-sync.js` for the first sync
- [ ] Verify photos appear on website

---

## 🔄 Regular Workflow

1. **Add photos to Google Drive**
   - Upload to subfolders in: https://drive.google.com/drive/folders/1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb
   - Create new subfolders to create new albums

2. **Run the sync**
   ```bash
   node run-sync.js
   ```

3. **Check your website**
   - Visit: https://cstlelivn.ca/gallery
   - Photos should appear immediately!

---

## 🎨 How It Works

```
Google Drive                  Your Computer              Supabase Database           Website
─────────────                ─────────────              ─────────────────           ───────
📁 Website Photos
  ├── 📁 Kitchens       →    node run-sync.js    →    gallery_albums       →    Gallery Page
  │   ├── 🖼️ image1.jpg                                gallery_images            (cstlelivn.ca/gallery)
  │   └── 🖼️ image2.jpg
  ├── 📁 Bathrooms
  └── 📁 Millwork

                              Uses credentials from:
                              .env.local
```

### Data Flow

1. **Google Drive** stores your original images (source of truth)
2. **Sync script** discovers albums and images via API
3. **Supabase** stores metadata and URLs in database
4. **Website** fetches from Supabase and displays images
5. **Image URLs** point directly to Google Drive (fast CDN)

---

## 🗄️ Database Tables

### `gallery_albums`

Stores info about each album (Google Drive subfolder):

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Unique identifier |
| `slug` | TEXT | URL-friendly name ("kitchen-renovations") |
| `name` | TEXT | Display name ("Kitchen Renovations") |
| `drive_folder_id` | TEXT | Google Drive folder ID |
| `max_items` | INT | Max images to show (default: 4) |
| `is_active` | BOOL | Show/hide album |
| `created_at` | TIMESTAMP | When discovered |

### `gallery_images`

Stores info about each image:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Unique identifier |
| `album_id` | UUID | Which album this belongs to |
| `drive_file_id` | TEXT | Google Drive file ID |
| `title` | TEXT | Image title (from filename) |
| `category` | TEXT | Album/category name |
| `url` | TEXT | Google Drive public URL |
| `position` | INT | Sort order (0 = first) |
| `created_at` | TIMESTAMP | When synced |

---

## 🔒 Security

### What's Protected

- ✅ `.env.local` is in `.gitignore` (never committed)
- ✅ Service account has minimal permissions (Viewer only)
- ✅ Service role key only used server-side (sync script)
- ✅ Database has RLS policies (public can only read)
- ✅ Google Drive images are public (read-only URLs)

### What to Never Do

- ❌ Never commit `.env.local` to Git
- ❌ Never share your service account key
- ❌ Never share your Supabase service role key
- ❌ Never expose credentials in client-side code
- ❌ Never give service account more than Viewer access

---

## 🐛 Common Issues

### Sync doesn't run

**Check:**
- [ ] Node.js installed? (`node --version`)
- [ ] In correct folder? (`ls -la .env.local`)
- [ ] `.env.local` exists and has all 4 variables?

**Fix:**
- Install Node.js from https://nodejs.org/
- Navigate to project root: `cd ~/path/to/project`
- Check `.env.local` contents

### Permission denied on Google Drive

**Check:**
- [ ] Is folder shared with service account email?
- [ ] Service account has Viewer permission?

**Fix:**
1. Open: https://drive.google.com/drive/folders/1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb
2. Click "Share"
3. Add: `gallery-cms-sync@gallery-cms-483822.iam.gserviceaccount.com`
4. Set to "Viewer"
5. Try sync again

### Database error

**Check:**
- [ ] Have you run the SQL migration?
- [ ] Do `gallery_albums` and `gallery_images` tables exist?

**Fix:**
1. Go to Supabase SQL Editor
2. Run the contents of `SETUP-GALLERY-DATABASE.sql`
3. Verify tables exist in Table Editor
4. Try sync again

### Images don't show on website

**Check:**
- [ ] Are images in Supabase database?
- [ ] Do image URLs work when opened directly?
- [ ] Is browser cache cleared?
- [ ] Are there JavaScript errors in console?

**Fix:**
1. Check Supabase Table Editor → `gallery_images`
2. Copy an image URL and open in browser
3. Clear cache: Cmd/Ctrl + Shift + R
4. Check browser console (F12) for errors

---

## 🚀 Automation Options

### Option 1: Cron Job (Mac/Linux)

```bash
# Run sync every day at 2 AM
crontab -e

# Add this line:
0 2 * * * cd /path/to/project && node run-sync.js >> /tmp/gallery-sync.log 2>&1
```

### Option 2: Task Scheduler (Windows)

1. Open Task Scheduler
2. Create Basic Task
3. Daily at 2:00 AM
4. Run: `node.exe C:\path\to\project\run-sync.js`

### Option 3: GitHub Actions

Create `.github/workflows/sync-gallery.yml`:

```yaml
name: Sync Gallery
on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM
  workflow_dispatch:     # Manual trigger

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: node run-sync.js
        env:
          GDRIVE_SERVICE_ACCOUNT_KEY: ${{ secrets.GDRIVE_SERVICE_ACCOUNT_KEY }}
          GDRIVE_GALLERY_ROOT_FOLDER: ${{ secrets.GDRIVE_GALLERY_ROOT_FOLDER }}
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
```

Add credentials in: GitHub Settings → Secrets and variables → Actions

---

## 📊 Statistics

After running sync, you can check:

### In Terminal

Look for output like:
```
Albums processed: 3
Images synced: 12
```

### In Supabase

Go to Table Editor:
- `gallery_albums` → See all your albums
- `gallery_images` → See all your images

### On Website

Visit https://cstlelivn.ca/gallery and count visible images

---

## 💡 Pro Tips

### Organizing Google Drive

1. **Use descriptive folder names**
   - ✅ "Kitchen Renovations 2024"
   - ❌ "Folder1"

2. **Name images clearly**
   - ✅ "modern-kitchen-island.jpg"
   - ❌ "IMG_1234.jpg"

3. **Optimal image specs**
   - Width: 1200-2000px
   - Format: JPG (smaller) or PNG (higher quality)
   - File size: Under 2MB

### Changing Images Per Album

Default is 4 images per album. To change:

1. Go to Supabase → Table Editor → `gallery_albums`
2. Find the album row
3. Edit `max_items` column (e.g., change to 8)
4. Run sync again

### Testing New Features

1. Create a test subfolder: "Test Album"
2. Upload 1-2 test images
3. Run sync: `node run-sync.js`
4. Check website to see new album
5. Delete album from Drive when done
6. Run sync again to remove from website

---

## 🎓 Understanding the Architecture

### Frontend (Website)

- **Gallery Page:** `pages/Gallery.tsx`
- **Data Fetcher:** `lib/gallery.ts`
- **Supabase Client:** `utils/supabase/client.ts`

**How it works:**
1. Page loads → calls `fetchGalleryItems()`
2. Fetches from Supabase `gallery_images` table
3. Joins with `gallery_albums` to get album info
4. Displays images in a responsive grid
5. Images load directly from Google Drive URLs

### Backend (Sync Script)

- **Main Runner:** `run-sync.js`
- **Sync Logic:** `scripts/syncGalleryFromDrive.ts`
- **Google Drive API:** `lib/gdrive.ts`

**How it works:**
1. Load credentials from `.env.local`
2. Connect to Google Drive API
3. List all subfolders in root folder
4. For each subfolder:
   - Upsert album to `gallery_albums`
   - List all images in folder
   - Delete old images for this album
   - Insert new images to `gallery_images`
5. Mark removed albums as inactive

### Database (Supabase)

**Tables:**
- `gallery_albums` - Album metadata
- `gallery_images` - Image metadata

**RLS Policies:**
- Public: Can SELECT active albums and all images
- Service role: Full access (for sync script)

**Why this architecture?**
- ✅ Fast page loads (metadata in database, images on CDN)
- ✅ Secure (service role key only used server-side)
- ✅ Flexible (can filter, sort, paginate in future)
- ✅ Reliable (database is source of truth for website)

---

## 🆘 Getting Help

### Documentation Files

Read these in order if you get stuck:

1. `START-HERE-GALLERY-SYNC.md` - Quick start guide
2. `RUN-SYNC-FROM-ANY-COMPUTER.md` - Detailed instructions
3. `GOOGLE-DRIVE-GALLERY-SETUP.md` - Full technical documentation
4. `GALLERY-CMS-IMPLEMENTATION-SUMMARY.md` - Architecture details

### Inline Documentation

Each code file has detailed comments:
- `lib/gdrive.ts` - Google Drive API setup
- `scripts/syncGalleryFromDrive.ts` - Sync script internals
- `lib/gallery.ts` - Frontend data fetching

### External Resources

- **Supabase Docs:** https://supabase.com/docs
- **Google Drive API:** https://developers.google.com/drive
- **Node.js Docs:** https://nodejs.org/docs

---

## ✅ Success Criteria

You'll know everything is working when:

- [x] SQL migration runs without errors
- [x] Sync script completes successfully
- [x] Albums appear in `gallery_albums` table
- [x] Images appear in `gallery_images` table
- [x] Gallery page shows all images
- [x] Images load when clicked
- [x] Hover effects work on images
- [x] New photos sync when you add them to Drive

---

## 🎉 You're Done!

Your gallery CMS is fully configured and ready to use!

**Next steps:**
1. Add photos to Google Drive
2. Run the sync
3. Watch them appear on your website!

**Questions?** Check the documentation files listed above.

**Everything working?** Enjoy your automated gallery! 🚀

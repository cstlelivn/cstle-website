# ✅ SETUP COMPLETE - Gallery Sync Ready!

**Your Google Drive Gallery CMS is fully configured and ready to use.**

---

## 📦 What's Included

### ✅ Configuration Files
- `.env.local` - All credentials configured (Google Drive + Supabase)
- `.env.example` - Template for future reference
- `.gitignore` - Protects credentials from Git commits

### ✅ Sync Scripts
- `run-sync.js` - Main runner (use this!)
- `scripts/syncGalleryFromDrive.ts` - Core sync logic
- `lib/gdrive.ts` - Google Drive API helper
- `lib/gallery.ts` - Website data fetching

### ✅ Database Setup
- `SETUP-GALLERY-DATABASE.sql` - Ready to run in Supabase
- `supabase/migrations/create_gallery_tables.sql` - Same schema (backup)

### ✅ Documentation
- `START-HERE-GALLERY-SYNC.md` ⭐ **Best starting point**
- `QUICK-START-GALLERY-SYNC.md` - Super fast setup (10 min)
- `RUN-SYNC-FROM-ANY-COMPUTER.md` - Complete guide with troubleshooting
- `GALLERY-CMS-INDEX.md` - Master index of all documentation
- `GOOGLE-DRIVE-GALLERY-SETUP.md` - Technical deep-dive
- `GALLERY-SYNC-QUICKSTART.md` - Quick reference card
- `INSTALLATION-STEPS.md` - Step-by-step walkthrough

---

## 🎯 What You Need to Do

Since your website is hosted on Figma (not locally), follow these 3 steps:

### Step 1: Set Up Database (5 min, ONE TIME ONLY)

1. Go to: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx
2. Click "SQL Editor" → "New Query"
3. Copy ALL text from `SETUP-GALLERY-DATABASE.sql`
4. Paste into SQL Editor
5. Click "Run"
6. Verify: "Table Editor" should show `gallery_albums` and `gallery_images`

✅ **Done once, never repeat.**

### Step 2: Download Files to Your Computer

Download these files to a folder on your computer:

```
Required files:
✅ .env.local
✅ run-sync.js
✅ package.json
✅ scripts/syncGalleryFromDrive.ts
✅ lib/gdrive.ts
✅ lib/gallery.ts
```

Save them to:
- Mac: `~/Documents/cstlelivn-gallery-sync/`
- Windows: `C:\Users\YourName\Documents\cstlelivn-gallery-sync\`

### Step 3: Run the Sync

Open Terminal/Command Prompt:

```bash
cd ~/Documents/cstlelivn-gallery-sync
node run-sync.js
```

You should see:
```
✅ Found .env.local file
✅ Environment variables loaded
✅ Dependencies ready
🚀 Starting gallery sync...
✅ Album "Kitchen Renovations" synced
✅ Synced 12 images
🎉 Sync completed successfully!
```

Then check: https://cstlelivn.ca/gallery

---

## 📖 Which Guide Should I Read?

**New to this? Never set up before?**
→ Read [`START-HERE-GALLERY-SYNC.md`](./START-HERE-GALLERY-SYNC.md)

**Want the fastest setup possible?**
→ Read [`QUICK-START-GALLERY-SYNC.md`](./QUICK-START-GALLERY-SYNC.md)

**Need troubleshooting or automation?**
→ Read [`RUN-SYNC-FROM-ANY-COMPUTER.md`](./RUN-SYNC-FROM-ANY-COMPUTER.md)

**Want to understand everything?**
→ Read [`GALLERY-CMS-INDEX.md`](./GALLERY-CMS-INDEX.md)

**Technical architecture details?**
→ Read [`GOOGLE-DRIVE-GALLERY-SETUP.md`](./GOOGLE-DRIVE-GALLERY-SETUP.md)

---

## 🔗 Important Links

### Your Resources

- **Supabase Dashboard:** https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx
- **Google Drive Folder:** https://drive.google.com/drive/folders/1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb
- **Live Gallery:** https://cstlelivn.ca/gallery
- **Admin App:** https://admin.cstlelivn.ca

### Service Account

- **Email:** `gallery-cms-sync@gallery-cms-483822.iam.gserviceaccount.com`
- **Project:** `gallery-cms-483822`
- **Permissions:** Viewer (read-only) on Google Drive folder

---

## 🔄 Daily Workflow

From now on, whenever you want to update the gallery:

1. **Upload photos to Google Drive**
   - Go to your folder: https://drive.google.com/drive/folders/1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb
   - Upload to existing subfolders or create new ones

2. **Run the sync**
   ```bash
   node run-sync.js
   ```

3. **Check website**
   - Visit: https://cstlelivn.ca/gallery
   - Photos appear immediately!

**No code changes. No redeployment. Just sync!**

---

## 📁 How It Works

```
Google Drive             Sync Script              Supabase Database          Website
────────────            ────────────             ─────────────────          ───────

📁 Website Photos        
  ├── 📁 Kitchens    →   node run-sync.js   →   gallery_albums      →     Gallery Page
  │   ├── 🖼️ photo1                              gallery_images            (Fast Loading)
  │   └── 🖼️ photo2                              
  ├── 📁 Bathrooms                                Stores:                   Displays:
  └── 📁 Millwork                                 - Album names             - All images
                                                  - Image URLs              - Hover effects
                                                  - Metadata                - Categories
```

### Why This Architecture?

- ✅ **Unlimited storage** - Google Drive holds all originals
- ✅ **Fast website** - Only URLs stored in database
- ✅ **No manual uploads** - Just drag & drop to Drive
- ✅ **Works with Figma hosting** - No server needed on website
- ✅ **Easy updates** - One command syncs everything

---

## 🔒 Security Status

### ✅ Already Configured

- Service account has minimal permissions (Viewer only)
- `.env.local` is in `.gitignore` (won't be committed to Git)
- Supabase service role key only used server-side (sync script)
- Database has RLS policies (public can only read)
- Google Drive folder shared with service account only

### ⚠️ Never Do This

- ❌ Never commit `.env.local` to Git
- ❌ Never share your service account JSON key
- ❌ Never share your Supabase service role key
- ❌ Never give service account more than Viewer access

---

## 🎨 Gallery Features

### What Gets Synced

- ✅ **All subfolders** → Become albums on website
- ✅ **All images** → Displayed in gallery grid
- ✅ **Image order** → Sorted by upload date (newest first)
- ✅ **Max items** → 4 per album by default (configurable)

### What's Ignored

- ❌ Files in root folder (must be in subfolders)
- ❌ Non-image files (PDFs, docs, etc.)
- ❌ Hidden/trashed files

### Supported Formats

- ✅ JPG / JPEG
- ✅ PNG
- ✅ WebP
- ✅ GIF (static and animated)
- ✅ Any other browser-supported image format

---

## 🐛 Quick Troubleshooting

### Sync Won't Run

**Error:** "node: command not found"
**Fix:** Install Node.js from https://nodejs.org/

**Error:** ".env.local file not found"
**Fix:** Make sure you're in the correct folder with `pwd` (Mac) or `cd` (Windows)

**Error:** "GDRIVE_SERVICE_ACCOUNT_KEY not set"
**Fix:** Check that `.env.local` has all 4 variables filled in

### Database Errors

**Error:** "relation \"gallery_albums\" does not exist"
**Fix:** Run the SQL migration in Supabase (Step 1 above)

**Error:** "Permission denied"
**Fix:** Run SQL as superuser or check RLS policies

### Google Drive Errors

**Error:** "Permission denied"
**Fix:** Share folder with `gallery-cms-sync@gallery-cms-483822.iam.gserviceaccount.com`

**Error:** "Invalid credentials"
**Fix:** Check that service account JSON key is correctly formatted in `.env.local`

### Website Errors

**Problem:** Images don't show
**Fix 1:** Clear browser cache (Cmd+Shift+R / Ctrl+Shift+R)
**Fix 2:** Check Supabase Table Editor → `gallery_images` → Verify URLs work

**Problem:** Gallery page is blank
**Fix:** Check browser console (F12) for JavaScript errors

---

## 📊 Verify Everything Works

### Check 1: Database

Go to: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/editor

- Click `gallery_albums` → Should see your Google Drive folders
- Click `gallery_images` → Should see all images with URLs

### Check 2: Image URLs

In Supabase:
1. Click on `gallery_images` table
2. Copy any `url` value
3. Paste in browser
4. Image should load (from Google Drive)

### Check 3: Website

Visit: https://cstlelivn.ca/gallery

- Scroll down to gallery grid
- All images should be visible
- Hover effects should work
- Album names should show on hover

---

## 🤖 Optional: Automate Sync

Want gallery to update automatically every day?

### Mac/Linux (Cron Job)

```bash
crontab -e

# Add this line (daily at 2 AM):
0 2 * * * cd ~/Documents/cstlelivn-gallery-sync && node run-sync.js >> /tmp/gallery-sync.log 2>&1
```

### Windows (Task Scheduler)

1. Open Task Scheduler
2. Create Basic Task
3. Name: "Gallery Sync"
4. Trigger: Daily at 2:00 AM
5. Action: `C:\Program Files\nodejs\node.exe`
6. Arguments: `C:\path\to\cstlelivn-gallery-sync\run-sync.js`

---

## 📈 Database Schema

### `gallery_albums` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Unique identifier |
| `slug` | TEXT | URL-friendly name |
| `name` | TEXT | Display name (from folder name) |
| `drive_folder_id` | TEXT | Google Drive folder ID |
| `max_items` | INT | Max images to show (default: 4) |
| `is_active` | BOOL | Show/hide album |
| `created_at` | TIMESTAMP | When synced |

### `gallery_images` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Unique identifier |
| `album_id` | UUID | Links to gallery_albums |
| `drive_file_id` | TEXT | Google Drive file ID |
| `title` | TEXT | Image title (from filename) |
| `category` | TEXT | Album name |
| `url` | TEXT | Google Drive public URL |
| `position` | INT | Sort order (0 = first) |
| `created_at` | TIMESTAMP | When synced |

---

## 💡 Pro Tips

### Best Practices

1. **Folder naming**
   - Use descriptive names: "Kitchen Renovations 2024"
   - Avoid generic names: "Folder1", "Photos"

2. **Image naming**
   - Use clear filenames: "modern-kitchen-island.jpg"
   - Avoid camera names: "IMG_1234.jpg"

3. **Image optimization**
   - Resize to 1200-2000px wide before upload
   - Use JPG for smaller files (photos)
   - Use PNG for higher quality (graphics)
   - Keep under 2MB per image

4. **Sync frequency**
   - Manual: Run after adding photos
   - Automated: Set up daily cron job

### Changing Max Images

To show more than 4 images per album:

1. Go to Supabase → Table Editor → `gallery_albums`
2. Find the album row
3. Edit `max_items` (e.g., change 4 to 8)
4. Run sync: `node run-sync.js`

---

## 🎉 Success!

You now have a fully functional Google Drive Gallery CMS!

### What You Can Do

- ✅ Upload photos to Google Drive
- ✅ Run sync with one command
- ✅ See updates on website immediately
- ✅ Create new albums by adding subfolders
- ✅ Manage unlimited images
- ✅ No code changes ever needed

### Next Steps

1. **Add test photos** to your Google Drive folder
2. **Run sync** with `node run-sync.js`
3. **Check website** to see them appear!
4. **Schedule automatic sync** (optional, see above)

---

## 📚 Full Documentation Index

| File | Purpose | When to Read |
|------|---------|--------------|
| `START-HERE-GALLERY-SYNC.md` | 3-step quick start | First time setup |
| `QUICK-START-GALLERY-SYNC.md` | 10-minute setup | Need fast results |
| `RUN-SYNC-FROM-ANY-COMPUTER.md` | Complete guide | Troubleshooting |
| `GALLERY-CMS-INDEX.md` | Master documentation index | Find anything |
| `GOOGLE-DRIVE-GALLERY-SETUP.md` | Technical deep-dive | Advanced setup |
| `GALLERY-SYNC-QUICKSTART.md` | Quick reference card | Daily reminders |
| `INSTALLATION-STEPS.md` | Detailed walkthrough | Step-by-step help |
| `SETUP-GALLERY-DATABASE.sql` | Database creation | One-time setup |

---

## 🆘 Need Help?

### Quick Help

1. Check the troubleshooting section above
2. Read the appropriate guide from the table above
3. Check inline code comments in `lib/gdrive.ts`

### Still Stuck?

1. Open `RUN-SYNC-FROM-ANY-COMPUTER.md`
2. Go to the "Troubleshooting" section
3. Find your exact error message
4. Follow the solution steps

---

**Ready to go? Start with: [`START-HERE-GALLERY-SYNC.md`](./START-HERE-GALLERY-SYNC.md)**

---

Made with ⚡ by Figma Make

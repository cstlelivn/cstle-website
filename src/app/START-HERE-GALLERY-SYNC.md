# 🚀 GALLERY SYNC - START HERE!

**Your website is hosted on Figma, so you need to run the gallery sync from your computer.**

This guide gets you from zero to working gallery in under 10 minutes.

---

## ⚡ Quick Setup (3 Steps)

### Step 1: Set Up Database (ONE TIME ONLY)

1. **Go to Supabase:**
   - Open: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx
   - Click "SQL Editor" (left sidebar)
   - Click "New Query"

2. **Copy and paste:**
   - Open the file: `/SETUP-GALLERY-DATABASE.sql`
   - Copy ALL the text
   - Paste into SQL Editor
   - Click "Run" (or press Cmd/Ctrl + Enter)

3. **Verify it worked:**
   - Click "Table Editor" (left sidebar)
   - You should see: `gallery_albums` and `gallery_images` tables
   - ✅ Database ready!

### Step 2: Download Project Files

Since your site is on Figma, download these files to your computer:

**Required files:**
```
✅ .env.local                          # Your credentials (already configured!)
✅ run-sync.js                         # Main script
✅ package.json                        # Dependencies
✅ scripts/syncGalleryFromDrive.ts     # Sync logic
✅ lib/gdrive.ts                       # Google Drive helper
```

**Where to save them:**
- Mac: `~/Documents/cstlelivn-website/`
- Windows: `C:\Users\YourName\Documents\cstlelivn-website\`

### Step 3: Run the Sync

```bash
# Open terminal/command prompt
cd ~/Documents/cstlelivn-website

# Run the sync
node run-sync.js
```

**That's it!** The script will:
- Install dependencies automatically
- Connect to Google Drive
- Sync all your albums and images
- Update your database
- Show you the results

---

## ✅ Verify It Worked

### Check 1: Terminal Output

You should see:
```
✅ Found .env.local file
✅ Environment variables loaded
✅ Dependencies ready
🚀 Starting gallery sync...
✅ Album "Kitchen Renovations" synced
✅ Album "Bathroom Projects" synced
✅ Synced 12 images
🎉 Sync completed successfully!
```

### Check 2: Supabase Database

1. Go to: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/editor
2. Click `gallery_albums` → You should see your Google Drive folders
3. Click `gallery_images` → You should see all your images

### Check 3: Live Website

1. Visit: https://cstlelivn.ca/gallery
2. Scroll down
3. You should see your photos! 🎉

---

## 📁 How to Update Gallery

**Every time you want to update your gallery:**

1. **Add photos to Google Drive**
   - Open: https://drive.google.com/drive/folders/1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb
   - Upload images to the subfolders
   - Or create new subfolders (they become albums)

2. **Run the sync**
   ```bash
   node run-sync.js
   ```

3. **Check your website**
   - Refresh https://cstlelivn.ca/gallery
   - New photos appear instantly!

---

## 🐛 Troubleshooting

### "node: command not found"
→ **Install Node.js:** https://nodejs.org/

### ".env.local file not found"
→ **Make sure you downloaded it** from your Figma project

### "Permission denied" on Google Drive
→ **Share the folder** with: `gallery-cms-sync@gallery-cms-483822.iam.gserviceaccount.com`

### "relation \"gallery_albums\" does not exist"
→ **Run the SQL migration** (Step 1 above)

### Photos don't appear on website
→ **Clear browser cache** and refresh the page

---

## 📚 More Help

- **Detailed setup guide:** `/RUN-SYNC-FROM-ANY-COMPUTER.md`
- **SQL setup:** `/SETUP-GALLERY-DATABASE.sql`
- **Full documentation:** `/GOOGLE-DRIVE-GALLERY-SETUP.md`

---

## 🎯 What You've Accomplished

- ✅ Google Drive folder becomes your gallery CMS
- ✅ Each subfolder = one album on website
- ✅ Images auto-sync to Supabase database
- ✅ Website reads from database (fast & reliable)
- ✅ No code changes needed to add photos!

**You can now:**
- Upload photos to Google Drive
- Run `node run-sync.js`
- See them on your website instantly!

No more manual code updates. Just drag, drop, sync! 🚀

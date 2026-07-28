# ⚡ INSTANT SETUP - Gallery Sync for Figma-Hosted Sites

**Website hosted on Figma? No problem!** This guide gets your Google Drive gallery working in 3 steps.

---

## Why This Guide?

Your website is hosted on Figma (not on your local machine), so the sync script needs to run separately. This is actually **better** because you can:

- ✅ Run sync from any computer (Mac, Windows, Linux)
- ✅ Schedule automatic daily syncs
- ✅ Keep your website files separate from sync scripts
- ✅ No need to redeploy website after adding photos

---

## 🎯 What You'll Achieve

After this guide:
1. Database tables created in Supabase
2. Sync script configured on your computer
3. Gallery auto-updates from Google Drive
4. Website shows all your photos dynamically

**Time required:** 10-15 minutes (first time only)

---

## 📋 Before You Start

Make sure you have:

- [ ] **Node.js installed** - Check with `node --version` ([Download here](https://nodejs.org/))
- [ ] **Project files downloaded** - All files from your Figma project saved to your computer
- [ ] **Google Drive folder** - Already set up: https://drive.google.com/drive/folders/1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb
- [ ] **Service account email** - Already configured: `gallery-cms-sync@gallery-cms-483822.iam.gserviceaccount.com`

✅ All these are already done for you! Just need Node.js.

---

## 🚀 Step 1: Set Up Database (5 minutes)

This creates the tables where gallery data is stored.

### What to Do:

1. **Open Supabase Dashboard**
   ```
   https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx
   ```

2. **Go to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Open SQL file**
   - In your project files, find: `SETUP-GALLERY-DATABASE.sql`
   - Open it with any text editor (Notepad, TextEdit, VS Code)

4. **Copy and paste**
   - Select ALL text in `SETUP-GALLERY-DATABASE.sql`
   - Copy it (Cmd+A, Cmd+C on Mac / Ctrl+A, Ctrl+C on Windows)
   - Paste into Supabase SQL Editor
   - Click "Run" button (or press Cmd/Ctrl + Enter)

5. **Verify success**
   - You should see: "Success. No rows returned"
   - Click "Table Editor" in left sidebar
   - You should see two new tables:
     - `gallery_albums`
     - `gallery_images`

✅ **Done!** Database is ready. You never need to do this again.

---

## 🚀 Step 2: Download Project Files (2 minutes)

Since your website is on Figma, download these files to your computer:

### Required Files:

```
✅ .env.local                          # Your credentials (already filled in!)
✅ run-sync.js                         # Main sync script
✅ package.json                        # List of dependencies
✅ scripts/syncGalleryFromDrive.ts     # Sync logic
✅ lib/gdrive.ts                       # Google Drive helper
✅ lib/gallery.ts                      # Data fetching
```

### Where to Save:

Create a folder on your computer:

**Mac:**
```bash
mkdir ~/Documents/cstlelivn-gallery-sync
cd ~/Documents/cstlelivn-gallery-sync
```

**Windows:**
```cmd
mkdir C:\Users\YourName\Documents\cstlelivn-gallery-sync
cd C:\Users\YourName\Documents\cstlelivn-gallery-sync
```

Then copy all the required files into this folder.

### Verify File Structure:

Your folder should look like:
```
cstlelivn-gallery-sync/
├── .env.local              ← Your credentials
├── run-sync.js             ← Main script
├── package.json            ← Dependencies
├── scripts/
│   └── syncGalleryFromDrive.ts
└── lib/
    ├── gdrive.ts
    └── gallery.ts
```

✅ **Done!** Files are ready.

---

## 🚀 Step 3: Run the Sync (3 minutes)

This connects to Google Drive and syncs all your photos.

### What to Do:

1. **Open Terminal/Command Prompt**
   
   **Mac:**
   - Open "Terminal" app
   - Or press Cmd+Space, type "Terminal", press Enter
   
   **Windows:**
   - Open "Command Prompt" or "PowerShell"
   - Or press Windows+R, type "cmd", press Enter

2. **Navigate to your project folder**
   
   ```bash
   cd ~/Documents/cstlelivn-gallery-sync
   ```
   
   Or on Windows:
   ```cmd
   cd C:\Users\YourName\Documents\cstlelivn-gallery-sync
   ```

3. **Run the sync script**
   
   ```bash
   node run-sync.js
   ```

4. **Watch it work**
   
   You'll see:
   ```
   ✅ Found .env.local file
   ✅ Environment variables loaded
   ✅ Dependencies ready (or: installing dependencies...)
   🚀 Starting gallery sync...
   
   📂 Discovering albums from Google Drive...
      Found 3 subfolders
      - Processing: Kitchen Renovations
      ✅ Album "Kitchen Renovations" synced
      - Processing: Bathroom Projects
      ✅ Album "Bathroom Projects" synced
      
   🖼️ Syncing images for active albums...
      📁 Album: Kitchen Renovations
         Found 8 images in Drive
         Syncing first 4 images
         ✅ Synced 4 images
         
   🎉 Sync completed successfully!
   ```

5. **Check your website**
   
   Visit: https://cstlelivn.ca/gallery
   
   You should see all your photos! 🎉

✅ **Done!** Your gallery is live.

---

## 🔄 Daily Usage

From now on, whenever you want to update your gallery:

1. **Add photos to Google Drive**
   - Go to: https://drive.google.com/drive/folders/1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb
   - Upload images to existing subfolders
   - Or create new subfolders (they become albums)

2. **Run the sync**
   ```bash
   cd ~/Documents/cstlelivn-gallery-sync
   node run-sync.js
   ```

3. **Check website**
   - Refresh: https://cstlelivn.ca/gallery
   - New photos appear immediately!

**That's it!** No need to touch code, redeploy, or do anything else.

---

## 🤖 Optional: Automate the Sync

Want the gallery to sync automatically every day? Set up a scheduled task:

### Mac/Linux: Cron Job

```bash
# Edit crontab
crontab -e

# Add this line (sync daily at 2 AM):
0 2 * * * cd ~/Documents/cstlelivn-gallery-sync && node run-sync.js >> /tmp/gallery-sync.log 2>&1
```

### Windows: Task Scheduler

1. Open Task Scheduler
2. Create Basic Task
3. Name: "Gallery Sync"
4. Trigger: Daily at 2:00 AM
5. Action: Start a program
   - Program: `C:\Program Files\nodejs\node.exe`
   - Arguments: `C:\Users\YourName\Documents\cstlelivn-gallery-sync\run-sync.js`
6. Finish

Now your gallery syncs automatically every day!

---

## 🐛 Troubleshooting

### "node: command not found"

**Problem:** Node.js is not installed.

**Solution:**
1. Download from: https://nodejs.org/
2. Install it (use default settings)
3. Restart Terminal/Command Prompt
4. Try again: `node --version` (should show version number)

---

### ".env.local file not found"

**Problem:** Script can't find your credentials.

**Solution:**
1. Make sure you're in the correct folder:
   ```bash
   pwd  # Mac/Linux (shows current directory)
   cd   # Windows (shows current directory)
   ```
2. Check if `.env.local` exists:
   ```bash
   ls -la .env.local    # Mac/Linux
   dir .env.local       # Windows
   ```
3. If missing, download it from your Figma project files

---

### "Permission denied" on Google Drive

**Problem:** Service account doesn't have access.

**Solution:**
1. Open: https://drive.google.com/drive/folders/1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb
2. Click "Share" button
3. Add email: `gallery-cms-sync@gallery-cms-483822.iam.gserviceaccount.com`
4. Set permission: "Viewer"
5. Click "Send"
6. Try sync again

---

### "relation \"gallery_albums\" does not exist"

**Problem:** Database tables not created yet.

**Solution:**
1. Go back to Step 1
2. Run the SQL migration in Supabase
3. Verify tables exist in Table Editor
4. Try sync again

---

### Images don't show on website

**Possible causes:**

1. **Browser cache** - Press Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
2. **RLS policies** - Check that database setup ran correctly
3. **Image URLs** - Verify URLs work in Supabase Table Editor

**Debug steps:**
1. Go to: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/editor
2. Click `gallery_images` table
3. Click on a row and copy the `url` field
4. Paste URL in browser - does image load?
   - ✅ Yes → Cache issue, clear browser cache
   - ❌ No → Check Google Drive sharing settings

---

## 📚 More Documentation

Need more detailed instructions?

- **Complete guide:** [`/RUN-SYNC-FROM-ANY-COMPUTER.md`](/RUN-SYNC-FROM-ANY-COMPUTER.md)
- **All documentation:** [`/GALLERY-CMS-INDEX.md`](/GALLERY-CMS-INDEX.md)
- **Technical details:** [`/GOOGLE-DRIVE-GALLERY-SETUP.md`](/GOOGLE-DRIVE-GALLERY-SETUP.md)

---

## ✅ Success Checklist

You'll know everything is working when:

- [x] SQL migration completed without errors
- [x] Tables visible in Supabase Table Editor
- [x] Sync script runs successfully
- [x] Terminal shows "Sync completed successfully!"
- [x] Supabase shows data in `gallery_albums` and `gallery_images`
- [x] Website gallery page shows your photos
- [x] Images load when you click on them
- [x] New photos appear after running sync again

---

## 🎓 How It Works (Simple Explanation)

```
1. YOU upload photos    2. YOU run sync       3. Script talks to      4. Script saves to
   to Google Drive         script on your        Google Drive API        Supabase database
                          computer              
   📁 Subfolders                                  📋 Gets list of        🗄️ Stores:
   🖼️ Images                                        folders & images        - Album names
                                                                           - Image URLs
                                                                           
                                                                        5. Website reads
                                                                           from database
                                                                           
                                                                           🌐 Gallery page
                                                                           🖼️ Shows images
```

**Why this architecture?**
- ✅ Images stay in Google Drive (unlimited storage)
- ✅ Database only stores URLs (fast & lightweight)
- ✅ Website loads quickly (just fetches URLs)
- ✅ No manual code changes needed
- ✅ Works perfectly with Figma hosting

---

## 🎯 What You've Accomplished

- ✅ Database tables created and configured
- ✅ Sync script set up on your computer
- ✅ Google Drive connected to your website
- ✅ Gallery auto-updates from Drive
- ✅ No code changes needed to add photos!

**From now on:**
1. Upload photos to Google Drive
2. Run: `node run-sync.js`
3. Photos appear on website instantly!

---

## 💡 Pro Tips

### Organizing Google Drive

1. **Use clear folder names** - They become album titles
   - ✅ "Kitchen Renovations 2024"
   - ❌ "Folder1", "New Photos"

2. **Name images descriptively** - Filenames become titles
   - ✅ "modern-kitchen-island.jpg"
   - ❌ "IMG_1234.jpg"

3. **Optimal image size**
   - Width: 1200-2000px
   - Format: JPG (smaller files) or PNG (higher quality)
   - File size: Under 2MB for fast loading

### Changing Images Per Album

By default, 4 images per album are shown. To change:

1. Go to: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/editor
2. Click `gallery_albums` table
3. Find the album row
4. Edit `max_items` column (e.g., change 4 to 8)
5. Click "Save"
6. Run sync again: `node run-sync.js`

---

## 🆘 Need Help?

1. **Check troubleshooting section above** ↑
2. **Read detailed guide:** `/RUN-SYNC-FROM-ANY-COMPUTER.md`
3. **Check all documentation:** `/GALLERY-CMS-INDEX.md`

---

## 🎉 You're All Set!

Your gallery is now powered by Google Drive. Enjoy the easiest way to manage your portfolio! 🚀

**Next steps:**
- Add some test photos to Google Drive
- Run the sync
- Watch them appear on your website!

---

Made with ⚡ by Figma Make

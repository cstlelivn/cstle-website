# Getting Started with Gallery Sync - Quick Guide

**Goal:** Sync your gallery from Google Drive in 15 minutes.

---

## What You Need

- [ ] Google account (you already have one - your Drive folder is set up)
- [ ] 15 minutes
- [ ] Computer with Node.js installed

---

## The Big Picture

```
Your Google Drive Folder
    ↓
Sync Script (npm run sync:gallery)
    ↓
Supabase Database
    ↓
Website Gallery Page
```

**You upload images → Run sync → Gallery updates**

---

## Step-by-Step Checklist

### ☐ Step 1: Install Dependencies (2 min)

```bash
npm install
```

### ☐ Step 2: Create Database Tables (2 min)

1. Go to: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/sql/new
2. Copy/paste: `/supabase/migrations/create_gallery_tables.sql`
3. Click "Run"

### ☐ Step 3: Create Google Service Account (5 min)

**3a. Create Project**
- https://console.cloud.google.com/
- New Project → Name: "Gallery CMS"

**3b. Enable Drive API**
- APIs & Services → Library
- Search "Google Drive API" → Enable

**3c. Create Service Account**
- IAM & Admin → Service Accounts
- Create → Name: "gallery-cms-sync"
- Generate JSON key → Download it

### ☐ Step 4: Share Drive Folder (1 min)

1. Open: https://drive.google.com/drive/folders/1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb
2. Click "Share"
3. Add your service account email (from step 3c)
4. Role: Viewer
5. Uncheck "Notify"
6. Share

### ☐ Step 5: Set Environment Variables (3 min)

**5a. Minify JSON Key**
- Copy your downloaded JSON key
- Visit: https://www.json-formatter.org/json-minifier
- Paste → Minify → Copy output

**5b. Get Supabase Service Key**
- https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/settings/api
- Copy "service_role" key

**5c. Create .env.local**

Create file `.env.local` in project root:

```bash
GDRIVE_SERVICE_ACCOUNT_KEY='paste_minified_json_here'
GDRIVE_GALLERY_ROOT_FOLDER="1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb"
SUPABASE_URL="https://mlxsfhdzlcxtvqeshgjx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="paste_service_role_key_here"
```

### ☐ Step 6: Run First Sync (2 min)

```bash
npm run sync:gallery
```

**You should see:**
```
✅ Sync Complete!
   Albums processed: X
   Images synced: Y
```

### ☐ Step 7: Check Website (1 min)

Visit: https://cstlelivn.ca/gallery

You should see your images from Google Drive!

---

## Daily Workflow

From now on:

1. **Upload images** to Google Drive subfolders
2. **Run sync:**
   ```bash
   npm run sync:gallery
   ```
3. **Done!** Gallery updates automatically

---

## How Albums Work

Your Google Drive structure:

```
Website Photos/
├── Flooring/        → Album: "Flooring"
│   ├── img1.jpg    → Shows on website
│   ├── img2.jpg    → Shows on website
│   ├── img3.jpg    → Shows on website
│   └── img4.jpg    → Shows on website
├── Installations/   → Album: "Installations"
├── Painting/        → Album: "Painting"
└── Trim and Doors/  → Album: "Trim and Doors"
```

**Each subfolder = 1 album**
**Default: Shows first 4 images per album**

---

## Need More Images Per Album?

After first sync, run this SQL:

```sql
UPDATE gallery_albums
SET max_items = 8
WHERE slug = 'flooring';
```

Then run sync again to update.

---

## Troubleshooting

**❌ "GDRIVE_SERVICE_ACCOUNT_KEY not set"**
- Check `.env.local` exists
- Verify filename (not `.env.local.txt`)
- Restart terminal

**❌ "Permission denied" on Drive**
- Share folder with service account email
- Wait 1-2 minutes for permissions
- Verify "Viewer" role

**❌ "401 Unauthorized" from Supabase**
- Using service_role key (not anon)
- Check for typos
- Verify migration ran successfully

**❌ Gallery shows "No items"**
- Check sync ran successfully
- Verify albums in database:
  ```sql
  SELECT * FROM gallery_albums;
  SELECT * FROM gallery_images;
  ```
- Check browser console for errors

---

## What's Next?

### Optional Enhancements

**Automate Daily Sync:**
- Set up GitHub Actions (see full guide)
- Runs automatically every day at 2 AM
- No manual sync needed

**Customize Album Display:**
- Change max images per album
- Reorder images
- Add custom descriptions

**Monitor Performance:**
- Check Supabase dashboard for data
- Review sync logs
- Optimize image sizes in Drive

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run sync:gallery` | Sync gallery from Drive |
| `npm run dev` | Start local dev server |

| File | Purpose |
|------|---------|
| `.env.local` | Environment variables (create this) |
| `/INSTALLATION-STEPS.md` | Full setup guide |
| `/GOOGLE-DRIVE-GALLERY-SETUP.md` | Detailed documentation |
| `/GALLERY-SYNC-QUICKSTART.md` | Daily usage reference |

---

## Success Checklist

After completing setup:

- [ ] Can run `npm run sync:gallery` without errors
- [ ] Gallery page shows images from Drive
- [ ] Hover effects work (zoom + overlay)
- [ ] Adding new subfolder creates new album
- [ ] Removing images updates gallery after sync

---

## Need Help?

1. **Quick questions:** Check `/GALLERY-SYNC-QUICKSTART.md`
2. **Setup issues:** Read `/INSTALLATION-STEPS.md`
3. **Troubleshooting:** See `/GOOGLE-DRIVE-GALLERY-SETUP.md` Section 8
4. **Technical details:** See `/GALLERY-CMS-IMPLEMENTATION-SUMMARY.md`

---

**🎉 You're ready to go!**

Just follow the 7 steps above and you'll have a Google Drive-powered gallery in 15 minutes.

---

**Questions?**
- All documentation is in the root folder
- Every feature is fully documented
- Examples provided for all common tasks

**Happy syncing! 📸**

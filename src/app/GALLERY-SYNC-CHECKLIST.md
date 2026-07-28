# Gallery Sync: Quick Checklist ✓

Use this checklist for your first-time setup.

## 🎯 First-Time Setup

### 1. Prerequisites
- [ ] Node.js 18+ installed on your Mac
- [ ] Have "Cstle Make Website" folder exported locally
- [ ] Have Google Cloud service account JSON key
- [ ] Have Supabase service_role key

### 2. Create Environment File
```bash
cd ~/path/to/Cstle\ Make\ Website
cp .env.example .env.local
```

### 3. Fill in .env.local
- [ ] `GDRIVE_SERVICE_ACCOUNT_KEY` - Paste minified JSON key
- [ ] `GDRIVE_GALLERY_ROOT_FOLDER` - Leave as default (1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb)
- [ ] `SUPABASE_URL` - Copy from Supabase dashboard
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Copy from Supabase dashboard

### 4. Install Dependencies
```bash
npm install
```

### 5. Run Database Migration
- [ ] Go to: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/sql
- [ ] Copy SQL from: `/supabase/migrations/create_gallery_tables.sql`
- [ ] Paste and run in SQL Editor

### 6. Share Google Drive Folder
- [ ] Go to: https://drive.google.com/drive/folders/1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb
- [ ] Click "Share"
- [ ] Add your service account email (from JSON key: `client_email` field)
- [ ] Grant "Viewer" access

### 7. Run First Sync
```bash
npm run sync:gallery
```

### 8. Verify Success
- [ ] Sync completed without errors
- [ ] Check Supabase tables have data:
  - https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/editor
- [ ] Visit website and check Gallery page:
  - https://loud-rename-20379962.figma.site/Gallery

## 🔄 Regular Sync Workflow

Every time you update Google Drive photos:

```bash
cd ~/path/to/Cstle\ Make\ Website
npm run sync:gallery
```

## 📋 Pre-Flight Checklist

Before each sync, verify:
- [ ] `.env.local` exists and has all 4 variables
- [ ] You're in the project root directory
- [ ] Internet connection is active
- [ ] Google Drive has photos to sync

## ⚠️ Common Issues

| Error | Quick Fix |
|-------|-----------|
| .env.local not found | Check you're in project root |
| Invalid JSON | Minify service account key (no line breaks) |
| Permission denied | Share Drive folder with service account |
| No images syncing | Check images are in subfolders (not root) |

## 🎨 Google Drive Structure

```
📁 Website Photos (root folder)
├── 📁 Project Name 1
│   ├── 🖼️ photo1.jpg
│   └── 🖼️ photo2.jpg
└── 📁 Project Name 2
    └── 🖼️ image.png
```

**Each subfolder = 1 album**  
**First 4 images per album are displayed**

## 🆘 Need Help?

See detailed guides:
- **Full setup**: `/GALLERY-SYNC-SETUP.md`
- **Troubleshooting**: `/INSTALLATION-STEPS.md`
- **Technical docs**: `/GOOGLE-DRIVE-GALLERY-SETUP.md`

---

✅ Setup complete? Start adding photos to Google Drive and run sync!

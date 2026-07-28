# 🎯 Gallery Sync - Visual Quick Reference

```
┌─────────────────────────────────────────────────────────────────┐
│  YOUR GOOGLE DRIVE GALLERY CMS - READY TO USE                   │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│                  │      │                  │      │                  │      │                  │
│  GOOGLE DRIVE    │  →   │  YOUR COMPUTER   │  →   │    SUPABASE      │  →   │    WEBSITE       │
│                  │      │                  │      │                  │      │                  │
│  📁 Photos       │      │  node run-sync   │      │  🗄️ Database     │      │  🌐 Gallery      │
│  🖼️ Images       │      │  .js             │      │  (metadata)      │      │  (displays)      │
│                  │      │                  │      │                  │      │                  │
└──────────────────┘      └──────────────────┘      └──────────────────┘      └──────────────────┘
     Upload                   Run Sync                  Stores URLs              Shows Images
```

---

## ⚡ QUICK START (3 STEPS)

```
┌─ STEP 1: DATABASE (5 min, ONE TIME ONLY) ──────────────────────┐
│                                                                  │
│  1. Open: https://supabase.com/.../mlxsfhdzlcxtvqeshgjx        │
│  2. SQL Editor → New Query                                      │
│  3. Copy SETUP-GALLERY-DATABASE.sql                            │
│  4. Paste & Run                                                 │
│  5. Check: Table Editor shows gallery_albums & gallery_images   │
│                                                                  │
│  ✅ DONE! Never repeat this step.                              │
└──────────────────────────────────────────────────────────────────┘

┌─ STEP 2: DOWNLOAD FILES (2 min) ───────────────────────────────┐
│                                                                  │
│  Download these to your computer:                               │
│                                                                  │
│  ✅ .env.local                 (your credentials)              │
│  ✅ run-sync.js                (main script)                   │
│  ✅ package.json               (dependencies)                  │
│  ✅ scripts/syncGalleryFromDrive.ts                            │
│  ✅ lib/gdrive.ts                                              │
│  ✅ lib/gallery.ts                                             │
│                                                                  │
│  Save to: ~/Documents/cstlelivn-gallery-sync/                  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌─ STEP 3: RUN SYNC (3 min) ─────────────────────────────────────┐
│                                                                  │
│  $ cd ~/Documents/cstlelivn-gallery-sync                        │
│  $ node run-sync.js                                             │
│                                                                  │
│  You'll see:                                                     │
│  ✅ Found .env.local file                                       │
│  ✅ Environment variables loaded                                │
│  ✅ Dependencies ready                                          │
│  🚀 Starting gallery sync...                                    │
│  ✅ Album "Kitchen Renovations" synced                          │
│  ✅ Synced 12 images                                            │
│  🎉 Sync completed successfully!                                │
│                                                                  │
│  Check: https://cstlelivn.ca/gallery                            │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🔄 DAILY USAGE

```
┌─────────────────────────────────────────────────────────────────┐
│  WHEN YOU WANT TO UPDATE GALLERY:                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Upload photos to Google Drive                               │
│     https://drive.google.com/.../1xouZe7VAwbb_MjnyGljX3AVwAT... │
│                                                                  │
│  2. Run sync script                                             │
│     $ node run-sync.js                                          │
│                                                                  │
│  3. Check website                                               │
│     https://cstlelivn.ca/gallery                                │
│                                                                  │
│  ✅ DONE! Photos appear immediately.                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 FOLDER STRUCTURE

```
Your Google Drive:
https://drive.google.com/drive/folders/1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb

📁 Website Photos (root)
  │
  ├── 📁 Kitchen Renovations    ← Becomes album on website
  │   ├── 🖼️ modern-island.jpg   ← Gallery image
  │   ├── 🖼️ white-cabinets.jpg  ← Gallery image
  │   └── 🖼️ marble-counter.jpg  ← Gallery image
  │
  ├── 📁 Bathroom Projects      ← Another album
  │   ├── 🖼️ vanity-install.jpg
  │   └── 🖼️ tile-work.jpg
  │
  └── 📁 Custom Millwork        ← Another album
      ├── 🖼️ built-in-1.jpg
      └── 🖼️ built-in-2.jpg

Rules:
• Each subfolder = One album
• Images must be IN subfolders (not root)
• Up to 4 images per album (configurable)
• Newest images first
```

---

## 🔗 IMPORTANT LINKS

```
┌────────────────────���────────────────────────────────────────────┐
│  SUPABASE DASHBOARD                                              │
│  https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx    │
│  ↳ SQL Editor: Run migrations                                   │
│  ↳ Table Editor: View synced data                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  GOOGLE DRIVE FOLDER                                             │
│  https://drive.google.com/drive/folders/1xouZe7VAwbb_MjnyGljX...│
│  ↳ Upload photos here                                            │
│  ↳ Create subfolders for albums                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  LIVE GALLERY PAGE                                               │
│  https://cstlelivn.ca/gallery                                    │
│  ↳ See your synced photos                                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  ADMIN DASHBOARD                                                 │
│  https://admin.cstlelivn.ca                                      │
│  ↳ Manage other website content                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📚 DOCUMENTATION MAP

```
START HERE:
📄 START-HERE-GALLERY-SYNC.md         ⭐ Best starting point
📄 QUICK-START-GALLERY-SYNC.md        ⚡ 10-minute setup
📄 SETUP-COMPLETE.md                  ✅ What's configured

DETAILED GUIDES:
📄 RUN-SYNC-FROM-ANY-COMPUTER.md      📖 Complete guide + troubleshooting
📄 GALLERY-CMS-INDEX.md               📚 Master index of everything
📄 GOOGLE-DRIVE-GALLERY-SETUP.md      🔧 Technical deep-dive

REFERENCE:
📄 GALLERY-SYNC-QUICKSTART.md         📋 Quick reference card
📄 INSTALLATION-STEPS.md              📝 Step-by-step walkthrough

CODE FILES:
📄 SETUP-GALLERY-DATABASE.sql         🗄️ Database setup
📄 run-sync.js                        ⚙️ Main sync script
📄 .env.local                         🔑 Your credentials
```

---

## 🐛 TROUBLESHOOTING

```
❌ "node: command not found"
   → Install Node.js from https://nodejs.org/

❌ ".env.local file not found"
   → Make sure you're in correct folder: pwd (Mac) / cd (Windows)

❌ "Permission denied" (Google Drive)
   → Share folder with: gallery-cms-sync@gallery-cms-483822...

❌ "relation \"gallery_albums\" does not exist"
   → Run SQL migration in Supabase (SETUP-GALLERY-DATABASE.sql)

❌ Images don't show on website
   → Clear browser cache: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)

For more help, see: RUN-SYNC-FROM-ANY-COMPUTER.md → Troubleshooting
```

---

## ✅ SUCCESS CHECKLIST

```
Database Setup:
[x] SQL migration run successfully
[x] Tables visible in Supabase Table Editor
[x] gallery_albums table exists
[x] gallery_images table exists

Sync Script:
[x] .env.local file exists with credentials
[x] Project files downloaded to computer
[x] Node.js installed (node --version works)
[x] Sync runs without errors

Website:
[x] Gallery page loads: https://cstlelivn.ca/gallery
[x] Images are visible
[x] Hover effects work
[x] Image titles show on hover

Workflow:
[x] Can upload to Google Drive
[x] Can run sync script
[x] New images appear on website
```

---

## 🎯 ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────┐
│  HOW EVERYTHING WORKS TOGETHER                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. YOU upload images to Google Drive                           │
│     ↓                                                            │
│  2. YOU run: node run-sync.js                                   │
│     ↓                                                            │
│  3. Script reads .env.local for credentials                     │
│     ↓                                                            │
│  4. Script connects to Google Drive API                         │
│     ↓                                                            │
│  5. Script discovers all subfolders (albums)                    │
│     ↓                                                            │
│  6. Script discovers all images in each folder                  │
│     ↓                                                            │
│  7. Script writes to Supabase database:                         │
│     • gallery_albums (folder names, IDs)                        │
│     • gallery_images (image URLs, titles)                       │
│     ↓                                                            │
│  8. Website reads from Supabase database                        │
│     ↓                                                            │
│  9. Website displays images from Google Drive URLs              │
│     ↓                                                            │
│  10. VISITORS see your beautiful gallery! 🎉                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 WHAT GETS SYNCED

```
✅ SYNCED:
   • All subfolders → Become albums
   • All images in subfolders → Gallery items
   • Image filenames → Image titles
   • Folder names → Album names
   • Upload dates → Sort order (newest first)
   • First 4 images per album (configurable)

❌ IGNORED:
   • Files in root folder (not in subfolders)
   • Non-image files (PDFs, docs, videos)
   • Hidden files
   • Trashed files

📝 SUPPORTED FORMATS:
   • JPG / JPEG
   • PNG
   • WebP
   • GIF
   • Any browser-supported image format
```

---

## 💡 PRO TIPS

```
📁 FOLDER NAMING:
   ✅ "Kitchen Renovations 2024"
   ✅ "Bathroom Remodels"
   ❌ "Folder1", "New", "Photos"

🖼️ IMAGE NAMING:
   ✅ "modern-kitchen-island.jpg"
   ✅ "marble-bathroom-vanity.jpg"
   ❌ "IMG_1234.jpg", "photo.jpg"

📏 IMAGE SIZE:
   • Width: 1200-2000px
   • Format: JPG (smaller) or PNG (quality)
   • File size: Under 2MB

🔄 SYNC FREQUENCY:
   • Manual: After adding photos
   • Automated: Daily cron job (optional)

⚙️ CHANGE MAX IMAGES:
   • Supabase → gallery_albums → Edit max_items
   • Default: 4 images per album
   • Increase to: 8, 12, or unlimited
```

---

## 🎉 YOU'RE READY!

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│          🚀 YOUR GALLERY CMS IS FULLY CONFIGURED! 🚀            │
│                                                                  │
│  What to do now:                                                │
│  1. Add test photos to Google Drive                             │
│  2. Run: node run-sync.js                                       │
│  3. Visit: https://cstlelivn.ca/gallery                         │
│  4. Watch your photos appear! ✨                                │
│                                                                  │
│  Questions? Read: START-HERE-GALLERY-SYNC.md                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

Made with ⚡ by Figma Make

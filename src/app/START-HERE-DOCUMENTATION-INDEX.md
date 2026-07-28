# 📚 Gallery Sync Documentation Index

**Welcome to the Cstle Livn Gallery CMS!** This index will help you find the right documentation for your needs.

## 🎯 Start Here

### If you're setting up for the first time:
1. **Read**: `/IMPLEMENTATION-COMPLETE.md` (5 min read - overview of what exists)
2. **Follow**: `/HOW-TO-RUN-GALLERY-SYNC.md` (Quick start guide)
3. **Use**: `/GALLERY-SYNC-CHECKLIST.md` (Step-by-step checklist)

### If you just want to run a sync:
1. **Quick Reference**: `/QUICK-REFERENCE.md` (One-page cheat sheet)
2. **Command**: `npm run sync:gallery`

### If you want to understand how it works:
1. **Architecture**: `/GALLERY-CMS-ARCHITECTURE.md` (Visual diagrams)
2. **Code**: Read inline comments in `/lib/gdrive.ts` and `/lib/gallery.ts`

## 📖 Documentation Files

### Quick Start (< 10 minutes)

| File | Purpose | When to Use |
|------|---------|-------------|
| **[QUICK-REFERENCE.md](/QUICK-REFERENCE.md)** | One-page cheat sheet | Daily use, quick lookup |
| **[HOW-TO-RUN-GALLERY-SYNC.md](/HOW-TO-RUN-GALLERY-SYNC.md)** | Simple 3-command setup | First-time setup, getting started |
| **[GALLERY-SYNC-CHECKLIST.md](/GALLERY-SYNC-CHECKLIST.md)** | Interactive checklist | Ensuring you didn't miss steps |

### Comprehensive Guides (10-30 minutes)

| File | Purpose | When to Use |
|------|---------|-------------|
| **[IMPLEMENTATION-COMPLETE.md](/IMPLEMENTATION-COMPLETE.md)** | Complete overview & summary | Understanding what was built |
| **[GALLERY-SYNC-SETUP.md](/GALLERY-SYNC-SETUP.md)** | Detailed setup walkthrough | Troubleshooting, deep dive |
| **[GALLERY-CMS-ARCHITECTURE.md](/GALLERY-CMS-ARCHITECTURE.md)** | System architecture diagrams | Understanding data flow |

### Technical Reference

| File | Purpose | When to Use |
|------|---------|-------------|
| **[.env.example](/.env.example)** | Environment variables template | Creating .env.local |
| **[package.json](/package.json)** | npm scripts and dependencies | Understanding project setup |
| **[tsconfig.json](/tsconfig.json)** | TypeScript configuration | TypeScript compilation issues |
| **[run-sync.js](/run-sync.js)** | Sync runner script | Understanding sync workflow |

### Code Documentation (Inline)

| File | Contains | Purpose |
|------|----------|---------|
| **[scripts/syncGalleryFromDrive.ts](/scripts/syncGalleryFromDrive.ts)** | Main sync logic | Album & image synchronization |
| **[lib/gdrive.ts](/lib/gdrive.ts)** | Google Drive API | Drive authentication & queries |
| **[lib/gallery.ts](/lib/gallery.ts)** | Gallery data fetching | Frontend data layer |
| **[pages/Gallery.tsx](/pages/Gallery.tsx)** | Gallery UI component | Website display logic |

### Database

| File | Purpose | When to Use |
|------|---------|-------------|
| **[supabase/migrations/create_gallery_tables.sql](/supabase/migrations/create_gallery_tables.sql)** | Database schema | Creating tables (one-time) |

### Legacy Documentation (Context)

These files document the journey and may help with troubleshooting:

| File | Purpose |
|------|---------|
| `/GOOGLE-DRIVE-GALLERY-SETUP.md` | Original setup guide |
| `/GALLERY-SYNC-QUICKSTART.md` | Early quick start |
| `/GALLERY-CMS-IMPLEMENTATION-SUMMARY.md` | Implementation summary |
| `/INSTALLATION-STEPS.md` | Detailed installation |
| `/GETTING-STARTED-WITH-GALLERY-SYNC.md` | Alternative getting started |
| `/START-HERE-GALLERY-SYNC.md` | Alternative start here |
| `/README-GALLERY-SYNC.md` | Alternative README |
| `/RUN-SYNC-FROM-ANY-COMPUTER.md` | Portability guide |

## 🎓 Learning Path

### Path 1: "Just Make It Work" (10 minutes)
```
1. Read: QUICK-REFERENCE.md
2. Follow: HOW-TO-RUN-GALLERY-SYNC.md
3. Run: npm run sync:gallery
```

### Path 2: "I Want to Understand" (30 minutes)
```
1. Read: IMPLEMENTATION-COMPLETE.md
2. Study: GALLERY-CMS-ARCHITECTURE.md
3. Follow: GALLERY-SYNC-SETUP.md
4. Run: npm run sync:gallery
```

### Path 3: "I'm a Developer" (1 hour)
```
1. Read: IMPLEMENTATION-COMPLETE.md
2. Study: GALLERY-CMS-ARCHITECTURE.md
3. Review code:
   - scripts/syncGalleryFromDrive.ts
   - lib/gdrive.ts
   - lib/gallery.ts
   - pages/Gallery.tsx
4. Review database: create_gallery_tables.sql
5. Experiment: npm run sync:gallery
```

## 🔍 Find by Topic

### Setup & Installation
- **Quick Setup**: `HOW-TO-RUN-GALLERY-SYNC.md`
- **Detailed Setup**: `GALLERY-SYNC-SETUP.md`
- **Checklist**: `GALLERY-SYNC-CHECKLIST.md`
- **Environment Vars**: `.env.example`

### Running Sync
- **Quick Command**: `QUICK-REFERENCE.md`
- **Regular Workflow**: `HOW-TO-RUN-GALLERY-SYNC.md` → "Regular Usage"
- **Automation**: `GALLERY-SYNC-SETUP.md` → "Automation"

### Troubleshooting
- **Common Errors**: `QUICK-REFERENCE.md` → "Common Errors"
- **Detailed Fixes**: `GALLERY-SYNC-SETUP.md` → "Troubleshooting"
- **Database Issues**: `create_gallery_tables.sql` → Comments

### Understanding System
- **Architecture**: `GALLERY-CMS-ARCHITECTURE.md`
- **Data Flow**: `GALLERY-CMS-ARCHITECTURE.md` → "Data Flow"
- **Security**: `GALLERY-CMS-ARCHITECTURE.md` → "Security Layers"
- **File Organization**: `IMPLEMENTATION-COMPLETE.md` → "Files Modified/Created"

### Customization
- **Change Image Count**: `IMPLEMENTATION-COMPLETE.md` → "Customization"
- **Hide Albums**: `IMPLEMENTATION-COMPLETE.md` → "Customization"
- **Manual Management**: `IMPLEMENTATION-COMPLETE.md` → "Customization"

### API Reference
- **Google Drive API**: `lib/gdrive.ts` (inline comments)
- **Gallery Data API**: `lib/gallery.ts` (inline comments)
- **Sync Script API**: `scripts/syncGalleryFromDrive.ts` (inline comments)

## 🚀 Quick Commands

```bash
# First time setup
cp .env.example .env.local
npm install
npm run sync:gallery

# Regular sync
npm run sync:gallery

# Check version
node --version
```

## 🔗 Important URLs

- **Website Gallery**: https://loud-rename-20379962.figma.site/Gallery
- **Supabase Dashboard**: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx
- **Supabase SQL Editor**: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/sql
- **Supabase Tables**: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/editor
- **Google Drive Folder**: https://drive.google.com/drive/folders/1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb
- **Google Cloud Console**: https://console.cloud.google.com/iam-admin/serviceaccounts

## ❓ Which File Should I Read?

### "I want to sync photos right now"
→ **QUICK-REFERENCE.md**

### "This is my first time, walk me through it"
→ **HOW-TO-RUN-GALLERY-SYNC.md**

### "I'm getting an error"
→ **GALLERY-SYNC-SETUP.md** (Troubleshooting section)

### "How does this all work?"
→ **GALLERY-CMS-ARCHITECTURE.md**

### "What files were created?"
→ **IMPLEMENTATION-COMPLETE.md**

### "I want a checklist to follow"
→ **GALLERY-SYNC-CHECKLIST.md**

### "I need to understand the code"
→ Read inline comments in `/scripts/`, `/lib/`, `/pages/` files

### "I need to set up the database"
→ **supabase/migrations/create_gallery_tables.sql**

### "What are the environment variables?"
→ **.env.example**

## 🎯 Success Criteria

You'll know you're successful when:

- ✅ You can run `npm run sync:gallery` without errors
- ✅ Your photos appear on the website
- ✅ Adding photos to Drive and re-syncing updates the website
- ✅ You understand the workflow well enough to train others

## 🆘 Getting Help

If you're stuck:

1. **Check the error message** - Most errors have clear messages
2. **Review troubleshooting** - See `GALLERY-SYNC-SETUP.md` → "Troubleshooting"
3. **Verify prerequisites** - Use `GALLERY-SYNC-CHECKLIST.md`
4. **Check configuration** - Review `.env.local` against `.env.example`
5. **Review architecture** - See `GALLERY-CMS-ARCHITECTURE.md` for system understanding

## 📝 Recommended Reading Order

### For Quick Setup:
```
1. QUICK-REFERENCE.md (1 min)
2. HOW-TO-RUN-GALLERY-SYNC.md (5 min)
3. .env.example (2 min)
4. GALLERY-SYNC-CHECKLIST.md (use as guide)
```

### For Complete Understanding:
```
1. IMPLEMENTATION-COMPLETE.md (10 min)
2. GALLERY-CMS-ARCHITECTURE.md (10 min)
3. GALLERY-SYNC-SETUP.md (15 min)
4. Code files with inline comments (20 min)
```

## ✨ Next Steps

1. **✅ Read**: Start with `IMPLEMENTATION-COMPLETE.md` for overview
2. **✅ Setup**: Follow `HOW-TO-RUN-GALLERY-SYNC.md`
3. **✅ Run**: Execute `npm run sync:gallery`
4. **✅ Verify**: Check website gallery page
5. **✅ Test**: Add a photo and re-sync

---

**Ready to get started?** → Go to `/HOW-TO-RUN-GALLERY-SYNC.md`

**Need quick help?** → Go to `/QUICK-REFERENCE.md`

**Want to understand everything?** → Go to `/IMPLEMENTATION-COMPLETE.md`

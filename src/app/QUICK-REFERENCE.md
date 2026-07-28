# 🚀 Gallery Sync - Quick Reference Card

## One-Liner
```bash
npm run sync:gallery
```

## First Time Setup (5 minutes)

```bash
# 1. Create environment file
cp .env.example .env.local

# 2. Edit .env.local with your 4 credentials
# (Google service account key, Drive folder ID, Supabase URL, Supabase service role key)

# 3. Install dependencies
npm install

# 4. Run database migration in Supabase SQL Editor
# (Copy SQL from /supabase/migrations/create_gallery_tables.sql)

# 5. Share Google Drive folder with service account email
# (Found in service account JSON as "client_email")

# 6. Run first sync
npm run sync:gallery
```

## Regular Workflow

```bash
# When you add/remove photos in Google Drive:
cd ~/path/to/Cstle\ Make\ Website
npm run sync:gallery
```

## Google Drive Structure

```
📁 Website Photos (Root)
├── 📁 Album Name 1
│   ├── 🖼️ photo1.jpg
│   └── 🖼️ photo2.jpg
└── 📁 Album Name 2
    └── 🖼️ image.png
```

**Each subfolder = 1 gallery album**

## Environment Variables

```bash
# .env.local (4 required variables)
GDRIVE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
GDRIVE_GALLERY_ROOT_FOLDER=1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb
SUPABASE_URL=https://mlxsfhdzlcxtvqeshgjx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
```

## Key Files

| File | Purpose |
|------|---------|
| `.env.local` | Your credentials (create this) |
| `.env.example` | Template |
| `run-sync.js` | Sync wrapper script |
| `scripts/syncGalleryFromDrive.ts` | Main sync logic |
| `package.json` | npm scripts |

## Database Tables

- **gallery_albums** - Albums from Drive folders
- **gallery_images** - Images from Drive files

## Commands

```bash
# Run sync
npm run sync:gallery

# Install dependencies
npm install

# Check Node version (need 18+)
node --version
```

## Verification

After sync:
1. ✅ CLI shows "Sync Complete!"
2. ✅ Supabase tables have data
3. ✅ Website shows photos: https://loud-rename-20379962.figma.site/Gallery

## Common Errors

| Error | Fix |
|-------|-----|
| `.env.local not found` | Run `cp .env.example .env.local` |
| `Invalid JSON` | Minify service account key (single line) |
| `Permission denied` | Share Drive folder with service account |
| `Tables don't exist` | Run database migration SQL |

## URLs

- **Website**: https://loud-rename-20379962.figma.site/Gallery
- **Supabase Dashboard**: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx
- **Google Drive**: https://drive.google.com/drive/folders/1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb

## Documentation

- **Quick Start**: `/HOW-TO-RUN-GALLERY-SYNC.md`
- **Full Guide**: `/GALLERY-SYNC-SETUP.md`
- **Checklist**: `/GALLERY-SYNC-CHECKLIST.md`
- **Architecture**: `/GALLERY-CMS-ARCHITECTURE.md`

## Security

- ✅ Never commit `.env.local`
- ✅ Keep service role key secret
- ✅ Share Drive folder only with service account
- ✅ Rotate keys every 6-12 months

## Automation (Optional)

Run daily with cron:
```bash
0 2 * * * cd ~/path/to/project && npm run sync:gallery >> ~/sync.log 2>&1
```

---

**Need help?** See full documentation in the files listed above.

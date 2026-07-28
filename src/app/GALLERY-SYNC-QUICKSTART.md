# Gallery Sync - Quick Start

Quick reference for syncing your Google Drive gallery to the website.

---

## Prerequisites Checklist

- [ ] Database migration run (`/supabase/migrations/create_gallery_tables.sql`)
- [ ] Google service account created
- [ ] Service account has access to Drive folder
- [ ] Environment variables configured
- [ ] Dependencies installed (`npm install`)

---

## Environment Variables

Create `.env.local` in project root:

```bash
GDRIVE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
GDRIVE_GALLERY_ROOT_FOLDER="1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb"
SUPABASE_URL="https://mlxsfhdzlcxtvqeshgjx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

---

## Sync Command

```bash
npm run sync:gallery
```

---

## What It Does

1. Scans `Website Photos` folder on Google Drive
2. Creates album for each subfolder
3. Syncs first 4 images per album (configurable)
4. Updates Supabase database
5. Gallery page auto-updates

---

## Google Drive Folder

**Parent Folder:** Website Photos  
**ID:** `1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb`  
**URL:** https://drive.google.com/drive/folders/1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb

**Structure:**
```
Website Photos/
├── Flooring/
│   ├── image1.jpg
│   ├── image2.jpg
│   └── ...
├── Installations/
│   ├── photo1.jpg
│   └── ...
├── Painting/
└── Trim and Doors/
```

Each subfolder = 1 album on website

---

## Common Tasks

### Add New Album
1. Create subfolder in Google Drive
2. Add images
3. Run `npm run sync:gallery`

### Update Images
1. Upload/delete images in Drive
2. Run `npm run sync:gallery`

### Change Album Limit
```sql
UPDATE gallery_albums
SET max_items = 8
WHERE slug = 'flooring';
```

---

## Troubleshooting

**No images showing?**
- Check service account has folder access
- Verify env vars are set
- Run sync with verbose output

**401 Unauthorized?**
- Using service role key (not anon key)
- RLS policies created correctly

**Permission denied?**
- Share folder with service account email
- Grant "Viewer" access

---

## Files Reference

- **Sync Script:** `/scripts/syncGalleryFromDrive.ts`
- **Database Schema:** `/supabase/migrations/create_gallery_tables.sql`
- **Drive Helper:** `/lib/gdrive.ts`
- **Gallery Helper:** `/lib/gallery.ts`
- **Gallery Page:** `/pages/Gallery.tsx`
- **Full Guide:** `/GOOGLE-DRIVE-GALLERY-SETUP.md`

---

## Support Links

- **Supabase Dashboard:** https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx
- **Google Drive Folder:** https://drive.google.com/drive/folders/1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb
- **Google Cloud Console:** https://console.cloud.google.com/

---

**Need detailed setup instructions?** See `/GOOGLE-DRIVE-GALLERY-SETUP.md`

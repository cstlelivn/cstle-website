# Gallery Sync: Complete Setup Guide

This guide will walk you through setting up and running the Google Drive to Supabase gallery sync for your local machine.

## 📋 Prerequisites

Before you begin, ensure you have:

- ✅ Node.js 18+ installed on your Mac
- ✅ npm installed (comes with Node.js)
- ✅ Access to the Cstle Livn Google Cloud Project
- ✅ Access to the Cstle Livn Supabase project
- ✅ The exported "Cstle Make Website" folder on your Mac

## 🚀 Quick Start (5 Minutes)

### Step 1: Navigate to Your Project

```bash
cd ~/path/to/Cstle\ Make\ Website
```

### Step 2: Create Environment File

```bash
cp .env.example .env.local
```

### Step 3: Fill in Your Credentials

Open `.env.local` in your text editor and fill in all four values:

```bash
# Example of what it should look like (use your actual values!)
GDRIVE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}
GDRIVE_GALLERY_ROOT_FOLDER=1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb
SUPABASE_URL=https://mlxsfhdzlcxtvqeshgjx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Where to get these values:**

1. **GDRIVE_SERVICE_ACCOUNT_KEY**: From Google Cloud Console
   - Go to: https://console.cloud.google.com/iam-admin/serviceaccounts
   - Select your service account → Keys → Create new JSON key
   - Copy the entire JSON content and minify it (remove all line breaks)

2. **GDRIVE_GALLERY_ROOT_FOLDER**: Already set to default value
   - This is the "Website Photos" folder ID: `1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb`
   - No need to change unless you want to use a different folder

3. **SUPABASE_URL**: From Supabase Dashboard
   - Go to: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/settings/api
   - Copy the "Project URL"

4. **SUPABASE_SERVICE_ROLE_KEY**: From Supabase Dashboard
   - Same page as above
   - Copy the "service_role" key (⚠️ Keep this secret!)

### Step 4: Install Dependencies

```bash
npm install
```

This installs:
- `@supabase/supabase-js` - Supabase client
- `googleapis` - Google Drive API client
- `tsx` - TypeScript executor
- Development dependencies

### Step 5: Run Database Migration (One-Time Only)

Before your first sync, you need to create the database tables:

1. Go to Supabase SQL Editor:
   - https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/sql

2. Open the migration file:
   - Located at: `/supabase/migrations/create_gallery_tables.sql`

3. Copy the entire SQL content and paste it into the Supabase SQL Editor

4. Click "Run" to execute the migration

This creates:
- `gallery_albums` table
- `gallery_images` table
- Indexes for performance
- RLS policies for security

### Step 6: Run Your First Sync

```bash
npm run sync:gallery
```

You should see output like:

```
═══════════════════════════════════════════════════════════
  Gallery Sync Runner
═══════════════════════════════════════════════════════════

Step 1: Checking environment...
✅ Found .env.local file
✅ Environment variables loaded

Step 2: Checking dependencies...
✅ Dependencies ready

Step 3: Running sync...

═══════════════════════════════════════════════════════════
  Gallery Sync: Google Drive → Supabase
═══════════════════════════════════════════════════════════

📂 Discovering albums from Google Drive...
   Found 3 subfolders
   - Processing: Kitchen Remodel (slug: kitchen-remodel)
   ✅ Album "Kitchen Remodel" synced
   - Processing: Bathroom Finishes (slug: bathroom-finishes)
   ✅ Album "Bathroom Finishes" synced
   - Processing: Living Room (slug: living-room)
   ✅ Album "Living Room" synced

🖼️  Syncing images for active albums...
   📁 Album: Kitchen Remodel
      Found 8 images in Drive
      Syncing first 4 images (max_items: 4)
      ✅ Synced 4 images
   📁 Album: Bathroom Finishes
      Found 6 images in Drive
      Syncing first 4 images (max_items: 4)
      ✅ Synced 4 images
   📁 Album: Living Room
      Found 10 images in Drive
      Syncing first 4 images (max_items: 4)
      ✅ Synced 4 images

═══════════════════════════════════════════════════════════
  ✅ Sync Complete!
     Albums processed: 3
     Images synced: 12
═══════════════════════════════════════════════════════════

🎉 Sync completed successfully!

═══════════════════════════════════════════════════════════
  ✅ All Done!
═══════════════════════════════════════════════════════════
Your gallery has been synced from Google Drive to Supabase.
The website will now display the latest images.
```

## 🎨 How It Works

### Google Drive Structure

Your Google Drive folder should be organized like this:

```
📁 Website Photos (ID: 1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb)
├── 📁 Kitchen Remodel
│   ├── 🖼️ photo1.jpg
│   ├── 🖼️ photo2.jpg
│   └── 🖼️ photo3.jpg
├── 📁 Bathroom Finishes
│   ├── 🖼️ image1.png
│   └── 🖼️ image2.png
└── 📁 Living Room
    ├── 🖼️ living1.jpg
    └── 🖼️ living2.jpg
```

**Rules:**
- Each **subfolder** becomes a **gallery album**
- Only **image files** (jpg, jpeg, png, webp) are synced
- First **4 images** per album are displayed (configurable)
- Images sorted by creation date (newest first)

### Sync Process

1. **Discover Albums**: Lists all subfolders in the root folder
2. **Create/Update Albums**: Upserts albums to `gallery_albums` table
3. **Sync Images**: For each album, syncs the first N images to `gallery_images` table
4. **Generate URLs**: Creates public Google Drive URLs for each image
5. **Mark Inactive**: Deactivates albums whose folders were deleted

### Database Schema

**gallery_albums:**
- `id` - UUID primary key
- `slug` - URL-friendly identifier (e.g., "kitchen-remodel")
- `name` - Display name (e.g., "Kitchen Remodel")
- `drive_folder_id` - Google Drive folder ID
- `max_items` - Number of images to display (default: 4)
- `is_active` - Whether to show this album (default: true)

**gallery_images:**
- `id` - UUID primary key
- `album_id` - References gallery_albums
- `drive_file_id` - Google Drive file ID
- `title` - Image title (filename without extension)
- `category` - Album name (for display)
- `url` - Public Google Drive URL
- `position` - Sort order (0-based)

## 🔄 Regular Sync Workflow

### When to Run Sync

Run the sync whenever you:
- ✅ Add new photos to Google Drive
- ✅ Create new album folders
- ✅ Delete or reorganize photos
- ✅ Want to update the website gallery

### Running Sync Regularly

**Option 1: Manual Sync (Recommended for now)**

```bash
# Navigate to project folder
cd ~/path/to/Cstle\ Make\ Website

# Run sync
npm run sync:gallery
```

**Option 2: Automated Sync (Future Enhancement)**

You can automate this with:
- **macOS cron job**: Run daily/weekly on your Mac
- **GitHub Actions**: Schedule on GitHub (requires pushing code)
- **Cloud scheduler**: Use AWS Lambda, Google Cloud Functions, etc.

Example cron job (runs daily at 2 AM):

```bash
# Edit crontab
crontab -e

# Add this line:
0 2 * * * cd ~/path/to/Cstle\ Make\ Website && npm run sync:gallery >> ~/gallery-sync.log 2>&1
```

## 🛠️ Troubleshooting

### Error: ".env.local file not found"

**Solution:**
- Check that `.env.local` exists in project root
- Verify filename is exactly `.env.local` (not `.env.local.txt`)
- Run from the correct directory (project root)

### Error: "GDRIVE_SERVICE_ACCOUNT_KEY environment variable is not set"

**Solution:**
- Open `.env.local` and verify the key is filled in
- Ensure the JSON is minified (no line breaks)
- Restart your terminal after editing `.env.local`

### Error: "Invalid JSON in GDRIVE_SERVICE_ACCOUNT_KEY"

**Solution:**
- The service account key must be valid JSON on a single line
- Remove all line breaks and extra whitespace
- You can use an online JSON minifier or this command:

```bash
cat service-account.json | tr -d '\n' | pbcopy
```

Then paste into `.env.local`

### Error: "Permission denied" on Google Drive

**Solution:**
- Verify the service account email has access to the folder
- Share the "Website Photos" folder with your service account email
- Grant at least "Viewer" permissions

To find your service account email:
```bash
# Extract from the JSON key
cat .env.local | grep -o '"client_email":"[^"]*"'
```

### Error: "Failed to connect to Supabase"

**Solution:**
- Check `SUPABASE_URL` is correct in `.env.local`
- Check `SUPABASE_SERVICE_ROLE_KEY` is correct
- Verify you have internet connection
- Test connection:

```bash
curl https://mlxsfhdzlcxtvqeshgjx.supabase.co/rest/v1/
```

### No Images Showing on Website

**Check:**
1. ✅ Sync completed successfully (no errors)
2. ✅ Images exist in Supabase:
   - Go to: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/editor
   - Check `gallery_albums` and `gallery_images` tables
3. ✅ Albums are marked `is_active = true`
4. ✅ Google Drive files are shared (not private)

## 🔒 Security Best Practices

### DO:
- ✅ Keep `.env.local` secure and never commit to Git
- ✅ Use service role key only on your local machine
- ✅ Rotate keys regularly (every 6-12 months)
- ✅ Share Google Drive folder with service account (not public)
- ✅ Keep service account JSON key file secure

### DON'T:
- ❌ Commit `.env.local` to version control (already in .gitignore)
- ❌ Share your service role key publicly
- ❌ Use service role key in client-side code
- ❌ Make Google Drive folder publicly accessible
- ❌ Hardcode credentials in any files

## 📁 Project File Structure

```
Cstle Make Website/
├── .env.local                        # Your secrets (create this)
├── .env.example                      # Template for .env.local
├── package.json                      # npm configuration
├── run-sync.js                       # Sync runner script
├── scripts/
│   └── syncGalleryFromDrive.ts      # Main sync logic
├── lib/
│   ├── gdrive.ts                    # Google Drive API helper
│   └── gallery.ts                   # Gallery data fetcher
├── pages/
│   └── Gallery.tsx                  # Gallery page component
├── supabase/
│   └── migrations/
│       └── create_gallery_tables.sql # Database schema
└── node_modules/                    # Dependencies (auto-generated)
```

## 🆘 Getting Help

If you encounter issues:

1. **Check the logs**: The sync script provides detailed output
2. **Review documentation**: See `/GOOGLE-DRIVE-GALLERY-SETUP.md` for detailed info
3. **Test components individually**:
   - Test Google Drive access
   - Test Supabase connection
   - Check database tables

## 🎯 Next Steps

After successful sync:

1. **Visit your website**: https://loud-rename-20379962.figma.site/Gallery
2. **Verify images are loading**: Should see your Google Drive photos
3. **Add more photos**: Upload to Drive folders and re-run sync
4. **Customize display**: Edit `max_items` in `gallery_albums` table

## 📚 Additional Resources

- **Full Setup Guide**: `/GOOGLE-DRIVE-GALLERY-SETUP.md`
- **Quick Reference**: `/GALLERY-SYNC-QUICKSTART.md`
- **API Documentation**: See inline comments in `/lib/gdrive.ts`
- **Database Schema**: `/supabase/migrations/create_gallery_tables.sql`
- **Troubleshooting**: `/INSTALLATION-STEPS.md`

---

**Last Updated**: January 2026  
**Questions?** Check the documentation files or review the inline code comments.

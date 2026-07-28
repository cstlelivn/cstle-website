# Gallery CMS - Installation Steps

Follow these steps **in order** to set up the Google Drive Gallery CMS.

---

## ⏱️ Estimated Time: 15-20 minutes

---

## Step 1: Install Dependencies (2 minutes)

```bash
npm install
```

This installs:
- `googleapis` - Google Drive API client
- `@supabase/supabase-js` - Already installed, ensures latest version
- `tsx` - TypeScript execution for sync script
- `@types/node` - TypeScript definitions

---

## Step 2: Create Database Tables (2 minutes)

1. Open Supabase SQL Editor:
   https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/sql/new

2. Copy the entire contents of:
   `/supabase/migrations/create_gallery_tables.sql`

3. Paste into SQL editor and click **Run**

4. ✅ Verify success:
   - Should see "Success. No rows returned"
   - Check Tables tab - should see `gallery_albums` and `gallery_images`

---

## Step 3: Create Google Service Account (5 minutes)

### 3.1 Create Google Cloud Project

1. Go to: https://console.cloud.google.com/
2. Click **Select a project** dropdown → **New Project**
3. Name: `Cstle Livn Gallery CMS`
4. Click **Create**
5. Wait for project to be created (~30 seconds)

### 3.2 Enable Google Drive API

1. In your new project, click **Navigation Menu** (☰)
2. Go to **APIs & Services** → **Library**
3. Search: `Google Drive API`
4. Click on **Google Drive API**
5. Click **Enable**
6. Wait for activation (~10 seconds)

### 3.3 Create Service Account

1. Click **Navigation Menu** (☰)
2. Go to **IAM & Admin** → **Service Accounts**
3. Click **+ Create Service Account**
4. Fill in:
   - **Name:** `gallery-cms-sync`
   - **Description:** `Service account for syncing gallery images from Google Drive`
5. Click **Create and Continue**
6. Skip roles (click **Continue**)
7. Skip grant users access (click **Done**)

### 3.4 Generate JSON Key

1. Click on the service account email (e.g., `gallery-cms-sync@your-project.iam.gserviceaccount.com`)
2. Go to **Keys** tab
3. Click **Add Key** → **Create new key**
4. Choose **JSON**
5. Click **Create**
6. **IMPORTANT:** A JSON file downloads - save it somewhere safe!

---

## Step 4: Share Google Drive Folder (2 minutes)

1. Open your Google Drive folder:
   https://drive.google.com/drive/folders/1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb

2. Click **Share** button (top right)

3. In the "Add people and groups" field, paste your service account email:
   `gallery-cms-sync@your-project.iam.gserviceaccount.com`

4. Set role to **Viewer**

5. **Uncheck** "Notify people" (service accounts don't read emails)

6. Click **Share**

7. ✅ Confirm you see the service account in "People with access"

---

## Step 5: Configure Environment Variables (3 minutes)

### 5.1 Minify Service Account JSON

1. Open the downloaded JSON key file in a text editor
2. Copy the entire contents
3. Go to: https://www.json-formatter.org/json-minifier
4. Paste JSON and click **Minify**
5. Copy the minified output (single line)

### 5.2 Get Supabase Service Role Key

1. Go to: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/settings/api
2. Under "Project API keys" section
3. Copy the **service_role** key (NOT the anon key)
4. ⚠️ **WARNING:** This is a sensitive key - never expose publicly

### 5.3 Create .env.local File

1. In your project root, create a new file named `.env.local`

2. Paste this template and fill in your values:

```bash
# Google Drive API
GDRIVE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...paste_minified_json_here...}'
GDRIVE_GALLERY_ROOT_FOLDER="1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb"

# Supabase
SUPABASE_URL="https://mlxsfhdzlcxtvqeshgjx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="paste_your_service_role_key_here"
```

3. **IMPORTANT:** 
   - Entire service account JSON must be on ONE line
   - Wrap in single quotes
   - Double-check no typos in keys

4. Save the file

---

## Step 6: Run First Sync (2 minutes)

Now test the entire pipeline!

```bash
npm run sync:gallery
```

### Expected Output:

```
═══════════════════════════════════════════════════
  Gallery Sync: Google Drive → Supabase
═══════════════════════════════════════════════════

📂 Discovering albums from Google Drive...
   Found X subfolders
   - Processing: Flooring (slug: flooring)
   ✅ Album "Flooring" synced
   - Processing: Installations (slug: installations)
   ✅ Album "Installations" synced
   ...

🖼️  Syncing images for active albums...
   📁 Album: Flooring
      Found Y images in Drive
      Syncing first 4 images (max_items: 4)
      ✅ Synced 4 images
   ...

═══════════════════════════════════════════════════
  ✅ Sync Complete!
     Albums processed: X
     Images synced: Y
═══════════════════════════════════════════════════
```

### If You Get Errors:

**"GDRIVE_SERVICE_ACCOUNT_KEY environment variable is not set"**
- Check `.env.local` exists in project root
- Verify filename is exactly `.env.local` (not `.env.local.txt`)
- Restart your terminal/IDE

**"Invalid JSON in GDRIVE_SERVICE_ACCOUNT_KEY"**
- Re-minify the JSON (must be single line)
- Check quotes are properly escaped
- Ensure wrapped in single quotes in .env.local

**"Permission denied" on Google Drive**
- Verify folder is shared with service account email
- Wait 1-2 minutes for permissions to propagate
- Check service account has "Viewer" access

**"401 Unauthorized" from Supabase**
- Verify you're using **service_role** key (not anon)
- Check for typos in SUPABASE_SERVICE_ROLE_KEY
- Ensure migration created RLS policies

---

## Step 7: Verify on Website (1 minute)

1. Open your gallery page:
   https://loud-rename-20379962.figma.site/gallery
   (or your custom domain: https://cstlelivn.ca/gallery)

2. ✅ **Success if you see:**
   - Images from your Google Drive displayed
   - Responsive grid layout
   - Hover effects working (zoom + gradient overlay)
   - Album names as categories

3. ❌ **Troubleshoot if you see:**
   - "No gallery items yet" → Check sync ran successfully
   - "Loading gallery..." forever → Check browser console for errors
   - Broken images → Verify Drive URLs are public

---

## 🎉 You're Done!

### What You Can Do Now:

1. **Add new albums:**
   - Create subfolder in `Website Photos` on Google Drive
   - Upload images
   - Run `npm run sync:gallery`

2. **Update images:**
   - Add/remove images in Drive
   - Run `npm run sync:gallery`

3. **Customize display:**
   ```sql
   -- Show more images per album
   UPDATE gallery_albums
   SET max_items = 8
   WHERE slug = 'flooring';
   ```

---

## 📚 Next Steps (Optional)

### Automate the Sync

See `/GOOGLE-DRIVE-GALLERY-SETUP.md` section on automation for:
- GitHub Actions (daily auto-sync)
- Supabase Edge Function + pg_cron
- Server cron job

### Customize Gallery

- Edit hero text in `/content/gallery-content.ts`
- Adjust grid spacing in `/pages/Gallery.tsx`
- Modify hover effects or animations

---

## 🔒 Security Checklist

- [ ] `.env.local` is in `.gitignore` (already done)
- [ ] Service account JSON key is NOT committed to Git
- [ ] Service role key is only in `.env.local` (not in code)
- [ ] Google Drive folder permissions are correct (Viewer only)
- [ ] Database RLS policies are enabled

---

## 📞 Need Help?

1. **Quick Reference:** `/GALLERY-SYNC-QUICKSTART.md`
2. **Full Guide:** `/GOOGLE-DRIVE-GALLERY-SETUP.md`
3. **Troubleshooting:** See setup guide Section 8

---

**Installation complete! 🚀**  
Your gallery is now powered by Google Drive.

# Fix: "Method doesn't allow unregistered callers" Error

## Error Message

```
⛔ Sync Failed:
 Method doesn't allow unregistered callers (callers without established identity). 
 Please use API Key or other form of API consumer identity to call this API.
```

## Root Cause

The **Google Drive API is not enabled** in your Google Cloud project.

---

## Quick Fix (Step-by-Step)

### Step 1: Find Your Google Cloud Project

1. Open the service account JSON key file from your `.env.local`
2. Look for the `"project_id"` field in the JSON
3. Note this project ID (e.g., `cstle-livn-gallery-cms-123456`)

### Step 2: Enable Google Drive API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)

2. **Select your project** from the dropdown at the top

3. Navigate to **APIs & Services** → **Library**
   - Direct link: https://console.cloud.google.com/apis/library

4. In the search box, type: **Google Drive API**

5. Click on **Google Drive API** in the results

6. Click the blue **ENABLE** button

7. Wait for confirmation (usually takes 5-10 seconds)

### Step 3: Verify API is Enabled

1. Go to **APIs & Services** → **Enabled APIs & services**
   - Direct link: https://console.cloud.google.com/apis/dashboard

2. You should see **Google Drive API** in the list

### Step 4: Re-run the Sync

```bash
npm run sync:gallery
```

You should now see successful output:

```
═══════════════════════════════════════════════════
  Gallery Sync: Google Drive → Supabase
═══════════════════════════════════════════════════

📂 Discovering albums from Google Drive...
   Found X subfolders
   ...
```

---

## Still Getting Errors?

### Error: "Permission denied" or "File not found"

**Cause:** Service account doesn't have access to the Google Drive folder.

**Fix:**

1. Go to your `Website Photos` folder in Google Drive:
   https://drive.google.com/drive/folders/1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb

2. Click **Share** button (top right)

3. Add your service account email (from the JSON key file):
   - Look for `"client_email"` in your service account JSON
   - Example: `gallery-cms-sync@your-project.iam.gserviceaccount.com`

4. Set role to **Viewer**

5. Uncheck "Notify people"

6. Click **Share**

7. Wait 1-2 minutes for permissions to propagate

8. Re-run sync

### Error: "Invalid JSON in GDRIVE_SERVICE_ACCOUNT_KEY"

**Cause:** JSON key has line breaks or formatting issues.

**Fix:**

1. Open your `.env.local` file

2. Make sure `GDRIVE_SERVICE_ACCOUNT_KEY` is on ONE line (no line breaks)

3. The value should look like this:
   ```bash
   GDRIVE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project",...}'
   ```

4. If it has line breaks, minify it at: https://www.json-formatter.org/json-minifier

5. Save `.env.local`

6. Restart your terminal

7. Re-run sync

### Error: "401 Unauthorized" from Supabase

**Cause:** Missing or incorrect Supabase service role key.

**Fix:**

1. Go to Supabase dashboard:
   https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/settings/api

2. Copy your **service_role** key (NOT the anon key)

3. Update `.env.local`:
   ```bash
   SUPABASE_SERVICE_ROLE_KEY="your-actual-service-role-key-here"
   ```

4. Save and re-run sync

---

## Verification Checklist

Before running `npm run sync:gallery`, verify:

- [ ] Google Drive API is **enabled** in Google Cloud Console
- [ ] Service account has **Viewer access** to `Website Photos` folder
- [ ] `.env.local` file exists in project root
- [ ] All 4 environment variables are set correctly:
  - `GDRIVE_SERVICE_ACCOUNT_KEY` (minified JSON on one line)
  - `GDRIVE_GALLERY_ROOT_FOLDER="1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb"`
  - `SUPABASE_URL="https://mlxsfhdzlcxtvqeshgjx.supabase.co"`
  - `SUPABASE_SERVICE_ROLE_KEY` (your actual service role key)
- [ ] Terminal was restarted after editing `.env.local`
- [ ] Database migration was run (creates `gallery_albums` and `gallery_images` tables)

---

## Complete Setup Guide

For full setup instructions, see:
- `/GOOGLE-DRIVE-GALLERY-SETUP.md` - Complete setup guide
- `/GALLERY-SYNC-QUICKSTART.md` - Quick reference
- `/START-HERE-GALLERY-SYNC.md` - Getting started

---

**Last Updated:** January 10, 2026

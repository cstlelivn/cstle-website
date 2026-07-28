# Manual Deployment Code

If you can't use the CLI, you can deploy via the Supabase Dashboard.

## Step 1: Go to Supabase Dashboard

Visit: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/functions

## Step 2: Create Function Named `make-server-6e189709`

Click "Create a new function" and name it exactly: `make-server-6e189709`

## Step 3: Replace the function code with this:

**IMPORTANT:** You need to create TWO files:

### File 1: `index.ts` (main file)

Copy all the code from `/supabase/functions/server/index.tsx` in this project

### File 2: `kv_store.tsx` (dependency)

Copy all the code from `/supabase/functions/server/kv_store.tsx` in this project

---

## Alternative: Use Supabase CLI (Easier)

The dashboard method is complex. **I recommend downloading your project** and using the CLI instead:

### Quick CLI Deployment:

1. Download your Figma Make project
2. Unzip it to your Desktop
3. Open Terminal and run:

```bash
cd ~/Desktop/cstle-livn  # or wherever you unzipped

# Install Supabase CLI (Mac)
brew install supabase/tap/supabase

# Or on Windows
scoop install supabase

# Deploy
supabase login
supabase link --project-ref mlxsfhdzlcxtvqeshgjx
supabase functions deploy make-server-6e189709 --no-verify-jwt
```

Done! Your backend is live.

---

## Can't Use Terminal?

If you absolutely cannot use terminal or download the project, you have one more option:

### Use Supabase's Web-based Editor:

1. Go to: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx
2. Click "SQL Editor" → Create a migration to set up your database tables
3. Click "Edge Functions" → Deploy via web editor

However, **the CLI method is strongly recommended** as it's the most reliable way to deploy Edge Functions with dependencies.

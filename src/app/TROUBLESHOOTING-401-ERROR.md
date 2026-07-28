# 🚨 TROUBLESHOOTING: 401 Unauthorized / RLS Policy Error

## Error You're Seeing
```
"new row violates row-level security policy for table \"contact_requests\""
```

## Quick Fix (Try These in Order)

---

### ✅ SOLUTION 1: Run Emergency Fix SQL (RECOMMENDED)

1. **Open Supabase SQL Editor:**
   - Go to: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/sql/new

2. **Copy and Run:**
   - Open `/EMERGENCY-FIX-RLS.sql` in this project
   - Copy **ALL** the SQL
   - Paste into SQL Editor
   - Click **"Run"**

3. **Verify Success:**
   - Scroll to bottom of SQL Editor
   - You should see a table with two rows:
     - `contact_requests | allow_anonymous_inserts`
     - `bookings | allow_anonymous_booking_inserts`

4. **Test Form:**
   - Go to your contact page
   - Submit the form
   - Should work now! ✅

---

### ✅ SOLUTION 2: Temporarily Disable RLS (Testing Only)

If Solution 1 doesn't work, disable RLS completely to verify forms work:

```sql
-- Run this in Supabase SQL Editor
ALTER TABLE public.contact_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
```

**⚠️ WARNING:** Only use this for testing. Re-enable RLS before going to production.

To re-enable later:
```sql
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
```

---

### ✅ SOLUTION 3: Use Edge Function (Bypasses RLS)

If RLS keeps causing issues, use a backend Edge Function instead:

#### Step 1: Deploy Edge Function

```bash
# In your terminal
cd /path/to/project
supabase functions deploy submit-form
```

#### Step 2: Update Contact Form

Replace the fetch call in `/pages/Contact.tsx`:

```tsx
// OLD CODE (around line 66):
const response = await fetch(`https://${projectId}.supabase.co/rest/v1/contact_requests`, {
  method: "POST",
  headers: {
    "apikey": publicAnonKey,
    "Authorization": `Bearer ${publicAnonKey}`,
    "Content-Type": "application/json",
    "Prefer": "return=representation"
  },
  body: JSON.stringify({
    name: formData.name,
    email: formData.email,
    phone: formData.phone || null,
    project_type: formData.projectType || null,
    message: formData.message,
    source_page: "/contact"
  })
});

// NEW CODE:
const response = await fetch(`https://${projectId}.supabase.co/functions/v1/submit-form`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${publicAnonKey}`,
  },
  body: JSON.stringify({
    formType: 'contact',
    data: {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      project_type: formData.projectType || null,
      message: formData.message,
      source_page: "/contact"
    }
  })
});
```

#### Step 3: Update Booking Form

Same change in `/pages/BookService.tsx` but use `formType: 'booking'`

---

## 🔍 Debugging Checklist

Before trying the solutions above, verify:

### 1. Check Your Anon Key
- [ ] Go to: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/settings/api
- [ ] Copy the **anon public** key
- [ ] Does it match `/utils/supabase/info.tsx` line 4?

### 2. Check CORS Settings
- [ ] Go to: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/auth/url-configuration
- [ ] Add your Figma site URL to **Redirect URLs**:
  - `https://loud-rename-20379962.figma.site`

### 3. Check Current Policies
Run this SQL to see current policies:
```sql
SELECT tablename, policyname, roles, cmd, with_check 
FROM pg_policies 
WHERE tablename IN ('contact_requests', 'bookings');
```

Expected result:
- Policies should exist
- `roles` should be `{public}` or similar
- `cmd` should be `INSERT`
- `with_check` should be `true`

---

## 🎯 What's Actually Happening?

**The Problem:**
Supabase Row Level Security (RLS) is blocking your form submissions because the policies aren't configured to allow anonymous users (using the `anon` role) to insert data.

**Why It's Happening:**
1. RLS is enabled on the tables (this is good for security)
2. But the policies were either:
   - Not created correctly
   - Not applied to the right role
   - Deleted accidentally

**The Fix:**
Create policies that explicitly allow INSERT operations for the `public` role (which includes `anon`, `authenticated`, and `service_role`).

---

## 📊 Test the Fix

After running any solution, test with this browser console code:

```javascript
// Open DevTools (F12) and paste this:
fetch('https://mlxsfhdzlcxtvqeshgjx.supabase.co/rest/v1/contact_requests', {
  method: 'POST',
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1seHNmaGR6bGN4dHZxZXNoZ2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NTIyOTEsImV4cCI6MjA3NjIyODI5MX0.ZC_CemlkjJgbPkVDCLOagfLkRDAKwKyLBkt9sA_gSvU',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1seHNmaGR6bGN4dHZxZXNoZ2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NTIyOTEsImV4cCI6MjA3NjIyODI5MX0.ZC_CemlkjJgbPkVDCLOagfLkRDAKwKyLBkt9sA_gSvU',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  },
  body: JSON.stringify({
    name: 'Test',
    email: 'test@test.com',
    message: 'Test message',
    source_page: '/contact'
  })
})
.then(r => r.json())
.then(data => console.log('✅ SUCCESS:', data))
.catch(err => console.error('❌ ERROR:', err));
```

**If it works:** You'll see `✅ SUCCESS` with the inserted data  
**If it fails:** You'll see `❌ ERROR` with details

---

## 🆘 Still Not Working?

If none of these solutions work:

1. **Share the error details:**
   - What does the Response tab in Network DevTools show?
   - What SQL did you run?
   - What was the result?

2. **Check Supabase logs:**
   - Go to: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/logs/explorer
   - Look for errors related to `contact_requests` or `bookings`

3. **Contact support:**
   - The issue might be with your Supabase project configuration
   - Check Supabase Discord: https://discord.supabase.com

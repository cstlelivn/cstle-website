# ✅ Verification Guide - Leads Table Setup

## Quick 3-Step Verification

### Step 1: Run SQL to Setup Leads Table

1. **Open Supabase SQL Editor:**  
   👉 https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/sql/new

2. **Copy and paste ALL SQL from `/SETUP-LEADS-TABLE.sql`**

3. **Click "Run"**

4. **Verify you see this policy:**
   ```
   leads_insert_web | {anon} | INSERT
   ```

✅ **Expected:** Policy created successfully  
❌ **If error:** Share the error message

---

### Step 2: Console Smoke Test

**This tests that the database accepts form submissions:**

1. Open your website: https://loud-rename-20379962.figma.site
2. Open DevTools (F12)
3. Go to **Console** tab
4. Paste this code:

```javascript
fetch("https://mlxsfhdzlcxtvqeshgjx.supabase.co/rest/v1/leads", {
  method: "POST",
  headers: {
    apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1seHNmaGR6bGN4dHZxZXNoZ2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NTIyOTEsImV4cCI6MjA3NjIyODI5MX0.ZC_CemlkjJgbPkVDCLOagfLkRDAKwKyLBkt9sA_gSvU",
    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1seHNmaGR6bGN4dHZxZXNoZ2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NTIyOTEsImV4cCI6MjA3NjIyODI5MX0.ZC_CemlkjJgbPkVDCLOagfLkRDAKwKyLBkt9sA_gSvU",
    "Content-Type": "application/json",
    Prefer: "return=representation"
  },
  body: JSON.stringify({
    name: "Demilade Otayemi",
    email: "demidhemian@gmail.com",
    phone: "3063715817",
    project_type: "Console Smoke Test",
    message: "Testing direct API call",
    source_page: "/contact",
    status: "new"
  })
})
.then(r => r.json().then(b => ({ok: r.ok, status: r.status, body: b})))
.then(result => {
  console.log("🧪 Test Result:", result);
  if (result.status === 201) {
    console.log("✅ SUCCESS! Lead inserted:", result.body);
  } else {
    console.error("❌ FAILED:", result);
  }
});
```

5. Press Enter

**Expected Results:**

✅ **Success (status: 201):**
```
✅ SUCCESS! Lead inserted: 
[{
  id: ...,
  name: "Demilade Otayemi",
  email: "demidhemian@gmail.com",
  ...
}]
```

❌ **If you get 401:**
- The anon key is wrong or missing
- Check `/utils/supabase/info.tsx`

❌ **If you get "violates row-level security policy":**
- RLS policy wasn't created
- Re-run the SQL from Step 1

---

### Step 3: Test Actual Form Submission

1. Go to: https://loud-rename-20379962.figma.site/#/contact

2. Fill out the contact form:
   - Name: Test User
   - Email: test@example.com
   - Phone: 123-456-7890
   - Message: Testing form submission

3. Click **Send Message**

4. **Expected:** Green success message appears:
   > "Thanks—your message was received. We'll reply within 1 business day."

5. **Verify in Supabase:**
   - Go to: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/editor
   - Click **"leads"** table
   - You should see your test submission! ✅

---

## 🎯 What Was Fixed

### Before (Broken):
```tsx
// ❌ Posted to wrong tables
fetch(`/rest/v1/contact_requests`, ...)  // Old table
fetch(`/rest/v1/bookings`, ...)          // Old table
```

### After (Working):
```tsx
// ✅ Posts to leads table
fetch(`/rest/v1/leads`, {
  headers: {
    "apikey": publicAnonKey,              // Required!
    "Authorization": `Bearer ${publicAnonKey}`, // Required!
    "Content-Type": "application/json",
    "Prefer": "return=representation"
  },
  body: JSON.stringify({
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    project_type: formData.projectType,
    message: formData.message,
    source_page: "/contact",
    status: "new"
  })
})
```

---

## 📋 Checklist

Before marking as complete, verify:

- [ ] SQL ran successfully (Step 1)
- [ ] Console smoke test shows status 201 (Step 2)
- [ ] Contact form submission works (Step 3)
- [ ] BookService form submission works (Step 3)
- [ ] Data appears in Supabase `leads` table
- [ ] Admin app can see submissions in real-time

---

## 🔍 Troubleshooting

### "401 Unauthorized" Error

**Check the anon key:**
1. Go to: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/settings/api
2. Copy the **anon public** key
3. Compare with `/utils/supabase/info.tsx` line 4
4. They must match EXACTLY

### "RLS Policy Violation" Error

**Re-run the SQL:**
1. Open `/SETUP-LEADS-TABLE.sql`
2. Copy ALL the SQL
3. Run in Supabase SQL Editor
4. Verify policy is created for `{anon}` role

### "Network Error" or CORS Error

**Check CORS settings:**
1. Go to: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/auth/url-configuration
2. Add these to Redirect URLs:
   - `https://cstlelivn.ca`
   - `https://www.cstlelivn.ca`
   - `https://admin.cstlelivn.ca`
   - `https://work.cstlelivn.ca`
   - `https://loud-rename-20379962.figma.site`

### Form Submits But No Data

**Check table name:**
1. Open DevTools → Network tab
2. Submit form
3. Click on the request
4. URL should be: `/rest/v1/leads` (not `contact_requests` or `bookings`)

---

## 🎉 Success!

Once all three steps pass:
- ✅ Forms submit without 401 errors
- ✅ Data goes into `public.leads` table
- ✅ Admin app can see all submissions
- ✅ Real-time updates work

**Your form submission system is now fully functional!**

---

## 📊 Data Flow

```
Website Form
    ↓
POST /rest/v1/leads
    ↓
Supabase (RLS allows anon insert)
    ↓
public.leads table
    ↓
Admin App (reads via realtime subscription)
```

All forms (Contact, BookService, Reviews) now write to the same `leads` table, making it easy for the admin to manage all submissions in one place.

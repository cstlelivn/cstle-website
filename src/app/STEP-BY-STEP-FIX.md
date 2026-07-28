# 🔧 Step-by-Step Fix for 401 Error

## The Error You're Seeing

```
Error: new row violates row-level security policy for table "contact_requests"
```

---

## ✅ The Fix (5 Minutes)

### Step 1: Open Supabase SQL Editor

1. Click this link: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/sql/new
2. You should see a blank SQL editor

### Step 2: Copy the Fix SQL

1. In this project, open the file: **`EMERGENCY-FIX-RLS.sql`**
2. Select **ALL** the text (Ctrl+A or Cmd+A)
3. Copy it (Ctrl+C or Cmd+C)

### Step 3: Paste and Run

1. Go back to the Supabase SQL Editor
2. Paste the SQL (Ctrl+V or Cmd+V)
3. Click the **"Run"** button (or press Ctrl+Enter)
4. Wait 2-3 seconds

### Step 4: Verify Success

Scroll to the bottom of the SQL Editor. You should see a table that looks like this:

| schemaname | tablename | policyname |
|------------|-----------|------------|
| public | bookings | allow_anonymous_booking_inserts |
| public | contact_requests | allow_anonymous_inserts |

✅ **If you see this:** Success! The policies are created.

❌ **If you see an error:** Copy the error message and let me know.

### Step 5: Test Your Form

1. Go to your contact page: https://loud-rename-20379962.figma.site/contact
2. Fill out the form
3. Click Submit
4. You should see: "Thanks—your message was received. We'll reply within 1 business day."

---

## 🎯 What This Does

The SQL script:
1. Deletes any broken RLS policies
2. Temporarily disables RLS
3. Re-enables RLS with correct settings
4. Creates new policies that allow anonymous form submissions
5. Verifies the policies were created

---

## 🆘 Still Not Working?

### Option A: Temporarily Disable RLS (Testing Only)

If the fix above doesn't work, you can disable RLS completely to test:

1. Go to: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/sql/new
2. Run this SQL:

```sql
ALTER TABLE public.contact_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
```

3. Try the form again - it should work now
4. ⚠️ **Remember:** Re-enable RLS before going live!

### Option B: Check the Error Details

1. Open your browser DevTools (F12)
2. Go to the **Network** tab
3. Submit the form
4. Click on the failed request
5. Look at the **Response** tab
6. What does it say?

Share that with me and I'll help fix it.

---

## 📊 Quick Test

Want to test if Supabase is working without the form?

1. Open DevTools (F12)
2. Go to **Console** tab
3. Paste this code:

```javascript
fetch('https://mlxsfhdzlcxtvqeshgjx.supabase.co/rest/v1/contact_requests', {
  method: 'POST',
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1seHNmaGR6bGN4dHZxZXNoZ2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NTIyOTEsImV4cCI6MjA3NjIyODI5MX0.ZC_CemlkjJgbPkVDCLOagfLkRDAKwKyLBkt9sA_gSvU',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1seHNmaGR6bGN4dHZxZXNoZ2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NTIyOTEsImV4cCI6MjA3NjIyODI5MX0.ZC_CemlkjJgbPkVDCLOagfLkRDAKwKyLBkt9sA_gSvU',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@test.com',
    message: 'Test message',
    source_page: '/contact'
  })
})
.then(r => r.json())
.then(data => console.log('✅ SUCCESS:', data))
.catch(err => console.error('❌ ERROR:', err));
```

4. Press Enter
5. Look at the result:
   - ✅ `SUCCESS:` → Supabase works! Problem is in your code
   - ❌ `ERROR:` → Supabase problem, need to fix policies

---

## 🎉 Success!

Once the form works, you're all done! The RLS policies are now configured correctly and your forms will save data to Supabase.

**Next steps:**
- Test both Contact and Book Service forms
- Check the Supabase Table Editor to see submissions
- Set up the admin notification emails (optional)

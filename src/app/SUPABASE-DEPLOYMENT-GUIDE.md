# Supabase Deployment Guide for Cstle Livn

This guide will help you deploy your backend Edge Function to Supabase and create your first admin account.

## Prerequisites

- Supabase CLI installed on your computer
- Your Supabase project credentials (already configured ✅)

---

## Step 1: Install Supabase CLI

If you haven't already, install the Supabase CLI:

### Mac/Linux:
```bash
brew install supabase/tap/supabase
```

### Windows:
```powershell
scoop install supabase
```

Or download from: https://github.com/supabase/cli/releases

---

## Step 2: Login to Supabase

Open your terminal and login:

```bash
supabase login
```

This will open your browser to authenticate.

---

## Step 3: Link Your Project

In your project directory, link to your Supabase project:

```bash
supabase link --project-ref mlxsfhdzlcxtvqeshgjx
```

When prompted, enter your database password from your Supabase dashboard.

---

## Step 4: Deploy the Edge Function

Deploy the backend function to Supabase:

```bash
supabase functions deploy make-server-6e189709 --no-verify-jwt
```

**Important:** The `--no-verify-jwt` flag is required for this function to work properly.

---

## Step 5: Set Environment Variables (if needed)

The Edge Function should automatically have access to:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

These are automatically provided by Supabase. If you need to verify they're set:

```bash
supabase secrets list
```

---

## Step 6: Create Your First Admin Account

**Option A: Using the Web Interface (Recommended)**

1. Navigate to your website
2. Go to `/#/admin-setup`
3. Fill in the form:
   - **Full Name:** Your name
   - **Email:** Your admin email
   - **Password:** Create a strong password (minimum 6 characters)
   - **Confirm Password:** Re-enter your password
4. Click "Create Admin Account"
5. Once successful, click "Go to Admin Login"
6. Log in with your credentials

**Option B: Using the Browser Console**

1. Navigate to your website
2. Open browser console (F12)
3. Run this code (replace with your details):

```javascript
fetch('https://mlxsfhdzlcxtvqeshgjx.supabase.co/functions/v1/make-server-6e189709/admin/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1seHNmaGR6bGN4dHZxZXNoZ2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NTIyOTEsImV4cCI6MjA3NjIyODI5MX0.ZC_CemlkjJgbPkVDCLOagfLkRDAKwKyLBkt9sA_gSvU'
  },
  body: JSON.stringify({
    email: 'your-email@example.com',
    password: 'your-secure-password',
    name: 'Your Name'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## Step 7: Test Your Setup

1. **Test Form Submissions:**
   - Go to `/#/contact` and submit a test message
   - Go to `/#/book` and submit a test booking

2. **Check Admin Panel:**
   - Navigate to `/#/admin`
   - Log in with your admin credentials
   - Check the "Leads" tab - you should see your test submissions!

3. **Test Other Features:**
   - Upload a gallery image
   - Add a FAQ
   - Add a review
   - Update site information

---

## Step 8: Security (Optional but Recommended)

After creating your admin account, you can remove the admin setup route for security:

**Edit `/App.tsx` and remove this line:**
```tsx
<Route path="/admin-setup" element={<AdminSetup />} />
```

**And remove this import:**
```tsx
import { AdminSetup } from "./pages/AdminSetup";
```

---

## Troubleshooting

### Function won't deploy
- Make sure you're logged in: `supabase login`
- Make sure project is linked: `supabase link --project-ref mlxsfhdzlcxtvqeshgjx`
- Try with verbose output: `supabase functions deploy make-server-6e189709 --no-verify-jwt --debug`

### Can't create admin account
- Check browser console for errors
- Verify the Edge Function is deployed in your Supabase dashboard
- Make sure you're using the correct project URL and API key

### Forms not saving data
- Check browser console for errors
- Verify Edge Function is deployed
- Check that CORS is enabled (it should be by default in the server code)

---

## Your Deployment Checklist

- [ ] Supabase CLI installed
- [ ] Logged into Supabase CLI
- [ ] Project linked to Supabase
- [ ] Edge Function deployed
- [ ] First admin account created
- [ ] Test forms working (Contact & Book Service)
- [ ] Admin panel accessible
- [ ] Leads appearing in admin panel
- [ ] (Optional) Admin setup route removed

---

## Next Steps

Once everything is deployed:

1. **Start managing content:**
   - Add real gallery images
   - Add FAQs
   - Update site information

2. **Monitor leads:**
   - Check the Leads tab regularly
   - Update lead statuses as you contact customers
   - Use the status workflow: New → Contacted → Converted → Closed

3. **Manage reviews:**
   - Approve/reject customer reviews
   - Delete spam reviews

---

## Support

If you encounter any issues:

1. Check the browser console for errors
2. Check Supabase Edge Function logs in your dashboard
3. Review the troubleshooting section above
4. Verify all environment variables are set correctly

---

**Your Supabase Project Details:**
- **Project URL:** https://mlxsfhdzlcxtvqeshgjx.supabase.co
- **Project ID:** mlxsfhdzlcxtvqeshgjx
- **Edge Function Name:** make-server-6e189709

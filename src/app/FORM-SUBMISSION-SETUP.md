# 📋 Form Submission Setup Guide

Complete end-to-end setup for Contact and Book a Service forms with Supabase backend, email notifications, and admin dashboard.

---

## 🚀 Quick Start Checklist

- [ ] Run SQL migrations in Supabase
- [ ] Configure CORS in Supabase Dashboard
- [ ] Deploy Edge Function for email notifications
- [ ] Set up Resend account for emails
- [ ] Test form submissions
- [ ] Verify email notifications
- [ ] Check admin dashboard

---

## 📊 1. Database Setup (Supabase SQL Editor)

### Step 1.1: Run the SQL Migration

1. Go to your Supabase project: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the entire contents of `/SUPABASE-MIGRATIONS.sql`
5. Click **Run** to execute

### Step 1.2: Verify Tables Created

Navigate to **Database** → **Tables** and confirm you see:
- `contact_requests` - 8 columns
- `bookings` - 11 columns

Both should have RLS (Row Level Security) enabled with green checkmark.

---

## 🌐 2. CORS Configuration

### Step 2.1: Configure Allowed Origins

1. In Supabase Dashboard, go to **Authentication** → **URL Configuration**
2. Set the following:

**Site URL:**
```
https://cstlelivn.ca
```

**Additional Redirect URLs** (one per line):
```
https://www.cstlelivn.ca
https://admin.cstlelivn.ca
https://work.cstlelivn.ca
```

3. Click **Save**

### Step 2.2: Verify CORS Settings

If there's an **Allowed CORS Origins** field, add the same URLs:
```
https://cstlelivn.ca
https://www.cstlelivn.ca
https://admin.cstlelivn.ca
https://work.cstlelivn.ca
```

---

## 📧 3. Email Notifications Setup

### Step 3.1: Create Resend Account

1. Go to https://resend.com
2. Sign up for a free account (100 emails/day free)
3. Verify your email address

### Step 3.2: Add Domain (Recommended)

1. In Resend Dashboard → **Domains**
2. Click **Add Domain**
3. Enter `cstlelivn.ca`
4. Add the DNS records shown to your domain provider:
   - SPF record (TXT)
   - DKIM record (TXT)
   - DMARC record (TXT - optional but recommended)
5. Wait for verification (usually 5-15 minutes)

**Alternative:** Use Resend's test domain `onboarding.resend.dev` for testing (emails may go to spam)

### Step 3.3: Get API Key

1. In Resend Dashboard → **API Keys**
2. Click **Create API Key**
3. Name it: `Cstle Livn - Production`
4. Copy the key (starts with `re_...`)
5. **Save it securely** - you won't see it again!

---

## 🔧 4. Deploy Edge Function

### Step 4.1: Install Supabase CLI

**macOS:**
```bash
brew install supabase/tap/supabase
```

**Windows:**
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**Linux:**
```bash
brew install supabase/tap/supabase
```

### Step 4.2: Login and Link Project

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref mlxsfhdzlcxtvqeshgjx
```

### Step 4.3: Create Function Directory

```bash
# Create the function directory
mkdir -p supabase/functions/notify-admin

# Copy the edge function code
cp EDGE-FUNCTION-notify-admin.ts supabase/functions/notify-admin/index.ts
```

### Step 4.4: Deploy the Function

```bash
# Deploy the function
supabase functions deploy notify-admin

# Verify deployment
supabase functions list
```

You should see `notify-admin` in the list with status `ACTIVE`.

### Step 4.5: Set Environment Variables

1. Go to Supabase Dashboard → **Edge Functions**
2. Click on `notify-admin`
3. Go to **Environment Variables** tab
4. Add the following secrets:

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `ADMIN_NOTIFY_EMAIL` | `info@cstlelivn.ca` | Email to receive notifications |
| `RESEND_API_KEY` | `re_...` | Your Resend API key from Step 3.3 |

5. Click **Save**

---

## ✅ 5. Test Form Submissions

### Step 5.1: Test Contact Form

1. Go to your website: https://cstlelivn.ca/contact
2. Fill out the contact form:
   - Name: Test User
   - Email: your-email@example.com
   - Phone: (306) 123-4567
   - Project Type: Kitchen finishing
   - Message: This is a test message
3. Click **Send Message**
4. You should see a green success message
5. Check `info@cstlelivn.ca` inbox for notification email

### Step 5.2: Test Booking Form

1. Go to https://cstlelivn.ca/book
2. Fill out all required fields
3. Select a future date from calendar
4. Click **Book Consultation**
5. You should see a green success message
6. Check `info@cstlelivn.ca` inbox for notification email

### Step 5.3: Verify Database Entries

1. In Supabase Dashboard → **Table Editor**
2. Open `contact_requests` table
3. You should see your test contact entry
4. Open `bookings` table  
5. You should see your test booking entry

---

## 🛡️ 6. Security Features Implemented

### ✅ Spam Protection
- **Honeypot field** `company` - bots filling this field are silently rejected
- **RLS policies** - only anonymous inserts allowed, no reads without auth
- **Email/phone validation** - regex patterns enforce correct formats

### ✅ Error Handling
- Form submission errors don't expose database details
- Email notification failures don't block form submission
- User-friendly error messages
- Console logging for debugging

### ✅ Data Validation
- Required fields enforced
- Email format: `/^\S+@\S+\.\S+$/`
- Phone format: `/^[\d\s\+\-\(\)]+$/`
- Input sanitization via Supabase

---

## 📱 7. Form States & UX

Both forms implement 4 states:

| State | Description | UI |
|-------|-------------|-----|
| `idle` | Default state | Normal form |
| `submitting` | Form being submitted | Button disabled, "Sending..." text |
| `success` | Submission successful | Green alert, form cleared, scroll to top |
| `error` | Submission failed | Red alert, error message |

### Success Messages
- **Contact:** "Thanks—your message was received. We'll reply within 1 business day."
- **Booking:** "Thanks—your consultation request was received. We'll confirm your date shortly."

---

## 🔍 8. Troubleshooting

### Form submission fails with CORS error

**Solution:**
1. Check Authentication → URL Configuration in Supabase
2. Ensure your domain is listed
3. Clear browser cache and try again

### Email notifications not arriving

**Solution:**
1. Check Resend Dashboard → **Logs** for delivery status
2. Verify DNS records are configured (if using custom domain)
3. Check spam folder
4. Verify `RESEND_API_KEY` is set correctly in Edge Function env vars

### Database insert fails

**Solution:**
1. Check Supabase Dashboard → **Logs** → **Postgres Logs**
2. Verify RLS policies are correct
3. Ensure `anon` policy exists for both tables

### Edge function returns 500 error

**Solution:**
1. Check Edge Function logs in Supabase Dashboard
2. Verify environment variables are set
3. Redeploy function: `supabase functions deploy notify-admin`

---

## 📊 9. Monitoring & Logs

### View Form Submissions
```bash
# In Supabase SQL Editor
SELECT * FROM contact_requests ORDER BY created_at DESC LIMIT 10;
SELECT * FROM bookings ORDER BY created_at DESC LIMIT 10;
```

### View Email Delivery Status
1. Go to Resend Dashboard
2. Click **Logs**
3. Filter by date/status

### View Edge Function Logs
1. Supabase Dashboard → **Edge Functions**
2. Click `notify-admin`
3. Go to **Logs** tab

---

## 🎯 10. Next Steps

### Optional Enhancements

1. **Admin Dashboard** - Build a React admin panel to view/manage submissions
2. **Status Updates** - Add booking status workflow (new → confirmed → completed)
3. **Email Templates** - Customize Resend email templates with branding
4. **Auto-responses** - Send confirmation emails to users
5. **Webhook Integration** - Notify Slack/Discord of new submissions
6. **Export Data** - Add CSV export for submissions

---

## 📞 Support

### Useful Links
- Supabase Docs: https://supabase.com/docs
- Resend Docs: https://resend.com/docs
- Project Dashboard: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx

### Quick Reference

**Supabase Project ID:** `mlxsfhdzlcxtvqeshgjx`  
**Edge Function URL:** `https://mlxsfhdzlcxtvqeshgjx.supabase.co/functions/v1/notify-admin`  
**Admin Email:** `info@cstlelivn.ca`

---

## ✅ Setup Complete!

You now have a fully functional form submission system with:
- ✅ Supabase database storage
- ✅ Email notifications via Resend
- ✅ Spam protection
- ✅ Validation & error handling
- ✅ Professional UX with loading/success/error states

**Test the forms and start receiving leads!** 🚀

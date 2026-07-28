# Email Notifications Deployment Guide

Complete step-by-step guide to enable automatic email notifications for Contact and Booking form submissions.

---

## 📧 What This Does

- ✅ Automatically sends email to **cstlelivn@gmail.com** when someone submits a form
- ✅ Works for both **Contact** and **Booking** forms
- ✅ No CORS errors (server-side only)
- ✅ No frontend code changes needed
- ✅ Instant delivery (< 5 seconds after submission)
- ✅ Professional HTML emails with all form data

---

## 🚀 Quick Start (5 Steps)

### Step 1: Get Resend API Key (2 minutes)

1. Go to [https://resend.com/signup](https://resend.com/signup)
2. Sign up with your email (free plan: 100 emails/day)
3. Verify your email
4. Go to **API Keys** → **Create API Key**
5. Name it: `Cstle Livn Website`
6. **Copy the API key** (starts with `re_...`)
7. ⚠️ **Save it somewhere safe** - you can't see it again!

### Step 2: Verify Domain in Resend (5 minutes)

1. In Resend dashboard, go to **Domains** → **Add Domain**
2. Enter: `cstlelivn.ca`
3. Resend will show DNS records to add
4. Go to your domain registrar (GoDaddy, Namecheap, etc.)
5. Add the DNS records (TXT, CNAME, MX)
6. Wait 5-10 minutes for DNS propagation
7. Click **Verify** in Resend

**OR use the default domain (faster):**
- Skip domain verification
- Emails will be sent from `onboarding@resend.dev`
- Still works perfectly, just less branded

### Step 3: Deploy Edge Function (2 minutes)

#### Option A: Using Supabase CLI (Recommended)

```bash
# 1. Install Supabase CLI (if not installed)
npm install -g supabase

# 2. Login to Supabase
supabase login

# 3. Link to your project
supabase link --project-ref mlxsfhdzlcxtvqeshgjx

# 4. Deploy the function
supabase functions deploy notify-admin --no-verify-jwt

# 5. Success! Function is now live
```

#### Option B: Via Supabase Dashboard

1. Go to: [Supabase Edge Functions](https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/functions)
2. Click **Create a new function**
3. Name: `notify-admin`
4. Copy the code from `/supabase/functions/notify-admin/index.ts`
5. Paste it into the editor
6. Click **Deploy function**

### Step 4: Set Environment Variables (1 minute)

1. Go to: [Edge Functions Settings](https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/settings/functions)
2. Click **Add secret**
3. Add these two secrets:

| Name | Value |
|------|-------|
| `RESEND_API_KEY` | `re_xxxxxxxxxx` (from Step 1) |
| `ADMIN_EMAIL` | `cstlelivn@gmail.com` |

4. Click **Save**

### Step 5: Create Database Webhook (3 minutes)

1. Go to: [Database Webhooks](https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/database/hooks)
2. Click **Create a new hook**
3. Select **Database Webhook**
4. Configure:

| Field | Value |
|-------|-------|
| **Name** | Notify Admin on New Lead |
| **Schema** | public |
| **Table** | leads |
| **Events** | ✅ INSERT (check this box) |
| **Type** | Webhook |
| **Method** | POST |
| **URL** | `https://mlxsfhdzlcxtvqeshgjx.supabase.co/functions/v1/notify-admin` |

5. Add HTTP Headers:
   - Click **Add header**
   - Key: `Content-Type`
   - Value: `application/json`

6. Click **Create webhook**

---

## ✅ Test It Works

### Option 1: Submit a Real Form

1. Go to your website: https://cstlelivn.ca/contact
2. Fill out the contact form
3. Click Submit
4. **Check your email** (cstlelivn@gmail.com)
5. You should receive an email within 5 seconds!

### Option 2: Test via SQL (Faster)

1. Go to: [SQL Editor](https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/sql/new)
2. Run this query:

```sql
INSERT INTO public.leads (
  source_form,
  source_page,
  name,
  email,
  phone,
  project_type,
  message,
  status
) VALUES (
  'contact',
  '/contact',
  'Test User',
  'test@example.com',
  '306-555-1234',
  'Baseboards',
  'This is a test message to verify email notifications.',
  'new'
);
```

3. Check your email!

### Option 3: Check Edge Function Logs

1. Go to: [Edge Function Logs](https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/functions/notify-admin/logs)
2. You should see:
   - ✅ "Email sent successfully"
   - ✅ Resend email ID
3. If you see errors, check the Troubleshooting section below

---

## 📧 What the Emails Look Like

### Contact Form Email

**Subject:** 💬 New Contact Message - Cstle Livn

**Content:**
- Name
- Email (clickable)
- Phone (clickable)
- Project Type
- Message
- Timestamp
- Link to Admin Dashboard

### Booking Form Email

**Subject:** 🔨 New Booking Request - Cstle Livn

**Content:**
- Name
- Email (clickable)
- Phone (clickable)
- Service Type
- Project Address
- Preferred Date
- Preferred Time (if selected)
- Project Details
- Timestamp
- Link to Admin Dashboard

---

## 🔧 Advanced Configuration

### Change Notification Email Address

Update the `ADMIN_EMAIL` environment variable:

1. Go to: [Edge Functions Settings](https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/settings/functions)
2. Find `ADMIN_EMAIL`
3. Click **Edit**
4. Change to new email
5. Click **Save**

### Add Multiple Recipients

Edit `/supabase/functions/notify-admin/index.ts`:

```typescript
// Change this line (around line 182):
to: [adminEmail],

// To this:
to: [adminEmail, "secondemail@example.com", "thirdemail@example.com"],
```

Redeploy:
```bash
supabase functions deploy notify-admin --no-verify-jwt
```

### Customize Email Template

Edit the `htmlContent` and `textContent` variables in `/supabase/functions/notify-admin/index.ts`.

Examples:
- Add company logo
- Change colors
- Add custom fields
- Format differently

After editing, redeploy the function.

### Change "From" Email Address

After verifying your domain in Resend, update line ~182:

```typescript
from: "Cstle Livn Website <notifications@cstlelivn.ca>",
```

To:
```typescript
from: "Cstle Livn <info@cstlelivn.ca>",
// or
from: "Cstle Livn <noreply@cstlelivn.ca>",
```

---

## 🐛 Troubleshooting

### No Email Received

**Check 1: Spam Folder**
- Email might be in spam
- Mark as "Not Spam" to train filter

**Check 2: Edge Function Logs**
1. Go to: [Function Logs](https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/functions/notify-admin/logs)
2. Look for errors
3. Common issues:
   - "RESEND_API_KEY not set" → Add env variable
   - "Resend API error 401" → Invalid API key
   - "Resend API error 403" → Domain not verified

**Check 3: Database Webhook Status**
1. Go to: [Database Webhooks](https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/database/hooks)
2. Check webhook is **Enabled** (green)
3. Click on webhook to see delivery logs
4. If no deliveries, webhook isn't triggering

**Check 4: Resend Dashboard**
1. Go to: [Resend Emails](https://resend.com/emails)
2. Check if email was sent
3. View delivery status, opens, bounces

### Email Sent But Not Delivered

**Possible causes:**
- Email bounced (invalid recipient)
- Blocked by recipient's spam filter
- Domain not verified (Resend has sending limits)

**Solutions:**
1. Verify domain in Resend (increases deliverability)
2. Add SPF/DKIM records (shown in Resend)
3. Check Resend logs for bounce reasons

### Duplicate Emails

If receiving multiple emails per submission:

1. Check how many webhooks exist:
   - Go to: [Database Webhooks](https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/database/hooks)
   - Delete duplicate webhooks
   - Keep only one

2. Check database triggers:
```sql
-- Run this query:
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_name LIKE '%lead%';

-- If duplicates exist, drop them:
-- DROP TRIGGER trigger_name ON public.leads;
```

### Function Deployment Fails

**Error: "Command not found: supabase"**

Install Supabase CLI:
```bash
npm install -g supabase
```

**Error: "Not logged in"**

Login first:
```bash
supabase login
```

**Error: "Project not linked"**

Link project:
```bash
supabase link --project-ref mlxsfhdzlcxtvqeshgjx
```

---

## 🎯 Verification Checklist

After setup, verify everything works:

- [ ] Resend account created
- [ ] Resend API key obtained
- [ ] Domain verified in Resend (or using default)
- [ ] Edge Function deployed (`notify-admin`)
- [ ] Environment variables set (`RESEND_API_KEY`, `ADMIN_EMAIL`)
- [ ] Database webhook created
- [ ] Webhook is **Enabled**
- [ ] Test email received successfully
- [ ] Contact form triggers email
- [ ] Booking form triggers email
- [ ] Emails go to correct address (cstlelivn@gmail.com)
- [ ] No errors in Edge Function logs
- [ ] No CORS errors in browser console

---

## 📊 Monitoring

### View Email History

**Resend Dashboard:**
- Go to: https://resend.com/emails
- See all sent emails
- View delivery status
- Check opens (if enabled)

**Supabase Edge Function Logs:**
- Go to: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/functions/notify-admin/logs
- Real-time function execution logs
- Debug errors

**Database Webhook Logs:**
- Go to: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/database/hooks
- Click on webhook
- View delivery history

### Set Up Alerts

**Resend:**
- Supports webhook for email events
- Can notify you of bounces, complaints

**Supabase:**
- No built-in alerting for Edge Functions
- Monitor logs manually

---

## 💰 Pricing

**Resend (Email Service):**
- Free: 100 emails/day, 1 domain
- Pro: $20/month, 50,000 emails/month
- Scale: Custom pricing

**Supabase (Database + Functions):**
- Free: 500,000 Edge Function invocations/month
- Pro: $25/month, 2 million invocations/month

**Current setup:** 100% FREE for low traffic (< 100 form submissions/day)

---

## 🔐 Security Notes

- ✅ Resend API key is stored as Supabase secret (not exposed)
- ✅ Edge Function runs server-side (no frontend access)
- ✅ No CORS issues (webhook is server-to-server)
- ✅ Emails sent from verified domain increase trust
- ✅ No rate limiting needed (Supabase handles this)

---

## 🚀 Production Checklist

Before going live:

1. [ ] Use verified custom domain (not `onboarding@resend.dev`)
2. [ ] Set up SPF, DKIM, DMARC records
3. [ ] Test both Contact and Booking forms
4. [ ] Verify correct email address receives notifications
5. [ ] Check spam folder behavior
6. [ ] Monitor logs for first week
7. [ ] Set up email forwarding rules if needed
8. [ ] Create email filter/label for form submissions

---

## 📞 Support

**Resend Issues:**
- Docs: https://resend.com/docs
- Support: support@resend.com

**Supabase Issues:**
- Docs: https://supabase.com/docs/guides/functions
- Discord: https://discord.supabase.com

**Edge Function Code Issues:**
- Check `/supabase/functions/notify-admin/index.ts`
- View logs in Supabase Dashboard
- Test locally: `supabase functions serve notify-admin`

---

## ✨ Success!

Once deployed, your workflow will be:

1. 👤 **User** submits Contact or Booking form
2. 💾 **Database** saves to `leads` table
3. 🔔 **Webhook** triggers Edge Function
4. 📧 **Email** sent via Resend to cstlelivn@gmail.com
5. ✅ **Admin** receives notification instantly

**Total time from form submit to email: < 5 seconds**

No manual checking. No CORS errors. Just reliable, instant notifications.

🎉 **Your email notifications are now live!**

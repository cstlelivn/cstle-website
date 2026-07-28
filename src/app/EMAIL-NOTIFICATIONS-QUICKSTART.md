# Email Notifications - Quick Start

**⏱ Total Time: 10 minutes**

Get automatic email notifications for every Contact and Booking form submission.

---

## ✅ What You Need

- [ ] Resend account (free) - https://resend.com/signup
- [ ] Supabase CLI installed - `npm install -g supabase`
- [ ] 10 minutes of your time

---

## 🚀 5-Step Setup

### Step 1: Get Resend API Key (2 min)

1. Sign up: https://resend.com/signup
2. Verify your email
3. Go to **API Keys** → **Create API Key**
4. Copy the key (starts with `re_...`)
5. ✅ Keep it safe - you'll need it in Step 3

### Step 2: Deploy Edge Function (2 min)

Open terminal and run:

```bash
# Login to Supabase
supabase login

# Link to project
supabase link --project-ref mlxsfhdzlcxtvqeshgjx

# Deploy function
supabase functions deploy notify-admin --no-verify-jwt
```

✅ Function is now deployed!

### Step 3: Set Environment Variables (1 min)

Go to: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/settings/functions

Click **Add secret** and add:

| Name | Value |
|------|-------|
| `RESEND_API_KEY` | Paste your API key from Step 1 |
| `ADMIN_EMAIL` | `cstlelivn@gmail.com` |

Click **Save**

✅ Environment configured!

### Step 4: Create Database Webhook (3 min)

Go to: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/database/hooks

Click **Create a new hook** and fill in:

| Field | Value |
|-------|-------|
| **Name** | Notify Admin on New Lead |
| **Schema** | public |
| **Table** | leads |
| **Events** | ✅ INSERT (check this) |
| **Type** | Webhook |
| **Method** | POST |
| **URL** | `https://mlxsfhdzlcxtvqeshgjx.supabase.co/functions/v1/notify-admin` |

**HTTP Headers:**
- Key: `Content-Type`
- Value: `application/json`

Click **Create webhook**

✅ Webhook created!

### Step 5: Test It (2 min)

#### Option A: Real Form Test

1. Go to: https://cstlelivn.ca/contact
2. Fill out the form
3. Click Submit
4. **Check your email** (cstlelivn@gmail.com)
5. You should see: "💬 New Contact Message - Cstle Livn"

#### Option B: SQL Test (Faster)

Go to: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/sql/new

Run this:

```sql
INSERT INTO public.leads (
  source_form, source_page, name, email, phone,
  project_type, message, status
) VALUES (
  'contact', '/contact', 'Test User', 'test@example.com',
  '306-555-1234', 'Baseboards', 'Test notification', 'new'
);
```

**Check email in 5 seconds!**

✅ **If you received an email → Success! 🎉**

---

## 🐛 Not Working? Quick Fixes

### No Email Received

1. **Check spam folder** - Mark as "Not Spam"
2. **Check logs:** https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/functions/notify-admin/logs
3. **Verify webhook is enabled:** Go to Database Hooks and check green status

### See Error in Logs

| Error | Fix |
|-------|-----|
| "RESEND_API_KEY not set" | Add it in Step 3 |
| "401 Unauthorized" | API key is wrong - get new one |
| "Webhook failed" | Check webhook URL is correct |

### Still Stuck?

See full troubleshooting guide: `/EMAIL-NOTIFICATIONS-DEPLOYMENT-GUIDE.md`

---

## 📧 What Emails Look Like

### Contact Form

```
Subject: 💬 New Contact Message - Cstle Livn

Name: John Doe
Email: john@example.com
Phone: 306-555-1234
Project Type: Baseboards

Message:
Looking for a quote...

Submitted: Nov 18, 2025, 3:45 PM
```

### Booking Form

```
Subject: 🔨 New Booking Request - Cstle Livn

Name: Jane Smith
Email: jane@example.com
Phone: 306-555-5678
Service: Crown Moulding
Address: 123 Main St
Preferred Date: Nov 25, 2025
Preferred Time: 2:00 PM

Details:
Need crown moulding installed...

Submitted: Nov 18, 2025, 4:12 PM
```

---

## 🎯 Success!

You're now receiving instant email notifications for every form submission!

**What happens now:**
1. ✅ User submits form → Saved to database
2. ✅ Database trigger fires → Calls Edge Function
3. ✅ Edge Function → Sends email via Resend
4. ✅ **You get email in < 5 seconds**

**No more manual checking!**

---

## 📚 Learn More

- **Full deployment guide:** `/EMAIL-NOTIFICATIONS-DEPLOYMENT-GUIDE.md`
- **Technical details:** `/EMAIL-NOTIFICATIONS-SUMMARY.md`
- **Database setup:** `/EMAIL-NOTIFICATIONS-SETUP.sql`
- **Edge Function code:** `/supabase/functions/notify-admin/index.ts`

---

## 🔧 Optional Enhancements

### Verify Your Domain (Better Deliverability)

1. Add `cstlelivn.ca` in Resend dashboard
2. Add DNS records shown
3. Wait for verification
4. Emails will come from `info@cstlelivn.ca` instead of generic sender

### Add Multiple Recipients

Edit environment variable `ADMIN_EMAIL`:
```
cstlelivn@gmail.com,second@email.com
```

Or edit Edge Function code for full control.

### Customize Email Template

Edit `/supabase/functions/notify-admin/index.ts` to:
- Add company logo
- Change colors
- Add custom fields
- Format differently

Then redeploy: `supabase functions deploy notify-admin --no-verify-jwt`

---

## 💡 Tips

- **Free tier limits:** 100 emails/day (plenty for your traffic)
- **Check spam folder:** First email might go to spam
- **Test regularly:** Run SQL test to verify it's working
- **Monitor logs:** Check Edge Function logs weekly
- **Keep API key safe:** Never commit to GitHub

---

**🎊 You're all set! Enjoy instant lead notifications.**

Questions? See the full guide or check Edge Function logs for debugging.

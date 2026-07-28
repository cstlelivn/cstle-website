# Email Notifications Documentation Index

Complete guide to automatic email notifications for Cstle Livn website form submissions.

---

## 📖 Documentation Overview

This documentation set provides everything you need to deploy, configure, and maintain automatic email notifications.

---

## 🚀 Quick Navigation

### **Just Getting Started?**
👉 **Start here:** [`/EMAIL-NOTIFICATIONS-QUICKSTART.md`](/EMAIL-NOTIFICATIONS-QUICKSTART.md)
- 10-minute setup
- Step-by-step instructions
- Quick troubleshooting

### **Need Detailed Instructions?**
👉 **Read this:** [`/EMAIL-NOTIFICATIONS-DEPLOYMENT-GUIDE.md`](/EMAIL-NOTIFICATIONS-DEPLOYMENT-GUIDE.md)
- Complete deployment walkthrough
- Domain verification guide
- Advanced configuration
- Comprehensive troubleshooting

### **Want Technical Details?**
👉 **See this:** [`/EMAIL-NOTIFICATIONS-SUMMARY.md`](/EMAIL-NOTIFICATIONS-SUMMARY.md)
- Architecture overview
- Data flow diagrams
- Configuration options
- Monitoring and debugging

### **Setting Up Database?**
👉 **Use this:** [`/EMAIL-NOTIFICATIONS-SETUP.sql`](/EMAIL-NOTIFICATIONS-SETUP.sql)
- Database trigger SQL
- Webhook setup instructions
- Verification queries
- Test scripts

### **Ready to Deploy?**
👉 **Run this:** [`/deploy-email-notifications.sh`](/deploy-email-notifications.sh)
- Automated deployment script
- CLI-based setup
- Environment variable configuration

---

## 📁 File Structure

```
/
├── EMAIL-NOTIFICATIONS-QUICKSTART.md       ← Start here (10 min setup)
├── EMAIL-NOTIFICATIONS-DEPLOYMENT-GUIDE.md ← Full guide (30 min read)
├── EMAIL-NOTIFICATIONS-SUMMARY.md          ← Technical details
├── EMAIL-NOTIFICATIONS-SETUP.sql           ← Database setup
├── EMAIL-NOTIFICATIONS-INDEX.md            ← You are here
├── deploy-email-notifications.sh           ← Deployment script
│
├── supabase/
│   └── functions/
│       └── notify-admin/
│           └── index.ts                    ← Edge Function code
│
└── guidelines/
    └── Guidelines.md                       ← Updated with email info
```

---

## 🎯 By Use Case

### "I want to set this up right now"
1. [`QUICKSTART.md`](/EMAIL-NOTIFICATIONS-QUICKSTART.md) - 5 steps, 10 minutes
2. Test it works
3. Done!

### "I want to understand how it works"
1. [`SUMMARY.md`](/EMAIL-NOTIFICATIONS-SUMMARY.md) - Architecture & data flow
2. [`/supabase/functions/notify-admin/index.ts`](/supabase/functions/notify-admin/index.ts) - Review code
3. [`SETUP.sql`](/EMAIL-NOTIFICATIONS-SETUP.sql) - Database triggers

### "I'm having problems"
1. [`DEPLOYMENT-GUIDE.md`](/EMAIL-NOTIFICATIONS-DEPLOYMENT-GUIDE.md#troubleshooting) - Troubleshooting section
2. Check Edge Function logs in Supabase dashboard
3. Review webhook delivery logs

### "I want to customize emails"
1. Edit [`/supabase/functions/notify-admin/index.ts`](/supabase/functions/notify-admin/index.ts)
2. Modify `htmlContent` and `textContent` variables
3. Redeploy: `supabase functions deploy notify-admin --no-verify-jwt`

### "I need to change settings"
1. **Email recipient:** Update `ADMIN_EMAIL` in Supabase Edge Function secrets
2. **Email template:** Edit Edge Function code
3. **From address:** Verify domain in Resend, update function code

---

## 📚 Document Summaries

### EMAIL-NOTIFICATIONS-QUICKSTART.md
**Length:** 5 minutes  
**Purpose:** Get up and running fast  
**Contents:**
- 5-step setup process
- Quick troubleshooting
- Success verification
- Optional enhancements

**Best for:** First-time setup, quick reference

---

### EMAIL-NOTIFICATIONS-DEPLOYMENT-GUIDE.md
**Length:** 30 minutes  
**Purpose:** Comprehensive deployment guide  
**Contents:**
- Resend account setup
- Domain verification
- Edge Function deployment (CLI + Dashboard)
- Database webhook configuration
- Testing instructions
- Email template customization
- Monitoring and alerts
- Advanced features

**Best for:** Detailed setup, production deployment, reference documentation

---

### EMAIL-NOTIFICATIONS-SUMMARY.md
**Length:** 15 minutes  
**Purpose:** Technical overview and reference  
**Contents:**
- Architecture diagrams
- Data flow explanation
- File structure
- Configuration options
- Security details
- Cost analysis
- Enhancement ideas

**Best for:** Understanding the system, technical reference, troubleshooting

---

### EMAIL-NOTIFICATIONS-SETUP.sql
**Length:** 5 minutes  
**Purpose:** Database configuration  
**Contents:**
- Database trigger function
- Trigger creation
- Webhook alternative
- Verification queries
- Test scripts

**Best for:** Database administrators, manual setup, verification

---

### deploy-email-notifications.sh
**Length:** 2 minutes  
**Purpose:** Automated deployment  
**Contents:**
- CLI checks and installation
- Project linking
- Function deployment
- Environment variable setup
- Next steps

**Best for:** Command-line users, automated deployments, CI/CD

---

## 🛠 Key Components

### 1. Edge Function
**Location:** `/supabase/functions/notify-admin/index.ts`  
**Purpose:** Sends emails via Resend API  
**Trigger:** Database webhook on INSERT to `leads` table  
**Environment Variables:**
- `RESEND_API_KEY` - Resend API key
- `ADMIN_EMAIL` - Notification recipient

### 2. Database Webhook
**Location:** Supabase Dashboard → Database → Hooks  
**Purpose:** Triggers Edge Function on new lead  
**Configuration:**
- Table: `public.leads`
- Event: INSERT
- Method: POST
- URL: Edge Function endpoint

### 3. Email Service (Resend)
**Location:** External service (https://resend.com)  
**Purpose:** Email delivery  
**API:** RESTful API for sending emails  
**Free Tier:** 100 emails/day

---

## 📋 Checklists

### Pre-Deployment Checklist
- [ ] Resend account created
- [ ] Resend API key obtained
- [ ] Supabase CLI installed and logged in
- [ ] Project linked (`mlxsfhdzlcxtvqeshgjx`)
- [ ] Read QUICKSTART guide

### Deployment Checklist
- [ ] Edge Function deployed
- [ ] Environment variables set (`RESEND_API_KEY`, `ADMIN_EMAIL`)
- [ ] Database webhook created
- [ ] Webhook is enabled (green status)
- [ ] Test submission successful
- [ ] Email received

### Post-Deployment Checklist
- [ ] Domain verified in Resend (optional but recommended)
- [ ] SPF/DKIM records added (optional)
- [ ] Email template customized (optional)
- [ ] Multiple recipients added (if needed)
- [ ] Monitoring set up
- [ ] Documentation reviewed

---

## 🔗 External Resources

### Resend
- **Website:** https://resend.com
- **Documentation:** https://resend.com/docs
- **Dashboard:** https://resend.com/emails
- **API Keys:** https://resend.com/api-keys
- **Support:** support@resend.com

### Supabase
- **Dashboard:** https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx
- **Edge Functions:** https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/functions
- **Database Hooks:** https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/database/hooks
- **Function Logs:** https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/functions/notify-admin/logs
- **Documentation:** https://supabase.com/docs/guides/functions
- **Discord:** https://discord.supabase.com

---

## 🎓 Learning Path

### Beginner (Just want it to work)
1. Read: [QUICKSTART.md](/EMAIL-NOTIFICATIONS-QUICKSTART.md)
2. Follow 5 steps
3. Test it
4. Done!

### Intermediate (Want to understand and customize)
1. Read: [QUICKSTART.md](/EMAIL-NOTIFICATIONS-QUICKSTART.md)
2. Deploy using guide
3. Read: [SUMMARY.md](/EMAIL-NOTIFICATIONS-SUMMARY.md)
4. Review Edge Function code
5. Customize email template
6. Redeploy

### Advanced (Want to extend functionality)
1. Read: [DEPLOYMENT-GUIDE.md](/EMAIL-NOTIFICATIONS-DEPLOYMENT-GUIDE.md)
2. Read: [SUMMARY.md](/EMAIL-NOTIFICATIONS-SUMMARY.md)
3. Study Edge Function code
4. Implement enhancements:
   - Auto-reply to users
   - SMS notifications
   - Admin dashboard settings
   - Email templates with branding
5. Set up monitoring and alerts

---

## 💡 Common Questions

### Q: How do I change the email recipient?
**A:** Update `ADMIN_EMAIL` environment variable in Supabase Edge Function settings.

### Q: Can I add multiple recipients?
**A:** Yes - see [DEPLOYMENT-GUIDE.md → Advanced Configuration](/EMAIL-NOTIFICATIONS-DEPLOYMENT-GUIDE.md#add-multiple-recipients)

### Q: Why am I not receiving emails?
**A:** Check [QUICKSTART.md → Troubleshooting](/EMAIL-NOTIFICATIONS-QUICKSTART.md#not-working-quick-fixes)

### Q: How do I customize email templates?
**A:** Edit `/supabase/functions/notify-admin/index.ts` and redeploy.

### Q: Is this free?
**A:** Yes, within free tier limits (100 emails/day on Resend, 500k invocations/month on Supabase)

### Q: How do I verify my domain?
**A:** See [DEPLOYMENT-GUIDE.md → Domain Verification](/EMAIL-NOTIFICATIONS-DEPLOYMENT-GUIDE.md#step-2-verify-domain-in-resend-5-minutes)

### Q: Can I test without submitting a real form?
**A:** Yes - use SQL test in [QUICKSTART.md → Option B](/EMAIL-NOTIFICATIONS-QUICKSTART.md#option-b-sql-test-faster)

### Q: Where are the logs?
**A:** [Edge Function Logs](https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/functions/notify-admin/logs)

---

## 🔄 Update History

### Version 1.0 (Current)
- Initial implementation
- Contact and Booking form support
- Database webhook trigger
- Resend email integration
- Comprehensive documentation

### Planned Enhancements
- Auto-reply to users
- SMS notifications (Twilio)
- Admin dashboard email settings
- Branded email templates
- Email analytics dashboard

---

## 📞 Getting Help

### Documentation Issues
- All documentation is in this repository
- Check the appropriate guide based on your needs
- Use the index to find specific topics

### Technical Issues

**Edge Function not working:**
1. Check logs: [Function Logs](https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/functions/notify-admin/logs)
2. Verify environment variables are set
3. Check webhook is enabled
4. Review [DEPLOYMENT-GUIDE.md troubleshooting](/EMAIL-NOTIFICATIONS-DEPLOYMENT-GUIDE.md#troubleshooting)

**Email not delivered:**
1. Check spam folder
2. View Resend dashboard: https://resend.com/emails
3. Check Edge Function logs for errors
4. Verify domain (optional but helps deliverability)

**Deployment problems:**
1. Verify Supabase CLI installed: `supabase --version`
2. Check you're logged in: `supabase projects list`
3. Verify project is linked
4. Try manual deployment via dashboard

---

## ✨ Quick Reference

### Commands
```bash
# Deploy function
supabase functions deploy notify-admin --no-verify-jwt

# View logs
supabase functions logs notify-admin

# Set secret
supabase secrets set RESEND_API_KEY=re_xxx --project-ref mlxsfhdzlcxtvqeshgjx
```

### URLs
- **Resend Dashboard:** https://resend.com
- **Edge Functions:** https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/functions
- **Database Hooks:** https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/database/hooks
- **Function Logs:** https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/functions/notify-admin/logs

### Environment Variables
- `RESEND_API_KEY` - Resend API key (starts with `re_`)
- `ADMIN_EMAIL` - Email recipient (default: `cstlelivn@gmail.com`)

---

**Ready to get started? Head to [`QUICKSTART.md`](/EMAIL-NOTIFICATIONS-QUICKSTART.md) →**

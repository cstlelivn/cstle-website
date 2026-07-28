# 🚀 Deploy Email Notifications NOW

## ⚠️ CRITICAL: The function is running LOCALLY, not on Supabase servers!

The webhook cannot reach `http://localhost:9999/` - you need to deploy to Supabase.

---

## ✅ Option 1: Deploy via Supabase Dashboard (EASIEST - No CLI needed!)

### Step 1: Go to Edge Functions
https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/functions

### Step 2: Click "Create a new function"

### Step 3: Name it `notify-admin`

### Step 4: Copy and paste this code:

```typescript
/**
 * Sends email notifications when new leads are submitted.
 * Triggered automatically by database webhook.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    console.log('Received webhook payload:', payload);

    // Extract the record from webhook payload
    const record = payload.record || payload;
    
    const adminEmail = Deno.env.get("ADMIN_EMAIL") || "cstlelivn@gmail.com";
    const resendKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendKey) {
      throw new Error("RESEND_API_KEY environment variable not set");
    }

    // Determine form type from source_form field
    const formType = record.source_form || 'contact';
    const isBooking = formType === 'booking';

    // Build email content
    let subject: string;
    let htmlContent: string;
    let textContent: string;

    if (isBooking) {
      subject = `🔨 New Booking Request - Cstle Livn`;
      
      htmlContent = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #191919; margin-bottom: 24px; font-size: 24px;">New Booking Request</h2>
          
          <div style="background: #f1f1f1; border-radius: 8px; padding: 20px; margin-bottom: 16px;">
            <h3 style="margin-top: 0; color: #191919; font-size: 18px;">Personal Information</h3>
            <p style="margin: 8px 0;"><strong>Name:</strong> ${record.first_name || ''} ${record.last_name || ''}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${record.email}" style="color: #191919;">${record.email}</a></p>
            <p style="margin: 8px 0;"><strong>Phone:</strong> <a href="tel:${record.phone}" style="color: #191919;">${record.phone}</a></p>
          </div>
          
          <div style="background: #f1f1f1; border-radius: 8px; padding: 20px; margin-bottom: 16px;">
            <h3 style="margin-top: 0; color: #191919; font-size: 18px;">Project Details</h3>
            <p style="margin: 8px 0;"><strong>Service Type:</strong> ${record.project_type || record.service_type || 'Not specified'}</p>
            <p style="margin: 8px 0;"><strong>Project Address:</strong> ${record.project_address || 'Not provided'}</p>
            ${record.consultation_date ? `<p style="margin: 8px 0;"><strong>Preferred Date:</strong> ${new Date(record.consultation_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>` : ''}
            ${record.consultation_time ? `<p style="margin: 8px 0;"><strong>Preferred Time:</strong> ${record.consultation_time}</p>` : ''}
            <p style="margin: 8px 0;"><strong>Project Details:</strong></p>
            <p style="white-space: pre-wrap; background: white; padding: 12px; border-radius: 4px; margin: 8px 0;">${record.project_details || record.notes || 'No details provided'}</p>
          </div>
          
          <div style="background: #f9f9f9; border-left: 4px solid #191919; padding: 12px; margin: 20px 0;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              <strong>Submitted:</strong> ${new Date(record.created_at || new Date()).toLocaleString('en-US')}<br>
              <strong>Source:</strong> ${record.source_page || 'Book Service form'}
            </p>
          </div>

          <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #666; font-size: 13px; margin: 0;">
              View in Admin Dashboard: <a href="https://ream-oculus-12377734.figma.site/#/admin" style="color: #191919;">Admin Dashboard</a>
            </p>
          </div>
        </div>
      `;
      
      textContent = `
NEW BOOKING REQUEST

Personal Information:
Name: ${record.first_name || ''} ${record.last_name || ''}
Email: ${record.email}
Phone: ${record.phone}

Project Details:
Service Type: ${record.project_type || record.service_type || 'Not specified'}
Project Address: ${record.project_address || 'Not provided'}
${record.consultation_date ? `Preferred Date: ${new Date(record.consultation_date).toLocaleDateString()}` : ''}
${record.consultation_time ? `Preferred Time: ${record.consultation_time}` : ''}

Project Details:
${record.project_details || record.notes || 'No details provided'}

---
Submitted: ${new Date(record.created_at || new Date()).toLocaleString()}
Source: ${record.source_page || 'Book Service form'}

View in Admin Dashboard: https://ream-oculus-12377734.figma.site/#/admin
      `.trim();
      
    } else {
      // Contact form
      subject = `💬 New Contact Message - Cstle Livn`;
      
      htmlContent = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #191919; margin-bottom: 24px; font-size: 24px;">New Contact Message</h2>
          
          <div style="background: #f1f1f1; border-radius: 8px; padding: 20px; margin-bottom: 16px;">
            <h3 style="margin-top: 0; color: #191919; font-size: 18px;">Contact Information</h3>
            <p style="margin: 8px 0;"><strong>Name:</strong> ${record.name || `${record.first_name || ''} ${record.last_name || ''}`.trim() || 'Not provided'}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${record.email}" style="color: #191919;">${record.email}</a></p>
            ${record.phone ? `<p style="margin: 8px 0;"><strong>Phone:</strong> <a href="tel:${record.phone}" style="color: #191919;">${record.phone}</a></p>` : ''}
            ${record.project_type ? `<p style="margin: 8px 0;"><strong>Project Type:</strong> ${record.project_type}</p>` : ''}
          </div>
          
          <div style="background: #f1f1f1; border-radius: 8px; padding: 20px; margin-bottom: 16px;">
            <h3 style="margin-top: 0; color: #191919; font-size: 18px;">Message</h3>
            <p style="white-space: pre-wrap; background: white; padding: 12px; border-radius: 4px; margin: 8px 0;">${record.message || record.notes || 'No message provided'}</p>
          </div>
          
          <div style="background: #f9f9f9; border-left: 4px solid #191919; padding: 12px; margin: 20px 0;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              <strong>Submitted:</strong> ${new Date(record.created_at || new Date()).toLocaleString('en-US')}<br>
              <strong>Source:</strong> ${record.source_page || 'Contact form'}
            </p>
          </div>

          <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #666; font-size: 13px; margin: 0;">
              View in Admin Dashboard: <a href="https://ream-oculus-12377734.figma.site/#/admin" style="color: #191919;">Admin Dashboard</a>
            </p>
          </div>
        </div>
      `;
      
      textContent = `
NEW CONTACT MESSAGE

Contact Information:
Name: ${record.name || `${record.first_name || ''} ${record.last_name || ''}`.trim() || 'Not provided'}
Email: ${record.email}
${record.phone ? `Phone: ${record.phone}` : ''}
${record.project_type ? `Project Type: ${record.project_type}` : ''}

Message:
${record.message || record.notes || 'No message provided'}

---
Submitted: ${new Date(record.created_at || new Date()).toLocaleString()}
Source: ${record.source_page || 'Contact form'}

View in Admin Dashboard: https://ream-oculus-12377734.figma.site/#/admin
      `.trim();
    }

    // Send email via Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Cstle Livn Website <notifications@cstlelivn.ca>",
        to: [adminEmail],
        subject: subject,
        html: htmlContent,
        text: textContent,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('Resend API error:', errorText);
      throw new Error(`Resend API error: ${emailResponse.status} - ${errorText}`);
    }

    const emailData = await emailResponse.json();
    console.log('Email sent successfully:', emailData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Notification sent successfully",
        emailId: emailData.id 
      }), 
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error in notify-admin function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
```

### Step 5: Click "Deploy function"

### Step 6: Set Environment Variables

Go to: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/settings/functions

Click "Add new secret" and add:

1. **RESEND_API_KEY** = *(get this from your Resend dashboard → API Keys)*
2. **ADMIN_EMAIL** = `cstlelivn@gmail.com`

### Step 7: Verify Deployment

Function URL will be:
```
https://mlxsfhdzlcxtvqeshgjx.supabase.co/functions/v1/notify-admin
```

### Step 8: The webhook is ALREADY configured - just test it!

Run this SQL test:
https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/sql/new

```sql
INSERT INTO public.leads (
  source_form, source_page, name, email, phone,
  project_type, message, status
) VALUES (
  'contact', '/contact', 'DEPLOYED TEST', 'deployed@example.com',
  '306-777-7777', 'Baseboards', 'Testing after dashboard deployment!', 'new'
);
```

**Check your email: cstlelivn@gmail.com** 🎉

---

## ❌ Can't Use Dashboard? Try Option 2: CLI Deployment

### Prerequisites
Install Supabase CLI:

**Mac:**
```bash
brew install supabase/tap/supabase
```

**Windows:**
```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**Linux/NPM:**
```bash
npm install -g supabase
```

### Deploy Steps

```bash
# 1. Login
supabase login

# 2. Link project
supabase link --project-ref mlxsfhdzlcxtvqeshgjx

# 3. Deploy function
supabase functions deploy notify-admin --no-verify-jwt

# 4. Set secrets
supabase secrets set RESEND_API_KEY=your_resend_api_key_here
supabase secrets set ADMIN_EMAIL=cstlelivn@gmail.com
```

---

## ✅ After Deployment

Your function will be live at:
```
https://mlxsfhdzlcxtvqeshgjx.supabase.co/functions/v1/notify-admin
```

The webhook is already configured - it will automatically send emails when forms are submitted!

---

## 🧪 Test It

### SQL Test:
```sql
INSERT INTO public.leads (
  source_form, source_page, name, email, phone,
  project_type, message, status
) VALUES (
  'contact', '/contact', 'Final Test', 'test@example.com',
  '306-999-9999', 'Baseboards', 'This should trigger an email!', 'new'
);
```

### Check:
1. ✅ Function logs: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/functions/notify-admin/logs
2. ✅ Your email: cstlelivn@gmail.com
3. ✅ Webhook logs: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/database/hooks

---

## 🎯 You should see:
- Function logs: "Received webhook payload..."
- Function logs: "Email sent successfully..."
- Email in your inbox within 5 seconds!

🚀 **GO DEPLOY IT NOW!**

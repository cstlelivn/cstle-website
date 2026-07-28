/**
 * ==========================================
 * SUPABASE EDGE FUNCTION: notify-admin
 * ==========================================
 * 
 * Sends email notifications when new leads are submitted.
 * Triggered automatically by database webhook.
 * 
 * DEPLOYMENT INSTRUCTIONS:
 * 
 * 1. Deploy this function:
 *    supabase functions deploy notify-admin --no-verify-jwt
 * 
 * 2. Set environment variables in Supabase Dashboard:
 *    Settings → Edge Functions → Secrets:
 *    - RESEND_API_KEY=re_xxxxxxxxxx
 *    - ADMIN_EMAIL=cstlelivn@gmail.com
 * 
 * 3. Create database webhook:
 *    See /EMAIL-NOTIFICATIONS-SETUP.sql
 * 
 * ==========================================
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
              View in Admin Dashboard: <a href="https://admin.cstlelivn.ca/" style="color: #191919;">https://admin.cstlelivn.ca/</a>
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

View in Admin Dashboard: https://admin.cstlelivn.ca/
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
              View in Admin Dashboard: <a href="https://admin.cstlelivn.ca/" style="color: #191919;">https://admin.cstlelivn.ca/</a>
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

View in Admin Dashboard: https://admin.cstlelivn.ca/
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

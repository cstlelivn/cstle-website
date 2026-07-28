/**
 * ==========================================
 * SUPABASE EDGE FUNCTION: notify-admin
 * ==========================================
 * 
 * DEPLOYMENT INSTRUCTIONS:
 * 
 * 1. Install Supabase CLI:
 *    npm install -g supabase
 * 
 * 2. Login to Supabase:
 *    supabase login
 * 
 * 3. Link to your project:
 *    supabase link --project-ref mlxsfhdzlcxtvqeshgjx
 * 
 * 4. Create the function directory:
 *    mkdir -p supabase/functions/notify-admin
 * 
 * 5. Copy this file to:
 *    supabase/functions/notify-admin/index.ts
 * 
 * 6. Deploy the function:
 *    supabase functions deploy notify-admin
 * 
 * 7. Set environment variables in Supabase Dashboard:
 *    Project Settings → Edge Functions → Environment Variables:
 *    - ADMIN_NOTIFY_EMAIL=info@cstlelivn.ca
 *    - RESEND_API_KEY=your_resend_api_key_here
 * 
 * 8. Get your Resend API key from:
 *    https://resend.com/api-keys
 * 
 * ==========================================
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const body = await req.json();
    // body structure: { type: 'contact'|'booking', payload: {...}, to?: string }
    
    const adminEmail = body.to ?? Deno.env.get("ADMIN_NOTIFY_EMAIL") ?? "info@cstlelivn.ca";
    const resendKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendKey) {
      throw new Error("RESEND_API_KEY not configured in edge function environment");
    }

    // Determine subject and format email content
    let subject = "New Form Submission - Cstle Livn";
    let htmlContent = "";
    let textContent = "";

    if (body.type === "booking") {
      subject = "🔨 New Booking Request - Cstle Livn";
      const p = body.payload;
      
      htmlContent = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #191919; margin-bottom: 24px;">New Booking Request</h2>
          
          <div style="background: #f1f1f1; border-radius: 8px; padding: 20px; margin-bottom: 16px;">
            <h3 style="margin-top: 0; color: #191919;">Personal Information</h3>
            <p><strong>Name:</strong> ${p.first_name || ''} ${p.last_name || ''}</p>
            <p><strong>Email:</strong> <a href="mailto:${p.email}">${p.email}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${p.phone}">${p.phone}</a></p>
          </div>
          
          <div style="background: #f1f1f1; border-radius: 8px; padding: 20px; margin-bottom: 16px;">
            <h3 style="margin-top: 0; color: #191919;">Project Details</h3>
            <p><strong>Service Type:</strong> ${p.service_type || 'Not specified'}</p>
            <p><strong>Project Address:</strong> ${p.project_address || 'Not provided'}</p>
            <p><strong>Preferred Date:</strong> ${p.preferred_date ? new Date(p.preferred_date).toLocaleDateString() : 'Not specified'}</p>
            <p><strong>Project Details:</strong></p>
            <p style="white-space: pre-wrap;">${p.project_details || 'No details provided'}</p>
          </div>
          
          <p style="color: #666; font-size: 12px;">Submitted via Book a Service form at ${new Date().toLocaleString()}</p>
        </div>
      `;
      
      textContent = `
NEW BOOKING REQUEST

Personal Information:
Name: ${p.first_name || ''} ${p.last_name || ''}
Email: ${p.email}
Phone: ${p.phone}

Project Details:
Service Type: ${p.service_type || 'Not specified'}
Project Address: ${p.project_address || 'Not provided'}
Preferred Date: ${p.preferred_date ? new Date(p.preferred_date).toLocaleDateString() : 'Not specified'}

Project Details:
${p.project_details || 'No details provided'}

---
Submitted via Book a Service form at ${new Date().toLocaleString()}
      `.trim();
      
    } else if (body.type === "contact") {
      subject = "💬 New Contact Message - Cstle Livn";
      const p = body.payload;
      
      htmlContent = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #191919; margin-bottom: 24px;">New Contact Message</h2>
          
          <div style="background: #f1f1f1; border-radius: 8px; padding: 20px; margin-bottom: 16px;">
            <h3 style="margin-top: 0; color: #191919;">Contact Information</h3>
            <p><strong>Name:</strong> ${p.name || 'Not provided'}</p>
            <p><strong>Email:</strong> <a href="mailto:${p.email}">${p.email}</a></p>
            ${p.phone ? `<p><strong>Phone:</strong> <a href="tel:${p.phone}">${p.phone}</a></p>` : ''}
            ${p.project_type ? `<p><strong>Project Type:</strong> ${p.project_type}</p>` : ''}
          </div>
          
          <div style="background: #f1f1f1; border-radius: 8px; padding: 20px; margin-bottom: 16px;">
            <h3 style="margin-top: 0; color: #191919;">Message</h3>
            <p style="white-space: pre-wrap;">${p.message || 'No message provided'}</p>
          </div>
          
          <p style="color: #666; font-size: 12px;">Submitted via Contact form at ${new Date().toLocaleString()}</p>
        </div>
      `;
      
      textContent = `
NEW CONTACT MESSAGE

Contact Information:
Name: ${p.name || 'Not provided'}
Email: ${p.email}
${p.phone ? `Phone: ${p.phone}` : ''}
${p.project_type ? `Project Type: ${p.project_type}` : ''}

Message:
${p.message || 'No message provided'}

---
Submitted via Contact form at ${new Date().toLocaleString()}
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
        from: "Cstle Livn <noreply@cstlelivn.ca>",
        to: [adminEmail],
        subject: subject,
        html: htmlContent,
        text: textContent,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      throw new Error(`Resend API error: ${errorText}`);
    }

    const emailData = await emailResponse.json();

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Notification sent successfully",
        emailId: emailData.id 
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
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
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});

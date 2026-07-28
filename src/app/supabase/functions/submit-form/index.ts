// ==========================================
// ALTERNATIVE SOLUTION: Edge Function for Form Submission
// ==========================================
// This bypasses RLS by using service_role key
// Deploy this to Supabase Edge Functions if RLS policies keep failing
// ==========================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client with SERVICE ROLE (bypasses RLS)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Parse request body
    const { formType, data } = await req.json()

    let result;

    if (formType === 'contact') {
      // Insert contact request
      const { data: insertData, error } = await supabaseAdmin
        .from('contact_requests')
        .insert([{
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          project_type: data.project_type || null,
          message: data.message,
          source_page: data.source_page || '/contact'
        }])
        .select()

      if (error) throw error
      result = insertData

    } else if (formType === 'booking') {
      // Insert booking request
      const { data: insertData, error } = await supabaseAdmin
        .from('bookings')
        .insert([{
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
          project_address: data.project_address,
          preferred_date: data.preferred_date || null,
          service_type: data.service_type,
          project_details: data.project_details,
          source_page: data.source_page || '/book'
        }])
        .select()

      if (error) throw error
      result = insertData

    } else {
      throw new Error('Invalid form type')
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})

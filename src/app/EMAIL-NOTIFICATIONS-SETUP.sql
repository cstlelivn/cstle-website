-- ==========================================
-- EMAIL NOTIFICATIONS SETUP
-- ==========================================
-- 
-- This SQL script sets up automatic email notifications
-- for Contact and Booking form submissions.
--
-- How it works:
-- 1. Database trigger fires when new row inserted into `leads` table
-- 2. Trigger calls Supabase Edge Function via HTTP webhook
-- 3. Edge Function sends email via Resend API
-- 4. No CORS issues (server-side only)
-- 5. No frontend changes needed
--
-- ==========================================

-- Step 1: Create the trigger function
CREATE OR REPLACE FUNCTION notify_admin_on_new_lead()
RETURNS TRIGGER AS $$
DECLARE
  function_url TEXT;
  webhook_secret TEXT;
BEGIN
  -- Get the Edge Function URL (replace with your project ID)
  function_url := 'https://mlxsfhdzlcxtvqeshgjx.supabase.co/functions/v1/notify-admin';
  
  -- Call the Edge Function asynchronously using pg_net extension
  -- If pg_net is not available, use supabase_functions.http_request
  PERFORM net.http_post(
    url := function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := jsonb_build_object(
      'type', 'webhook',
      'table', TG_TABLE_NAME,
      'record', row_to_json(NEW),
      'old_record', row_to_json(OLD)
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Create the trigger on leads table
DROP TRIGGER IF EXISTS on_lead_created ON public.leads;

CREATE TRIGGER on_lead_created
  AFTER INSERT ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION notify_admin_on_new_lead();

-- Step 3: Grant necessary permissions
GRANT USAGE ON SCHEMA net TO postgres, anon, authenticated, service_role;

-- ==========================================
-- ALTERNATIVE: Using Database Webhooks (Recommended)
-- ==========================================
-- 
-- If the trigger method doesn't work, use Supabase Database Webhooks instead.
-- This is easier and more reliable.
--
-- Manual Setup via Supabase Dashboard:
--
-- 1. Go to: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/database/hooks
-- 2. Click "Create a new hook"
-- 3. Choose "Database Webhook"
-- 4. Configure:
--    - Name: "Notify Admin on New Lead"
--    - Table: public.leads
--    - Events: INSERT
--    - Type: Webhook
--    - Method: POST
--    - URL: https://mlxsfhdzlcxtvqeshgjx.supabase.co/functions/v1/notify-admin
--    - HTTP Headers:
--        Authorization: Bearer [YOUR_SERVICE_ROLE_KEY]
--        Content-Type: application/json
-- 5. Click "Create webhook"
--
-- That's it! Every new lead will trigger an email automatically.
--
-- ==========================================

-- ==========================================
-- VERIFICATION QUERY
-- ==========================================
-- Run this to check if the trigger exists:

SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_lead_created';

-- ==========================================
-- TEST THE SETUP
-- ==========================================
-- Insert a test record to verify email is sent:

-- INSERT INTO public.leads (
--   source_form,
--   source_page,
--   name,
--   email,
--   phone,
--   project_type,
--   message,
--   status
-- ) VALUES (
--   'contact',
--   '/contact',
--   'Test User',
--   'test@example.com',
--   '555-1234',
--   'Baseboards',
--   'This is a test message to verify email notifications work.',
--   'new'
-- );

-- Check if email was sent by viewing Edge Function logs:
-- https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/functions/notify-admin/logs

-- ==========================================
-- TROUBLESHOOTING
-- ==========================================
-- 
-- If emails aren't sending:
--
-- 1. Check Edge Function is deployed:
--    supabase functions list
--
-- 2. Check environment variables are set:
--    Settings → Edge Functions → Secrets
--    - RESEND_API_KEY
--    - ADMIN_EMAIL
--
-- 3. Check Edge Function logs for errors:
--    https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/functions/notify-admin/logs
--
-- 4. Verify Resend API key is valid:
--    https://resend.com/api-keys
--
-- 5. Check Database Webhook status:
--    https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/database/hooks
--
-- ==========================================

#!/bin/bash

# ==========================================
# EMAIL NOTIFICATIONS DEPLOYMENT SCRIPT
# ==========================================
# 
# This script deploys the email notification system
# for Cstle Livn website form submissions.
#
# Prerequisites:
# 1. Supabase CLI installed (npm install -g supabase)
# 2. Logged in to Supabase (supabase login)
# 3. Resend API key obtained
#
# ==========================================

echo "🚀 Deploying Email Notifications for Cstle Livn"
echo "================================================"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found"
    echo "📦 Installing Supabase CLI..."
    npm install -g supabase
fi

echo "✅ Supabase CLI found"
echo ""

# Check if logged in
echo "🔐 Checking Supabase authentication..."
if ! supabase projects list &> /dev/null; then
    echo "❌ Not logged in to Supabase"
    echo "🔑 Please run: supabase login"
    exit 1
fi

echo "✅ Authenticated"
echo ""

# Link project
echo "🔗 Linking to project mlxsfhdzlcxtvqeshgjx..."
supabase link --project-ref mlxsfhdzlcxtvqeshgjx

if [ $? -ne 0 ]; then
    echo "❌ Failed to link project"
    exit 1
fi

echo "✅ Project linked"
echo ""

# Deploy Edge Function
echo "📤 Deploying notify-admin Edge Function..."
supabase functions deploy notify-admin --no-verify-jwt

if [ $? -ne 0 ]; then
    echo "❌ Failed to deploy Edge Function"
    exit 1
fi

echo "✅ Edge Function deployed"
echo ""

# Set environment variables
echo "⚙️  Setting environment variables..."
echo ""
echo "Please enter your Resend API key (starts with 're_'):"
read -r RESEND_API_KEY

echo "Please enter admin email (default: cstlelivn@gmail.com):"
read -r ADMIN_EMAIL
ADMIN_EMAIL=${ADMIN_EMAIL:-cstlelivn@gmail.com}

supabase secrets set RESEND_API_KEY="$RESEND_API_KEY" --project-ref mlxsfhdzlcxtvqeshgjx
supabase secrets set ADMIN_EMAIL="$ADMIN_EMAIL" --project-ref mlxsfhdzlcxtvqeshgjx

if [ $? -ne 0 ]; then
    echo "⚠️  Environment variables may not have been set correctly"
    echo "💡 You can set them manually in Supabase Dashboard:"
    echo "   https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/settings/functions"
else
    echo "✅ Environment variables set"
fi

echo ""
echo "================================================"
echo "🎉 Deployment Complete!"
echo "================================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Create Database Webhook:"
echo "   https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/database/hooks"
echo ""
echo "   Configuration:"
echo "   - Name: Notify Admin on New Lead"
echo "   - Table: public.leads"
echo "   - Events: INSERT"
echo "   - Method: POST"
echo "   - URL: https://mlxsfhdzlcxtvqeshgjx.supabase.co/functions/v1/notify-admin"
echo ""
echo "2. Test the system:"
echo "   - Submit a form on your website"
echo "   - Check email: $ADMIN_EMAIL"
echo ""
echo "3. View logs:"
echo "   https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/functions/notify-admin/logs"
echo ""
echo "📚 Full guide: /EMAIL-NOTIFICATIONS-DEPLOYMENT-GUIDE.md"
echo ""

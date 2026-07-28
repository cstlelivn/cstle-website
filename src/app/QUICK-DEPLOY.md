# Quick Deploy Commands

## Prerequisites
```bash
# Install Supabase CLI (choose one)
brew install supabase/tap/supabase  # Mac/Linux
scoop install supabase              # Windows
```

## Deploy Steps

### 1. Login
```bash
supabase login
```

### 2. Link Project
```bash
supabase link --project-ref mlxsfhdzlcxtvqeshgjx
```

### 3. Deploy Edge Function
```bash
supabase functions deploy make-server-6e189709 --no-verify-jwt
```

### 4. Create Admin Account
Navigate to: **`/#/admin-setup`** in your browser

Or use browser console:
```javascript
fetch('https://mlxsfhdzlcxtvqeshgjx.supabase.co/functions/v1/make-server-6e189709/admin/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1seHNmaGR6bGN4dHZxZXNoZ2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NTIyOTEsImV4cCI6MjA3NjIyODI5MX0.ZC_CemlkjJgbPkVDCLOagfLkRDAKwKyLBkt9sA_gSvU'
  },
  body: JSON.stringify({
    email: 'your-email@example.com',
    password: 'your-password',
    name: 'Your Name'
  })
}).then(res => res.json()).then(data => console.log(data));
```

## Test It Works

1. Submit test form: `/#/contact`
2. Login to admin: `/#/admin`
3. Check leads tab for submission

## Done! ✅

Your website is now fully connected to Supabase with:
- ✅ Contact form saving leads
- ✅ Booking form saving leads
- ✅ Admin panel for managing everything
- ✅ Gallery image uploads
- ✅ Reviews management
- ✅ FAQs management
- ✅ Site info management

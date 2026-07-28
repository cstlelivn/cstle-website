# ✅ Admin App Integration Complete

## Overview

Both Contact and BookService forms now send all fields to Supabase `public.leads` table with proper tagging for Admin app visibility and filtering.

---

## Fields Sent to Database

### Contact Form Payload

```json
{
  "source_form": "contact",
  "source_page": "/contact",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "306-371-5817",
  "project_type": "Custom Woodwork",
  "message": "I need custom trim work...",
  "notes": "I need custom trim work...",
  "links": null,
  "status": "new"
}
```

**Field Breakdown:**
- `source_form`: `"contact"` - Identifies form type for admin filtering
- `source_page`: Current route path (e.g., `/contact`, `/#/contact`)
- `name`: Full name from single input field
- `email`: Email address
- `phone`: Phone number (optional, can be null)
- `project_type`: Type of project from dropdown/input
- `message`: User's message
- `notes`: Duplicate of `message` for admin app convenience
- `links`: Reserved for future use (attachments, URLs)
- `status`: `"new"` - Default status for unprocessed leads

---

### BookService Form Payload

```json
{
  "source_form": "booking",
  "source_page": "/book",
  "first_name": "Jane",
  "last_name": "Smith",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "306-123-4567",
  "project_address": "123 Main St, Regina SK",
  "service_type": "Interior Painting",
  "project_type": "Interior Painting",
  "consultation_date": "2025-11-15T00:00:00.000Z",
  "consultation_time": "14:30",
  "project_details": "Need 3 rooms painted...",
  "notes": "Need 3 rooms painted...",
  "links": null,
  "status": "new"
}
```

**Field Breakdown:**
- `source_form`: `"booking"` - Identifies form type for admin filtering
- `source_page`: Current route path (e.g., `/book`, `/#/book`)
- `first_name`: First name
- `last_name`: Last name
- `name`: `firstName + " " + lastName` - Concatenated to satisfy NOT NULL constraint
- `email`: Email address
- `phone`: Phone number (required)
- `project_address`: Project location
- `service_type`: Service type (for admin app compatibility)
- `project_type`: Service type (database schema field)
- `consultation_date`: Preferred date in ISO format (can be null)
- `consultation_time`: Preferred time in HH:MM format (can be empty string)
- `project_details`: Detailed description of project
- `notes`: Duplicate of `project_details` for admin app convenience
- `links`: Reserved for future use
- `status`: `"new"` - Default status

---

## Admin App Integration

### Filtering by Form Type

The `source_form` field allows admin app to filter submissions:

```typescript
// Get all contact form submissions
const { data: contactLeads } = await supabase
  .from('leads')
  .select('*')
  .eq('source_form', 'contact')
  .order('created_at', { ascending: false });

// Get all booking form submissions
const { data: bookingLeads } = await supabase
  .from('leads')
  .select('*')
  .eq('source_form', 'booking')
  .order('created_at', { ascending: false });
```

### Displaying in Admin App

**Recommended Admin UI Structure:**

1. **Tabs/Filters:**
   - All Leads
   - Contact Requests (`source_form = 'contact'`)
   - Booking Requests (`source_form = 'booking'`)

2. **Table Columns:**
   - Date/Time (`created_at`)
   - Type (`source_form`)
   - Name
   - Email
   - Phone
   - Status
   - Actions (View, Update Status, Delete)

3. **Detail View:**
   - Contact Form shows: `message`, `project_type`
   - Booking Form shows: `project_details`, `service_type`, `consultation_date`, `project_address`

---

## Database Schema Requirements

### `public.leads` Table

Must have these columns to accept all fields:

```sql
CREATE TABLE public.leads (
  id BIGSERIAL PRIMARY KEY,
  
  -- Form identification
  source_form TEXT,              -- "contact" or "booking"
  source_page TEXT,              -- Route path
  
  -- Personal info
  name TEXT NOT NULL,            -- Full name (required!)
  first_name TEXT,               -- From booking form
  last_name TEXT,                -- From booking form
  email TEXT NOT NULL,           -- Email (required!)
  phone TEXT,                    -- Phone number
  
  -- Project info
  project_type TEXT,             -- Database field (both forms)
  service_type TEXT,             -- Admin app field (booking only)
  project_address TEXT,          -- Booking only
  consultation_date TIMESTAMPTZ, -- Booking only
  consultation_time TEXT,        -- Booking only
  
  -- Messages/notes
  message TEXT,                  -- Contact form
  project_details TEXT,          -- Booking form
  notes TEXT,                    -- Duplicates message/project_details
  
  -- Future features
  links TEXT,                    -- Reserved for attachments/URLs
  
  -- Status tracking
  status TEXT DEFAULT 'new',     -- Lead status
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Required RLS Policy

```sql
-- Allow anonymous inserts (website form submissions)
CREATE POLICY "leads_insert_web"
ON public.leads
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow authenticated reads (admin app)
CREATE POLICY "leads_select_authenticated"
ON public.leads
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated updates (admin app)
CREATE POLICY "leads_update_authenticated"
ON public.leads
FOR UPDATE
TO authenticated
USING (true);
```

---

## Success Criteria ✅

### Contact Form
- [x] Sends `source_form: "contact"`
- [x] Sends `source_page` (current path)
- [x] Sends all user input fields
- [x] Duplicates `message` → `notes`
- [x] Sets `links: null`
- [x] Sets `status: "new"`
- [x] HTTP 201 response on success

### BookService Form
- [x] Sends `source_form: "booking"`
- [x] Sends `source_page` (current path)
- [x] Sends all user input fields
- [x] Concatenates `name` from `firstName + lastName`
- [x] Sends both `service_type` AND `project_type`
- [x] Sends `consultation_date` in ISO format
- [x] Sends `consultation_time` in HH:MM format
- [x] Duplicates `project_details` → `notes`
- [x] Sets `links: null`
- [x] Sets `status: "new"`
- [x] HTTP 201 response on success

---

## Admin App Query Examples

### Get All New Leads
```typescript
const { data: newLeads } = await supabase
  .from('leads')
  .select('*')
  .eq('status', 'new')
  .order('created_at', { ascending: false });
```

### Get Leads by Type
```typescript
// Contact form submissions
const { data: contacts } = await supabase
  .from('leads')
  .select('name, email, phone, message, project_type, created_at')
  .eq('source_form', 'contact')
  .order('created_at', { ascending: false });

// Booking form submissions
const { data: bookings } = await supabase
  .from('leads')
  .select(`
    first_name, 
    last_name, 
    email, 
    phone, 
    project_address, 
    service_type, 
    consultation_date, 
    consultation_time,
    project_details, 
    created_at
  `)
  .eq('source_form', 'booking')
  .order('created_at', { ascending: false });
```

### Update Lead Status
```typescript
const { error } = await supabase
  .from('leads')
  .update({ status: 'contacted' })
  .eq('id', leadId);
```

### Realtime Subscription (Live Updates)
```typescript
const subscription = supabase
  .channel('leads-channel')
  .on(
    'postgres_changes',
    { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'leads' 
    },
    (payload) => {
      console.log('New lead received:', payload.new);
      // Update UI with new lead
      // Show toast notification
      // Play notification sound
    }
  )
  .subscribe();
```

---

## Testing Checklist

### Contact Form Test
1. Go to Contact page
2. Fill out form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Phone: "306-123-4567"
   - Project Type: "General Inquiry"
   - Message: "This is a test submission"
3. Submit form
4. Check Supabase dashboard → `leads` table
5. Verify row contains:
   - `source_form: "contact"`
   - `source_page: "/contact"` (or `"/#/contact"`)
   - `notes: "This is a test submission"` (duplicate of message)
   - `links: null`
   - `status: "new"`

### BookService Form Test
1. Go to BookService page
2. Fill out form:
   - First Name: "Jane"
   - Last Name: "Doe"
   - Email: "jane@example.com"
   - Phone: "306-987-6543"
   - Project Address: "123 Test St"
   - Service Type: "Interior Painting"
   - Consultation Date: Select a future date
   - Consultation Time: "14:30"
   - Project Details: "Test booking submission"
3. Submit form
4. Check Supabase dashboard → `leads` table
5. Verify row contains:
   - `source_form: "booking"`
   - `source_page: "/book"` (or `"/#/book"`)
   - `name: "Jane Doe"` (concatenated)
   - `service_type: "Interior Painting"`
   - `project_type: "Interior Painting"`
   - `consultation_date: "2025-XX-XXT00:00:00.000Z"`
   - `consultation_time: "14:30"`
   - `notes: "Test booking submission"` (duplicate of project_details)
   - `links: null`
   - `status: "new"`

---

## Troubleshooting

### Error: Column "source_form" does not exist
**Solution:** Add the column to `leads` table:
```sql
ALTER TABLE public.leads ADD COLUMN source_form TEXT;
```

### Error: Column "service_type" does not exist
**Solution:** Add the column to `leads` table:
```sql
ALTER TABLE public.leads ADD COLUMN service_type TEXT;
```

### Error: Column "consultation_date" does not exist
**Solution:** Add the column to `leads` table:
```sql
ALTER TABLE public.leads ADD COLUMN consultation_date TIMESTAMPTZ;
```

### Error: Column "consultation_time" does not exist
**Solution:** Add the column to `leads` table:
```sql
ALTER TABLE public.leads ADD COLUMN consultation_time TEXT;
```

### Error: Column "notes" does not exist
**Solution:** Add the column to `leads` table:
```sql
ALTER TABLE public.leads ADD COLUMN notes TEXT;
```

### Error: Column "links" does not exist
**Solution:** Add the column to `leads` table:
```sql
ALTER TABLE public.leads ADD COLUMN links TEXT;
```

### Admin App Can't See Leads
**Solution:** Check RLS policies allow authenticated users to SELECT:
```sql
CREATE POLICY "leads_select_authenticated"
ON public.leads
FOR SELECT
TO authenticated
USING (true);
```

---

## Migration Script

If your database doesn't have all the new columns, run this migration:

```sql
-- Add new columns to leads table
ALTER TABLE public.leads 
  ADD COLUMN IF NOT EXISTS source_form TEXT,
  ADD COLUMN IF NOT EXISTS service_type TEXT,
  ADD COLUMN IF NOT EXISTS consultation_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS consultation_time TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS links TEXT;

-- Update existing rows with default values
UPDATE public.leads 
SET source_form = CASE 
  WHEN source_page LIKE '%contact%' THEN 'contact'
  WHEN source_page LIKE '%book%' THEN 'booking'
  ELSE 'contact'
END
WHERE source_form IS NULL;

-- Duplicate existing data to notes field
UPDATE public.leads 
SET notes = COALESCE(message, project_details)
WHERE notes IS NULL;

-- Copy project_type to service_type for booking forms
UPDATE public.leads 
SET service_type = project_type
WHERE source_form = 'booking' AND service_type IS NULL;
```

---

## Summary

✅ **Contact Form** - Sends 10 fields including `source_form`, `notes`, `links`  
✅ **BookService Form** - Sends 15 fields including `source_form`, `service_type`, `consultation_date`, `consultation_time`, `notes`, `links`  
✅ **Admin App Compatible** - Can filter by `source_form` ("contact" vs "booking")  
✅ **Database Ready** - All fields mapped to `public.leads` table  
✅ **Future-Proof** - `links` field reserved for attachments/URLs  
✅ **Notes Field** - Duplicates message/project_details for admin convenience  

**Both forms are now fully integrated with the Admin app!** 🎉

The Admin app at `https://ream-oculus-12377734.figma.site/` can now:
- View all leads from both forms
- Filter by form type (`source_form`)
- See all submitted data including notes
- Update lead status
- Receive realtime updates for new submissions
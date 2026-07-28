# 📋 Leads Table Column Mapping Reference

## Database Schema: `public.leads`

All form submissions (Contact, BookService, Reviews) go into **one table**: `public.leads`

### Table Columns

| Column Name | Type | Description | Used By |
|-------------|------|-------------|---------|
| `id` | bigint | Auto-increment primary key | All |
| `first_name` | text | First name | BookService |
| `last_name` | text | Last name | BookService |
| `name` | text | Full name (single field) | Contact |
| `email` | text | Email address | All |
| `phone` | text | Phone number | All |
| `project_type` | text | Type of project/service | **All forms** |
| `project_address` | text | Project location | BookService |
| `project_details` | text | Detailed description | BookService |
| `message` | text | General message | Contact |
| `source_page` | text | Which form submitted (`/contact`, `/book`) | All |
| `status` | text | Lead status (default: `new`) | All |
| `created_at` | timestamptz | Submission timestamp | All |

---

## Form Field Mapping

### Contact Form (`/pages/Contact.tsx`)

**Frontend Form Fields:**
```tsx
formData = {
  name: string,           // Full name
  email: string,          // Email
  phone: string,          // Phone
  projectType: string,    // Project type dropdown
  message: string,        // Message textarea
  company: string         // Honeypot (hidden)
}
```

**Maps to Database:**
```javascript
{
  name: formData.name,                    → leads.name
  email: formData.email,                  → leads.email
  phone: formData.phone || null,          → leads.phone
  project_type: formData.projectType,     → leads.project_type ✅
  message: formData.message,              → leads.message
  source_page: "/contact",                → leads.source_page
  status: "new"                           → leads.status
}
```

---

### BookService Form (`/pages/BookService.tsx`)

**Frontend Form Fields:**
```tsx
formData = {
  firstName: string,      // First name
  lastName: string,       // Last name
  email: string,          // Email
  phone: string,          // Phone
  address: string,        // Project address
  serviceType: string,    // Service type dropdown
  projectDetails: string, // Project details textarea
  company: string         // Honeypot (hidden)
}

date: Date | undefined    // Preferred consultation date
```

**Maps to Database:**
```javascript
{
  name: `${formData.firstName} ${formData.lastName}`, → leads.name (concatenated)
  first_name: formData.firstName,         → leads.first_name
  last_name: formData.lastName,           → leads.last_name
  email: formData.email,                  → leads.email
  phone: formData.phone,                  → leads.phone
  project_address: formData.address,      → leads.project_address
  project_type: formData.serviceType,     → leads.project_type ✅ (NOT service_type!)
  project_details: formData.projectDetails, → leads.project_details
  source_page: "/book",                   → leads.source_page
  status: "new"                           → leads.status
}
```

**⚠️ IMPORTANT:** 
- `serviceType` maps to `project_type` column, **NOT** `service_type`!
- `name` is concatenated from `firstName` and `lastName` to satisfy NOT NULL constraint

---

## Common Mistakes

### ❌ Wrong Column Name
```javascript
// WRONG - Column doesn't exist!
{
  service_type: formData.serviceType  // ❌ Error: Column not found
}
```

### ✅ Correct Column Name
```javascript
// CORRECT - Maps to existing column
{
  project_type: formData.serviceType  // ✅ Works!
}
```

---

## Why One Column Name?

Both forms use **`project_type`** instead of separate columns because:

1. **Consistency** - Same field name across all forms
2. **Simplicity** - One column to query/filter
3. **Admin UX** - Easier to display in admin dashboard
4. **Future-proof** - Can add more form types without schema changes

### Example Values in `project_type`:

**From Contact Form:**
- "General Inquiry"
- "Custom Woodwork"
- "Full Renovation"
- etc.

**From BookService Form:**
- "Finishing Installation"
- "Interior Painting"
- "Trim & Molding"
- "Cabinet Installation"
- etc.

---

## Querying Leads

### Get All Leads
```sql
SELECT * FROM public.leads 
ORDER BY created_at DESC;
```

### Get Contact Form Submissions Only
```sql
SELECT * FROM public.leads 
WHERE source_page = '/contact'
ORDER BY created_at DESC;
```

### Get BookService Form Submissions Only
```sql
SELECT * FROM public.leads 
WHERE source_page = '/book'
ORDER BY created_at DESC;
```

### Filter by Project Type
```sql
SELECT * FROM public.leads 
WHERE project_type = 'Interior Painting'
ORDER BY created_at DESC;
```

### Get New (Unprocessed) Leads
```sql
SELECT * FROM public.leads 
WHERE status = 'new'
ORDER BY created_at DESC;
```

---

## Admin App Integration

Your admin app should:

1. **Read from `public.leads`** table
2. **Display all columns** in a table view
3. **Filter by `source_page`** to separate Contact vs BookService
4. **Update `status`** field when processed (new → contacted → closed)
5. **Use Realtime subscription** for live updates

### Example Admin Query

```typescript
// Fetch all leads with realtime updates
const { data: leads, error } = await supabase
  .from('leads')
  .select('*')
  .order('created_at', { ascending: false });

// Subscribe to new leads
const subscription = supabase
  .channel('leads-channel')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'leads' },
    (payload) => {
      console.log('New lead:', payload.new);
      // Update UI with new lead
    }
  )
  .subscribe();
```

---

## Testing Column Mapping

### Test Contact Form
```javascript
// Should succeed with status 201
fetch("https://mlxsfhdzlcxtvqeshgjx.supabase.co/rest/v1/leads", {
  method: "POST",
  headers: {
    apikey: "YOUR_ANON_KEY",
    Authorization: "Bearer YOUR_ANON_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: "Test User",
    email: "test@example.com",
    phone: "123-456-7890",
    project_type: "General Inquiry",  // ✅ Correct
    message: "Test message",
    source_page: "/contact",
    status: "new"
  })
});
```

### Test BookService Form
```javascript
// Should succeed with status 201
fetch("https://mlxsfhdzlcxtvqeshgjx.supabase.co/rest/v1/leads", {
  method: "POST",
  headers: {
    apikey: "YOUR_ANON_KEY",
    Authorization: "Bearer YOUR_ANON_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    project_address: "123 Main St",
    project_type: "Interior Painting",  // ✅ Correct (NOT service_type!)
    project_details: "Need painting for 3 rooms",
    source_page: "/book",
    status: "new"
  })
});
```

---

## Troubleshooting

### Error: "Could not find the 'service_type' column"

**Cause:** Using `service_type` instead of `project_type`

**Fix:** Change to `project_type`:
```javascript
// Change this:
service_type: formData.serviceType  // ❌

// To this:
project_type: formData.serviceType  // ✅
```

### Error: "Could not find the 'X' column"

**Cause:** Typo or wrong column name

**Fix:** Check spelling against the table schema:
- ✅ `first_name` (with underscore)
- ❌ `firstName` (camelCase won't work)

### Null Values

Some columns can be `null`:
- `first_name`, `last_name` - Only from BookService
- `name` - Only from Contact
- `project_address` - Only from BookService
- `project_details` - Only from BookService
- `message` - Only from Contact

**This is OK!** Different forms fill different fields.

---

## Summary

✅ **Always use `project_type`** for both Contact and BookService forms  
✅ **Never use `service_type`** - it doesn't exist!  
✅ Use `source_page` to differentiate form origins  
✅ Use `status` for lead management workflow  

**The mapping is now correct and all forms should work!** 🎉
# Consultation Time Field Setup Guide

## Current Status
✅ **UI Field Added:** Consultation Time dropdown is visible and functional in BookService form  
⚠️ **Database Column Missing:** The `consultation_time` column doesn't exist in your Supabase `leads` table yet  
🔧 **Form Submission:** Temporarily disabled to prevent errors

---

## Quick Fix (2 minutes)

### Step 1: Add Database Column

1. **Open Supabase SQL Editor:**
   - Go to: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/sql

2. **Run this SQL:**
   ```sql
   ALTER TABLE public.leads 
   ADD COLUMN IF NOT EXISTS consultation_time TEXT;
   
   COMMENT ON COLUMN public.leads.consultation_time IS 'Preferred consultation time in HH:MM format (24-hour) from BookService form';
   ```

3. **Click "Run"** (green button)

4. **Verify Success:**
   The query should return: `ALTER TABLE`

### Step 2: Enable Form Submission

After adding the column, uncomment line 104 in `/pages/BookService.tsx`:

**Change this:**
```tsx
// consultation_time: formData.consultationTime,  // TEMPORARILY DISABLED
```

**To this:**
```tsx
consultation_time: formData.consultationTime,
```

### Step 3: Test

1. Go to BookService page: https://loud-rename-20379962.figma.site/#/book
2. Fill out form with all required fields
3. Select a consultation time (e.g., "2:30 PM")
4. Submit form
5. Check Supabase dashboard → `leads` table
6. Verify `consultation_time` column shows "14:30" (24-hour format)

---

## What the Field Does

### User Experience
- Dropdown with 21 time slots
- Business hours: 8:00 AM - 6:00 PM
- 30-minute increments
- Optional field (not required)
- Displays in 12-hour format with AM/PM

### Database Storage
- Column: `consultation_time`
- Type: `TEXT`
- Format: HH:MM (24-hour, e.g., "14:30" for 2:30 PM)
- Nullable: Can be empty string if not selected

### Admin App Integration
The Admin app at https://ream-oculus-12377734.figma.site/ will automatically display the consultation time once the column exists.

---

## Customizing Time Slots

To change available times, edit `/content/services.ts`:

```typescript
export const timeSlots = [
  "08:00",  // 8:00 AM
  "08:30",  // 8:30 AM
  "09:00",  // 9:00 AM
  // ... add or remove as needed
  "18:00"   // 6:00 PM
];
```

**Examples:**
- **Hourly slots only:** Remove all ":30" entries
- **Extended hours:** Add "19:00", "20:00", etc.
- **Lunch break:** Remove "12:00", "12:30", "13:00"
- **Early start:** Add "07:00", "07:30"

---

## Troubleshooting

### Error: "Could not find the 'consultation_time' column"
**Solution:** Run the SQL migration in Step 1 above

### Column added but still getting error
**Solution:** 
1. Check if the column was actually added:
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'leads' AND column_name = 'consultation_time';
   ```
2. If no results, re-run the ALTER TABLE command
3. Clear browser cache and reload

### Form submits but time not saved
**Solution:** Make sure you uncommented line 104 in BookService.tsx (Step 2)

---

## Database Schema After Migration

Your `leads` table will have:

| Column | Type | Description |
|--------|------|-------------|
| consultation_date | timestamptz | Date picked from calendar |
| consultation_time | text | Time selected from dropdown (HH:MM) |

**Example Row:**
```json
{
  "consultation_date": "2025-11-15T00:00:00.000Z",
  "consultation_time": "14:30",
  "name": "Jane Smith",
  "email": "jane@example.com"
}
```

---

## Files Modified

✅ `/content/services.ts` - Added timeSlots array + formatTime12Hour helper  
✅ `/pages/BookService.tsx` - Added dropdown UI + form state (submission disabled)  
✅ `/guidelines/Guidelines.md` - Updated documentation  
✅ `/ADD-CONSULTATION-TIME-COLUMN.sql` - SQL migration script  
✅ `/CONSULTATION-TIME-SETUP.md` - This setup guide

---

## Complete Migration SQL

Full SQL available in `/ADD-CONSULTATION-TIME-COLUMN.sql`:

```sql
-- Add column
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS consultation_time TEXT;

-- Add documentation
COMMENT ON COLUMN public.leads.consultation_time IS 'Preferred consultation time in HH:MM format (24-hour) from BookService form';

-- Verify
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'leads'
  AND column_name = 'consultation_time';
```

---

## Next Steps

1. ✅ Run SQL migration (2 minutes)
2. ✅ Uncomment line 104 in BookService.tsx
3. ✅ Test form submission
4. ✅ Verify data in Supabase dashboard
5. ✅ Check Admin app displays time correctly

**Need help?** All SQL is ready to copy/paste from `/ADD-CONSULTATION-TIME-COLUMN.sql`

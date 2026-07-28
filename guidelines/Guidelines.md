# Cstle Livn Website Guidelines

## Content Management

All website text content is managed through TypeScript files in the `/content/` directory. This separation keeps content editable without touching component code.

### Content Files Structure

- **`site-info.ts`** - Global site information (contact details, business hours, service area)
- **`navigation.ts`** - Header and footer navigation links
- **`services.ts`** - Service types and consultation time slots shared across forms
- **Page-specific content files** - One file per page (home-content.ts, mission-content.ts, etc.)

### Updating Content

1. **To change contact information:** Update `/content/site-info.ts` only. This info is used across multiple pages.
2. **To change page text:** Update the corresponding content file (e.g., `/content/mission-content.ts` for mission page)
3. **To add gallery items:** Update `/content/gallery-content.ts` with new images and descriptions
4. **To add testimonials:** Update `/content/reviews-content.ts`
5. **To add FAQs:** Update `/content/faq-content.ts`
6. **To update service types:** Update `/content/services.ts` - this updates both Contact and BookService forms
7. **To update consultation time slots:** Update `timeSlots` array in `/content/services.ts` - currently set to 8:00 AM - 6:00 PM in 30-minute increments

### When Making Changes

- Always import content from `/content/` files into page components
- Keep the structure consistent - don't change the object shape without updating components
- Update the README in `/content/` if adding new content types

## Typography Guidelines

The website uses the **Anybody variable font** with specific settings:

### Font Variation Settings
- **Width:** Always set `fontVariationSettings: "'wdth' 137"`
- **Never use Tailwind font size, weight, or line-height classes** unless explicitly changing from design

### Font Weights
- **Headings (H1, H2, H3):** `fontWeight: 700`
- **Subheadings/Bold text:** `fontWeight: 700`
- **Body text:** `fontWeight: 500`
- **Light emphasis text:** `fontWeight: 600`

### Typography Examples
```tsx
// H1 Heading
<h1 style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700 }}>

// Body text
<p style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}>

// Bold body text
<p style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700 }}>
```

### Tracking (Letter Spacing)
- Use design-specified tracking values (e.g., `tracking-[-1.563px]`, `tracking-[-0.6px]`)
- Apply tracking through Tailwind classes

## Design System

### Colors
- **Primary Black:** `#191919`
- **Background Gray:** `#f1f1f1`
- **White:** `#ffffff`
- **Text on Dark:** `rgba(255,255,255,0.8)` for secondary text
- **Muted text:** `#848580`

### Spacing & Layout
- Use the exact spacing values from Figma designs
- Maintain consistent gap values: `gap-[10px]`, `gap-[24px]`, `gap-[32px]`
- Standard padding for sections: `px-[80px]`, `py-[100px]`

### Border Radius
- Cards/Containers: `rounded-[24px]` or `rounded-[32px]`
- Buttons: `rounded-[32px]`
- Form inputs: `rounded-[8px]`

### Shadows
- Cards: `shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]`
- Gallery items: Custom shadow as defined in design

## Component Guidelines

### Header & Footer
- Header: Always use `<Header />` component from `/components/Header.tsx`
- Footer: Always use `<Footer />` component from `/components/Footer.tsx`
- Do not modify these directly unless updating site-wide navigation

### Forms
- Use native HTML form elements styled with Tailwind
- Form labels: Roboto Mono, uppercase, `text-[11px]` or `text-[12px]`
- Input fields: `bg-white`, `rounded-[8px]`, proper padding
- **Form Submission:** All forms POST directly to `/rest/v1/leads` table using Supabase REST API
- **Validation:** Email regex `/^\S+@\S+\.\S+$/`, phone regex `/^[\d\s\+\-\(\)]+$/`
- **Spam Protection:** Honeypot field `company` included (hidden from users)
- **Form States:** Implement 4 states - `idle`, `submitting`, `success`, `error`
- **Success Messages:** 
  - Contact: "Thanks—your message was received. We'll reply within 1 business day."
  - Booking: "Thanks—your consultation request was received. We'll confirm your date shortly."
- **Error Handling:** Show user-friendly error messages in red alert boxes
- **Admin Notifications:** Automatic email notifications sent via Supabase Edge Function + Resend API
  - Edge Function: `/supabase/functions/notify-admin/index.ts`
  - Trigger: Database webhook fires on INSERT to `leads` table
  - Emails sent to: `cstlelivn@gmail.com`
  - No CORS issues (server-side trigger)
  - Setup guide: `/EMAIL-NOTIFICATIONS-DEPLOYMENT-GUIDE.md`

### Form Implementation Pattern
```tsx
const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
const [errorMessage, setErrorMessage] = useState("");

// On submit:
// 1. Validate inputs
// 2. POST to /rest/v1/leads with proper headers (apikey, Authorization Bearer)
// 3. Show success/error UI (status 201 = success)
// 4. Clear form on success
// Note: Email notifications removed - admin checks Supabase dashboard
```

### Form Field Mapping to Database

Both Contact and BookService forms write to the same `public.leads` table:

**Contact Form:**
```tsx
{
  source_form: "contact",                 // Form identifier for admin filtering
  source_page: window.location.pathname,  // Current route path
  name: formData.name,                    // Full name
  email: formData.email,                  // Email
  phone: formData.phone || null,          // Phone (optional)
  project_type: formData.projectType,     // Project type
  message: formData.message,              // Message
  notes: formData.message,                // Duplicate of message for admin app
  links: null,                            // Reserved for future use
  status: "new"                           // Default status
}
```

**BookService Form:**
```tsx
{
  source_form: "booking",                           // Form identifier for admin filtering
  source_page: window.location.pathname,            // Current route path
  first_name: formData.firstName,                   // First name
  last_name: formData.lastName,                     // Last name
  name: `${formData.firstName} ${formData.lastName}`, // Concatenated (NOT NULL constraint)
  email: formData.email,                            // Email
  phone: formData.phone,                            // Phone
  project_address: formData.address,                // Project address
  service_type: formData.serviceType,               // Admin app expects this
  project_type: formData.serviceType,               // Database expects this
  consultation_date: date ? date.toISOString() : null, // Preferred date (ISO format)
  consultation_time: formData.consultationTime,     // Preferred time (HH:MM format) - ⚠️ REQUIRES DATABASE COLUMN (see CONSULTATION-TIME-SETUP.md)
  project_details: formData.projectDetails,         // Details
  notes: formData.projectDetails,                   // Duplicate of project_details for admin app
  links: null,                                      // Reserved for future use
  status: "new"                                     // Default status
}
```

**⚠️ CONSULTATION TIME FIELD:**
- The `consultation_time` field is currently DISABLED in form submission (line 104 commented out)
- To enable: Run SQL migration in `/ADD-CONSULTATION-TIME-COLUMN.sql` first
- Then uncomment line 104 in `/pages/BookService.tsx`
- See `/CONSULTATION-TIME-SETUP.md` for complete setup guide

**⚠️ IMPORTANT:** 
- Both forms use `project_type` column (database schema)
- BookService also sends `service_type` (admin app compatibility)
- `source_form` field allows admin app to filter "contact" vs "booking" submissions
- `notes` duplicates message/project_details for admin convenience
- `links` is reserved for future features (attachments, reference URLs)
- BookService **must include `name`** field (concatenate `firstName + lastName`) to satisfy NOT NULL constraint

### Buttons
- Primary: Black background with white text
- Use Roboto Mono for button text, uppercase
- Include hover states with opacity or background color transition

### Images
- Always use proper imports for Figma assets
- Maintain aspect ratios from design
- Include alt text for accessibility

## Layout Guidelines

### Responsive Design
- Prevent horizontal scroll: Already handled in globals.css
- Use max-width constraints on content: `max-w-[1200px]`, `max-w-[1000px]`
- Center content: `mx-auto` or flex centering

#### Responsive Breakpoints
- Mobile first approach (default = mobile < 640px)
- `sm:` - 640px and up
- `md:` - 768px and up (tablet)
- `lg:` - 1024px and up (desktop)
- `xl:` - 1280px and up (large desktop)

#### Responsive Spacing
- Padding/Margins: Use responsive classes like `px-[20px] md:px-[40px] lg:px-[80px]`
- Gaps: Use responsive gaps like `gap-[20px] md:gap-[32px] lg:gap-[48px]`
- Typography: Scale font sizes like `text-[14px] md:text-[16px] lg:text-[18px]`

#### Mobile Navigation
- Hamburger menu for mobile (< 768px)
- Full navigation menu for desktop (>= 768px)
- Mobile menu overlays content with smooth transitions

### Grid Layouts
- Mission page: Two-column grid for content sections
- Gallery: Responsive grid with proper gaps
- Use flexbox for most layouts, grid when appropriate

### Gradient Backgrounds
- Header sections use: `bg-gradient-to-b from-[#d9d9d9] to-[#ffffff]` or `from-[#f1f1f1]`

## Animation & Interactions

### Hover States
- Gallery items: Scale image 1.1x, show overlay from bottom
- Buttons: Opacity change or background color darken
- Navigation links: `opacity-70` on hover
- Transition duration: `duration-300` or `duration-500`

### Animations
- Home carousel: Infinite scroll animation defined in globals.css
- Hover reveals: Transform translate with smooth transition

## Code Organization

### File Structure
- Page components in `/pages/`
- Reusable components in `/components/`
- Content files in `/content/`
- Styles in `/styles/globals.css`

### Import Order
1. React/Next.js imports
2. Component imports
3. Content imports
4. Asset imports (images, SVGs)

### Best Practices
- Keep components focused and single-purpose
- Extract repeated UI patterns into reusable components
- Use TypeScript for type safety
- Comment complex logic or unusual patterns

## Brand Voice & Tone

### Writing Style
- Professional yet approachable
- Design-focused and detail-oriented
- Emphasize craftsmanship and precision
- Target audience: Contractors, designers, and homeowners

### Key Messaging
- "Not just installers—finishing experts"
- Emphasis on design sensibility
- Quality, precision, and attention to detail
- Professional partnership approach

## Development Notes

- Never override the default typography in `globals.css` unless explicitly requested
- Maintain consistent spacing using exact pixel values from Figma
- Test all forms for proper submission handling
- Ensure all external images have proper fallbacks
- Keep the SVG logo imports consistent across Header (black) and Footer (white)

## Database & Backend Architecture

### Supabase Integration

The website uses **PostgreSQL + Realtime WebSockets** architecture via Supabase for:
- Form submission storage (`contact_requests`, `bookings` tables)
- CMS content management (dynamic gallery, testimonials, FAQs, etc.)
- Real-time updates for admin dashboard
- Row Level Security (RLS) for data protection

### Supabase Client

Always use the centralized Supabase client:
```tsx
import { supabase } from '../utils/supabase/client';
```

**Never expose service role keys** - use anon key for public operations.

### Data Tables

1. **`leads`** - ALL form submissions (Contact, BookService, Reviews)
   - Fields: `id`, `first_name`, `last_name`, `name`, `email`, `phone`, `project_type`, `project_address`, `project_details`, `message`, `source_page`, `status`, `created_at`
   - RLS: Anonymous inserts allowed via `leads_insert_web` policy
   - Single source of truth for all website form submissions
   - Admin app reads from this table for all lead management
   - **Column Mapping:** Both forms use `project_type` (NOT `service_type`)

2. **CMS Tables** - Dynamic content (see CMS-SETUP-GUIDE.md)
   - `gallery_items`, `testimonials`, `faqs`, etc.

### Form Submission Flow

**Current Implementation (Working):**

1. User fills out Contact or BookService form
2. Frontend validates inputs (email, phone format)
3. POST request to `https://mlxsfhdzlcxtvqeshgjx.supabase.co/rest/v1/leads`
   - Headers: `apikey`, `Authorization: Bearer ${publicAnonKey}`, `Content-Type: application/json`
   - Body: Form data mapped to `leads` table columns
4. Supabase inserts row (status 201 on success)
5. Success message shown to user
6. Admin checks Supabase dashboard or custom admin app for new leads

**Email Notifications:**
- Previously attempted via `notify-admin` Edge Function
- Removed due to CORS errors
- Admin now checks leads directly in Supabase dashboard: https://supabase.com/dashboard/project/mlxsfhdzlcxtvqeshgjx/editor
- Can be re-enabled in future by fixing CORS configuration

### Required Headers for Form Submission

All form POSTs to `/rest/v1/leads` must include:

```tsx
headers: {
  "apikey": publicAnonKey,                    // From utils/supabase/info.tsx
  "Authorization": `Bearer ${publicAnonKey}`, // Same anon key as Bearer token
  "Content-Type": "application/json",
  "Prefer": "return=representation"           // Returns inserted row data
}
```

**Without these headers, you'll get 401 Unauthorized errors.**

### Security Best Practices

- ✅ RLS enabled on all tables
- ✅ Public role can INSERT on form tables (prevents 401 errors)
- ✅ Anonymous users can only INSERT (no SELECT/UPDATE/DELETE)
- ✅ Honeypot spam protection on forms
- ✅ Client-side validation before database operations
- ✅ No PII or sensitive data collection beyond business requirements
- ✅ CORS properly configured for approved domains

### CORS Configuration

Approved origins in Supabase:
- `https://cstlelivn.ca`
- `https://www.cstlelivn.ca`
- `https://admin.cstlelivn.ca`
- `https://work.cstlelivn.ca`

### Setup & Deployment

For complete setup instructions, see:
- `/SETUP-LEADS-TABLE.sql` - Database table setup with RLS policies
- `/ERROR-RESOLUTION-COMPLETE.md` - Complete fix documentation
- `/COLUMN-MAPPING-REFERENCE.md` - Field mapping reference
- `/CMS-SETUP-GUIDE.md` - CMS configuration
- `/SUPABASE-MIGRATIONS.sql` - Full database schema

### Troubleshooting

**Common Errors:**

1. **401 Unauthorized** - Missing or incorrect headers (apikey, Authorization)
2. **Column not found (service_type)** - Using wrong column name (should be `project_type`)
3. **NOT NULL constraint on "name"** - BookService must include concatenated `name` field
4. **CORS errors** - Edge Function calls removed, check if they were re-added
5. **RLS errors** - Verify `leads_insert_web` policy exists and allows anonymous inserts

**Quick Fixes:**
- Check `/ERROR-RESOLUTION-COMPLETE.md` for all known issues and solutions
- Verify headers match `/COLUMN-MAPPING-REFERENCE.md` examples
- Ensure BookService includes: `name: ${formData.firstName} ${formData.lastName}`
- Test forms with console smoke test from `/VERIFY-LEADS-SETUP.md`
# Website Analytics Setup Guide

## Overview

This guide will help you track website visits, click-through rates, user behavior, and conversions for cstlelivn.ca.

---

## Option 1: Google Analytics 4 (Recommended - Free & Comprehensive)

### Step 1: Create Google Analytics Account

1. Go to [https://analytics.google.com](https://analytics.google.com)
2. Click "Start measuring" or "Admin" (gear icon)
3. Create a new account (name it "Cstle Livn")
4. Create a new property:
   - Property name: "Cstle Livn Website"
   - Time zone: Canada/Saskatchewan
   - Currency: CAD
5. Click "Create" and accept terms

### Step 2: Get Your Measurement ID

1. In Admin > Property Settings > Data Streams
2. Click "Add stream" > "Web"
3. Enter:
   - Website URL: `https://cstlelivn.ca`
   - Stream name: "Main Website"
4. Click "Create stream"
5. **COPY YOUR MEASUREMENT ID** (format: `G-XXXXXXXXXX`)

### Step 3: Install Google Analytics on Your Website

#### A. Add GA4 Script to Your HTML

Add this code to your `index.html` **before the closing `</head>` tag**:

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Replace `G-XXXXXXXXXX` with your actual Measurement ID!**

#### B. Update Analytics Configuration

Edit `/utils/analytics.ts` and replace:

```typescript
export const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with your GA4 ID
```

With your actual ID:

```typescript
export const GA_MEASUREMENT_ID = 'G-ABC1234567'; // Your real ID
```

### Step 4: Verify Installation

1. Go to Google Analytics > Reports > Realtime
2. Open your website in a browser
3. You should see yourself as an active user within 30 seconds

---

## What Metrics You Can Track

### Automatic Tracking (Already Configured)

✅ **Page Views** - Every page visit is tracked automatically  
✅ **Sessions** - User sessions and duration  
✅ **Bounce Rate** - % of single-page sessions  
✅ **Traffic Sources** - Where visitors come from (Google, social media, direct)  
✅ **Device Types** - Mobile vs. Desktop vs. Tablet  
✅ **Location** - Geographic data (city, country)  
✅ **Real-time Users** - See current visitors

### Custom Event Tracking (Implemented in Code)

The following events are already set up in `/utils/analytics.ts`:

#### Form Events
- `form_start` - User begins filling a form
- `form_submit` - Form submitted successfully
- `form_error` - Form submission errors

#### Navigation Events
- `navigation_click` - Menu/link clicks
- `cta_click` - Call-to-action button clicks

#### Engagement Events
- `gallery_item_view` - Gallery image views
- `social_click` - Social media link clicks
- `contact_method_click` - Phone/email clicks
- `service_interest` - Service type selections

#### Scroll & Time
- `scroll_depth` - How far users scroll (25%, 50%, 75%, 100%)
- `time_on_page` - Time spent on each page

---

## How to Use Analytics in Your Code

### Example 1: Track Form Submissions

In your Contact or BookService forms, add tracking:

```tsx
import { analytics } from '../utils/analytics';

// When form starts
const handleFormFocus = () => {
  analytics.trackFormStart('contact'); // or 'booking'
};

// On successful submission
const handleSubmit = async (e) => {
  // ... your form logic ...
  
  if (response.ok) {
    analytics.trackFormSubmit('contact', true);
  } else {
    analytics.trackFormSubmit('contact', false);
    analytics.trackFormError('contact', 'submission_failed');
  }
};
```

### Example 2: Track CTA Clicks

```tsx
import { analytics } from '../utils/analytics';

<button 
  onClick={() => {
    analytics.trackCTAClick('Book Consultation', 'Homepage Hero');
    // ... navigate to booking page
  }}
>
  Book a Consultation
</button>
```

### Example 3: Track Phone/Email Clicks

```tsx
<a 
  href="tel:+13065551234"
  onClick={() => analytics.trackContactClick('phone')}
>
  Call Us
</a>

<a 
  href="mailto:info@cstlelivn.ca"
  onClick={() => analytics.trackContactClick('email')}
>
  Email Us
</a>
```

### Example 4: Track Social Media Clicks

```tsx
<a 
  href="https://instagram.com/cstlelivn"
  onClick={() => analytics.trackSocialClick('instagram')}
>
  Instagram
</a>
```

---

## Key Reports to Check

### 1. Traffic Overview
**Location:** Reports > Life cycle > Acquisition > Traffic acquisition

**Shows:**
- Where visitors come from (Google Search, Social Media, Direct)
- Which channels drive the most traffic
- New vs. returning users

### 2. Page Performance
**Location:** Reports > Engagement > Pages and screens

**Shows:**
- Most visited pages
- Average time on each page
- Bounce rates per page
- Exit rates

### 3. Conversion Tracking
**Location:** Reports > Engagement > Conversions

**Shows:**
- Form submissions (Contact, Booking)
- Button clicks
- Custom events you've set up

**Setup Conversions:**
1. Admin > Events > Mark events as conversions
2. Mark these as conversions:
   - `form_submit`
   - `cta_click` (for important CTAs)
   - `contact_method_click`

### 4. User Demographics
**Location:** Reports > User > Demographics

**Shows:**
- Age, gender (if enabled)
- Location (city, region)
- Language
- Device type

### 5. Real-Time Activity
**Location:** Reports > Realtime

**Shows:**
- Current active users
- Pages being viewed right now
- Traffic sources in real-time

---

## Option 2: Privacy-Focused Analytics (Alternative)

If you prefer **GDPR/privacy-compliant** analytics without cookies:

### Plausible Analytics (Recommended Alternative)

**Pros:**
- ✅ No cookie banners needed
- ✅ GDPR, CCPA compliant
- ✅ Lightweight (< 1KB script)
- ✅ Simple, clean dashboard
- ✅ No data sharing with third parties

**Pricing:** ~$9/month for 10k monthly pageviews

**Setup:**
1. Sign up at [https://plausible.io](https://plausible.io)
2. Add your domain: `cstlelivn.ca`
3. Install their script in `index.html`:

```html
<script defer data-domain="cstlelivn.ca" src="https://plausible.io/js/script.js"></script>
```

**Metrics Provided:**
- Page views
- Unique visitors
- Bounce rate
- Visit duration
- Top pages
- Traffic sources
- Countries/regions
- Devices

---

## Option 3: Self-Hosted Analytics (Supabase)

For complete control, track analytics in your own Supabase database.

### Create Analytics Table

```sql
CREATE TABLE analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_data JSONB,
  page_url TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at);

-- RLS policy (allow anonymous inserts)
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous analytics inserts"
ON analytics_events
FOR INSERT
TO anon
WITH CHECK (true);
```

### Enable in Code

Uncomment the Supabase tracking function in `/utils/analytics.ts`:

```typescript
export const trackToSupabase = async (eventType: string, eventData: Record<string, any>) => {
  const { error } = await supabase
    .from('analytics_events')
    .insert({
      event_type: eventType,
      event_data: eventData,
      page_url: window.location.href,
      user_agent: navigator.userAgent,
    });
  
  if (error) console.error('Analytics error:', error);
};
```

### Query Your Data

```sql
-- Total page views today
SELECT COUNT(*) 
FROM analytics_events 
WHERE event_type = 'page_view' 
AND created_at >= CURRENT_DATE;

-- Most popular pages
SELECT 
  event_data->>'page' as page,
  COUNT(*) as views
FROM analytics_events
WHERE event_type = 'page_view'
GROUP BY event_data->>'page'
ORDER BY views DESC;

-- Form conversion rate
SELECT 
  COUNT(CASE WHEN event_type = 'form_start' THEN 1 END) as starts,
  COUNT(CASE WHEN event_type = 'form_submit' THEN 1 END) as submits,
  ROUND(
    COUNT(CASE WHEN event_type = 'form_submit' THEN 1 END)::numeric / 
    NULLIF(COUNT(CASE WHEN event_type = 'form_start' THEN 1 END), 0) * 100, 
    2
  ) as conversion_rate
FROM analytics_events;
```

---

## Quick Comparison

| Feature | Google Analytics | Plausible | Self-Hosted (Supabase) |
|---------|------------------|-----------|------------------------|
| **Cost** | Free | $9/mo | Free (in existing DB) |
| **Privacy** | Cookies required | Cookieless | Full control |
| **Setup** | 10 minutes | 5 minutes | 30 minutes |
| **Features** | Very comprehensive | Simple & clean | Custom queries |
| **Support** | Community + Docs | Email support | Self-service |
| **GDPR** | Requires consent | Compliant | Compliant |

---

## Recommended Setup for Cstle Livn

**Best Approach:** Use **Google Analytics 4** for comprehensive tracking

**Why:**
- Free forever
- Industry standard
- Rich insights (traffic sources, demographics, behavior flow)
- Easy goal/conversion tracking
- Integration with Google Ads (if you advertise)
- Historical data and trends

**Privacy Note:** 
Add a cookie consent banner if using GA4. Simple libraries:
- `react-cookie-consent` (popular React library)
- Or add text to your Terms page about cookie usage

---

## Testing Your Analytics

### 1. Check Real-Time Data

1. Open Google Analytics > Reports > Realtime
2. Open your website in incognito mode
3. Navigate to different pages
4. You should see activity within 30 seconds

### 2. Test Custom Events

Open browser console and run:

```javascript
// Test form tracking
analytics.trackFormStart('contact');
analytics.trackFormSubmit('contact', true);

// Test CTA tracking
analytics.trackCTAClick('Test Button', 'Test Location');

// Check if gtag is loaded
console.log(window.gtag ? 'GA loaded ✓' : 'GA not loaded ✗');
```

### 3. Verify Events in GA4

1. Go to Admin > DebugView (for development testing)
2. Or check Reports > Realtime > Event count by Event name
3. Your custom events should appear within minutes

---

## Next Steps

1. ✅ Set up Google Analytics 4 account
2. ✅ Get your Measurement ID
3. ✅ Add GA4 script to `index.html`
4. ✅ Update `GA_MEASUREMENT_ID` in `/utils/analytics.ts`
5. ✅ Deploy your website
6. ✅ Verify tracking works (Realtime view)
7. ✅ Set up conversion goals
8. ✅ Create custom reports/dashboard

---

## Support & Resources

- **Google Analytics Help:** [https://support.google.com/analytics](https://support.google.com/analytics)
- **GA4 Setup Guide:** [https://support.google.com/analytics/answer/9304153](https://support.google.com/analytics/answer/9304153)
- **Analytics Academy (Free Course):** [https://analytics.google.com/analytics/academy/](https://analytics.google.com/analytics/academy/)

---

## Questions?

If you need help with:
- Setting up specific conversion goals
- Creating custom dashboards
- Integrating with Google Search Console
- Adding UTM parameters for campaign tracking

Let me know and I'll provide specific guidance!

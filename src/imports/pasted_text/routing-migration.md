The `#` is there because the site currently uses hash-based routing. Everything after `#` is interpreted inside the browser, so the host only needs to serve the homepage.

`/book` is the cleaner, professional URL, but it requires two coordinated changes:

1. Replace hash routing with browser/history routing.
2. Configure the hosting server so `/book`, `/gallery`, and other routes all serve the main app entry file instead of falling back incorrectly.

Use this revised Figma Make prompt:

Replace the Cstle Livn website’s hash-based routing with clean, production-ready URLs.

Current problem:

- `https://cstlelivn.ca/#/book` depends on hash routing.
- `https://cstlelivn.ca/book` keeps the URL but renders the homepage.
- Valid paths are being ignored or overwritten by the app’s homepage state.
- We need clean links that can be placed on ads, social media, emails, Google Business, and external buttons.

Target URLs:

- Home: `https://cstlelivn.ca/`
- Book: `https://cstlelivn.ca/book`
- Gallery: `https://cstlelivn.ca/gallery`
- Convert every other existing page to the same clean URL format.

Implementation requirements:

1. Audit the current routing code and hosting setup before changing anything. Identify:

- Which router is currently used
- Whether `HashRouter`, manual `window.location.hash`, or custom page state is controlling navigation
- Any startup effect or fallback that forces the homepage
- Which hosting/deployment system serves `cstlelivn.ca`

2. Replace hash routing with history/browser routing using the router already installed in the project. For example, if this is React Router, use `BrowserRouter` and define explicit routes.

3. Create one authoritative route table. Do not combine URL routing with separate page state that can override the active path.

At minimum, support:

- `/` → Home
- `/book` → Booking page
- `/gallery` → Gallery page
- Every other real page currently available on the website
- `*` → Page Not Found

4. Remove or correct any logic that renders Home when `window.location.pathname` is `/book`, `/gallery`, or another valid route.

5. Add the required hosting rewrite configuration:

- Every application route that does not match a real static asset must serve the app’s main `index.html`.
- Static assets, images, scripts, stylesheets, icons, robots.txt, sitemap.xml, and other real files must continue to load normally.
- Do not redirect application routes to `/`.
- Preserve the requested browser URL while serving `index.html`.

Use the correct rewrite configuration for the actual deployment provider. Do not create configuration files for several different providers or guess which one is active.

6. Add compatibility redirects for old shared links:

- `/#/book` → `/book`
- `/#/gallery` → `/gallery`
- Convert every other old hash route to its matching clean route.

These redirects must preserve any query parameters where practical.

7. Update all internal navigation and calls to action to use proper route links:

- Booking buttons → `/book`
- Gallery and “View Our Work” buttons → `/gallery`
- Logo and Home links → `/`
- Every other button → its correct page

Use proper anchor elements or the router’s Link component so users can open links in a new tab, copy the address, and use keyboard navigation.

8. Do not use `window.location.href = "/"` or a homepage fallback for valid routes.

9. Preserve browser behaviour:

- Refreshing `/book` remains on `/book`
- Refreshing `/gallery` remains on `/gallery`
- Back and Forward work
- Opening a link in a new tab works
- Query parameters remain available
- No homepage flash occurs before the correct page loads

10. Do not change the website’s current design, content, colours, typography, spacing, animations, forms, or Supabase integration. This task is routing and hosting configuration only.

Required acceptance tests:

- Open `https://cstlelivn.ca/book` directly in a new tab: Booking renders.
- Refresh `/book`: Booking remains.
- Open `https://cstlelivn.ca/gallery` directly: Gallery renders.
- Refresh `/gallery`: Gallery remains.
- Click every booking CTA: it navigates to `/book`.
- Copy a booking CTA link and paste it into another tab: Booking renders.
- Use Back and Forward between Home, Gallery, and Book: each route renders correctly.
- Open an old `/#/book` link: it changes to and renders `/book`.
- Open an invalid path: Page Not Found renders instead of Home.
- Booking submission and existing Supabase behaviour still work.

Important deployment requirement:

Do not mark this task complete based only on the Figma Make preview. Publish the corrected routing and rewrite configuration, then test the real production domain `https://cstlelivn.ca`. If Figma Make cannot modify the production hosting rewrite rules, clearly identify the hosting provider and provide the exact remaining rewrite setting or file required instead of claiming the clean URLs are fixed.

After implementation, report:

- The original cause
- The router change made
- The hosting rewrite added
- All supported routes
- Production test results for direct entry, refresh, Back/Forward, old-link compatibility, and buttons
Build the final, production-ready Google Drive gallery automation for the Cstle Livn website.

This must improve the existing system, not replace it.

CURRENT ARCHITECTURE

The website already uses this flow:

Google Drive “Website Photos” folder  
→ secure synchronization process  
→ Supabase `gallery_albums` and `gallery_images`  
→ `lib/gallery.ts`  
→ `pages/Gallery.tsx`

Configured Google Drive root folder:

`1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb`

Relevant existing files include:

- `lib/gdrive.ts`
- `scripts/syncGalleryFromDrive.ts`
- `lib/gallery.ts`
- `pages/Gallery.tsx`
- Supabase tables `gallery_albums` and `gallery_images`

Do not build a second gallery data source. Do not hard-code the newly uploaded folders or photographs into the React page.

PRIMARY OBJECTIVE

Make Google Drive the simple content-management system for the gallery:

- Adding a project folder adds an album to the website automatically.
- Adding an image adds it to the correct album automatically.
- Renaming an image updates the corresponding gallery information safely.
- Deleting or moving an image out of the Drive folder removes it from the public gallery.
- Deleting or moving a project folder out of “Website Photos” removes that album from the public gallery.
- Changes should appear within one hour without rebuilding or republishing the website.
- Provide an authorized manual “Sync Gallery Now” option for urgent updates.

Do not use a browser WebSocket or expose Google Drive credentials in the website.

1. PROTECT CUSTOMER INFORMATION

The current Google Drive folders include names such as:

- `P001 - Trombley`
- `P002 - Lentil`
- `P003 - Buckingham`

Treat these as internal project identifiers. Do not expose customer surnames, internal folder names, Drive IDs or private addresses on the public website.

Do not use the raw Google Drive folder name directly as the public album title.

Add separate fields to `gallery_albums`:

- `source_folder_name`
- `public_title`
- `public_slug`
- `drive_folder_id`
- `description`
- `status`
- `service_category`
- `cover_image_id`
- `display_position`
- `is_active`
- `last_synced_at`

`drive_folder_id` must be the stable identity used during synchronization. A folder rename must update the existing record rather than creating a duplicate album.

For existing folders, give them neutral temporary public titles until I provide final titles:

- `P001 - Trombley` → `Renovation Project 001`
- `P002 - Lentil` → `Renovation Project 002`
- `P003 - Buckingham` → `Renovation Project 003`

Do not display the client surname anywhere publicly, including HTML, image alt text, image captions, URLs, metadata or visible debugging output.

Allow an authorized administrator to edit `public_title`, description, category and status without renaming the Drive folder.

2. AUTOMATIC SYNCHRONIZATION

Implement secure server-side gallery synchronization every hour.

Use the deployment platform’s supported scheduler, scheduled server function, GitHub Actions schedule or Supabase scheduled Edge Function—whichever is genuinely supported by the current production setup.

Do not simulate automation inside the visitor’s browser.

Requirements:

- Run once every hour.
- Also provide a secure manual “Sync Gallery Now” action for an authorized administrator.
- Prevent two synchronization jobs from running simultaneously.
- Record start time, finish time, status, images added, images updated, images deactivated and errors.
- Retry temporary Google Drive or Supabase failures safely.
- A failed sync must not empty or damage the existing public gallery.
- Use batching and pagination so more than 100 Drive files can be processed.
- Respect Google Drive API limits.
- Do not require the website to be open for synchronization to run.
- Do not rebuild or republish the website after each sync.

If the current deployment platform cannot schedule jobs, implement the secure synchronization endpoint and provide the exact scheduler configuration still required. Do not claim hourly automation is complete unless it has been scheduled and tested.

3. SECURITY

All synchronization must run server-side.

Never expose any of the following in client-side code, the browser bundle, visible logs or source control:

- Google service-account JSON
- Google private key
- Supabase service-role key
- Administrative synchronization secret

Use environment secrets.

The public Gallery page must use only the normal public Supabase client under appropriate Row Level Security policies.

The manual synchronization endpoint must require authenticated administrator authorization. Do not accept an unrestricted public request.

The Google Drive service account should have only the access necessary to read the gallery folder.

4. SAFE DATA SYNCHRONIZATION

Replace the current destructive synchronization behaviour.

The existing sync deletes all image rows in an album and recreates them. Stop doing this because it destroys IDs, captions, cover choices and curated display order.

Use non-destructive upserts keyed by:

- Albums: `drive_folder_id`
- Images: `drive_file_id`

For every sync:

- Discover current Drive subfolders.
- Upsert albums by stable Drive folder ID.
- Discover supported images inside each folder.
- Upsert images by stable Drive file ID.
- Preserve manual public titles, captions, categories, cover choices and display positions.
- Mark missing Drive images inactive only after a successful complete scan.
- Mark missing Drive folders inactive only after a successful complete scan.
- Do not hard-delete records during routine sync.
- Do not deactivate anything when the Drive scan is incomplete or fails.
- Restore a previously inactive record if its Drive file or folder returns.
- Record `last_seen_at` and `last_synced_at`.
- Ignore files in the Drive root because albums must be folders.
- Ignore PDFs, documents, videos and unsupported file formats.
- Never remove content based on a partial or failed API response.

Public gallery queries must return only active albums and active images.

When an album has no active images, remove it from the public gallery automatically without destroying its database record.

5. COVER-PHOTO CONVENTION

Use a simple filename convention for automatic cover selection.

Preferred cover filename:

`01-cover-description.jpg`

Also accept:

- `01_cover_description.jpg`
- A filename beginning with `01-`
- A filename beginning with `01_`

Cover priority:

1. An administrator’s explicitly selected `cover_image_id`
2. An active image whose filename starts with `01-cover` or `01_cover`
3. Any active image whose filename begins with numeric prefix `01`
4. The first active image according to numeric filename order
5. The earliest valid active image as the final fallback

Manual cover selection must remain in place across future syncs unless that Drive image is deleted or moved out of the folder.

If the selected cover disappears, automatically choose the next eligible active image and record this in the sync report.

Do not use “most recently uploaded” as the default cover rule.

6. IMAGE DISPLAY ORDER

Use numeric filename prefixes for automatic ordering:

- `01-cover-basement.jpg`
- `02-before-main-room.jpg`
- `03-progress-framing.jpg`
- `04-progress-drywall.jpg`
- `05-completed-flooring.jpg`

Sort images by:

1. Explicit administrator display position, when set
2. Leading filename number
3. Filename alphabetically
4. Drive creation time as the final tie-breaker

Files without a numeric prefix should appear after numbered files.

Re-running synchronization must not randomly rearrange images.

7. IMAGE TITLES AND DESCRIPTIONS

Store the original Drive filename internally, but create a safe display label by:

- Removing the extension
- Removing the numeric prefix
- Replacing hyphens and underscores with spaces
- Converting it to readable capitalization

Example:

`03-progress-drywall-installation.jpg`  
→ `Progress — Drywall Installation`

Do not show the raw filename publicly.

Do not attempt to invent detailed descriptions by analyzing the image. A filename-derived description may be inaccurate.

Allow optional manual captions. If no approved caption exists:

- Show only the album title and image count on album cards.
- Do not show a speculative image description.
- Use concise, factual alt text based on verified metadata.
- Do not expose customer names through filenames.

8. GALLERY CARD DESIGN

Preserve the website’s existing visual identity and rounded-card aesthetic.

On the main Gallery page:

- Show one card per project folder.
- Use the selected cover photograph.
- Keep card sizes balanced and responsive.
- Show the public album title.
- Show a small image count.
- Optionally show a small status or service-category label when verified.
- Do not place huge text over the photographs.
- Do not use a large, dark overlay that obscures the work.

On hover:

- Use only a subtle bottom gradient for readability.
- Show a small album title and image count.
- Use restrained text sizing.
- Add a minimal “View Project” indication if useful.
- Preserve visibility of the actual craftsmanship.

On touch devices, do not depend on hover. The necessary project title and action must remain accessible.

Remove the excessive blank space between the Gallery introduction and project grid.

9. PROJECT VIEWER

Selecting an album must open its active photographs in a polished project viewer.

Support:

- Previous and next controls
- Keyboard arrow navigation
- Escape to close
- Swipe gestures on mobile
- Visible image counter
- Thumbnail navigation where appropriate
- Correct focus management
- Meaningful close button
- No background scrolling while full-screen
- Browser Back returning to the gallery
- Restoration of the visitor’s scroll position after closing
- “Discuss a Similar Project” linking to `/book`

Do not display raw Drive filenames, customer names or internal folder codes in the viewer.

10. IMAGE DELIVERY AND PERFORMANCE

Keep Google Drive as the source of original photographs, but make delivery reliable and efficient.

Requirements:

- Use thumbnail-sized images in the project grid.
- Load larger images only when the viewer opens.
- Lazy-load below-the-fold images.
- Set image dimensions or aspect ratios to prevent layout shifting.
- Preserve orientation.
- Do not stretch portrait photographs.
- Do not download every full-resolution image on initial page load.
- Provide a subtle loading state.
- Provide a clean fallback when one image cannot load.
- Avoid duplicate requests for the same image.
- Verify that the chosen Google Drive URLs work for public website visitors who are not signed into the owner’s Google account.

Do not make the entire Drive folder publicly editable. Use the safest read configuration supported by the existing system.

11. DATABASE CHANGES

Update the existing schema safely rather than replacing the current tables.

`gallery_albums` should support at least:

- `id`
- `drive_folder_id` unique
- `source_folder_name`
- `public_title`
- `public_slug` unique
- `description`
- `service_category`
- `status`
- `cover_image_id`
- `display_position`
- `is_active`
- `last_seen_at`
- `last_synced_at`
- timestamps

`gallery_images` should support at least:

- `id`
- `album_id`
- `drive_file_id` unique
- `source_filename`
- `display_title`
- `caption`
- `url`
- `thumbnail_url`, when available
- `drive_created_at`
- `drive_modified_at`
- `display_position`
- `manual_position`
- `is_active`
- `last_seen_at`
- `last_synced_at`
- timestamps

Add a `gallery_sync_runs` table containing:

- Start time
- Finish time
- Status
- Trigger type: scheduled or manual
- Albums discovered
- Images discovered
- Added count
- Updated count
- Deactivated count
- Reactivated count
- Error summary

Create versioned, idempotent database migrations. Do not attempt to run privileged schema changes from the public browser.

12. DELETION AND REMOVAL RULES

When I delete or move a photograph out of its Drive project folder:

- The next successful sync marks it inactive.
- It stops appearing publicly.
- Its database history remains recoverable.

When I delete or move a project folder out of “Website Photos”:

- The next successful sync marks the album and its images inactive.
- The album disappears publicly.
- Historical database records remain recoverable.

When a file or folder is restored:

- The next successful sync reactivates the existing record.
- Do not create duplicates.

Do not read items from Google Drive Trash.

13. ROUTING

Preserve clean production routes:

- Gallery: `/gallery`
- Booking: `/book`

Opening or refreshing `/gallery` must not show the homepage.

If individual project URLs are added, use safe public slugs:

`/gallery/{public-slug}`

Do not use the Drive folder ID, customer name or internal project code in a public URL.

Browser Back and Forward must work correctly.

14. ADMIN CONTROLS

Provide a minimal authenticated gallery-management area where an authorized administrator can:

- Run “Sync Gallery Now”
- See the last successful synchronization time
- See synchronization errors
- Edit public album titles
- Edit album descriptions
- Select service category and status
- Select or change the cover image
- Reorder albums
- Reorder images
- Add or edit verified captions
- Preview changes
- Hide or publish an album

Do not place these controls on the public Gallery page.

Manual edits must survive future Drive synchronization.

15. CURRENT FOLDER MIGRATION

Import and synchronize the newly uploaded folders currently under “Website Photos,” including:

- `P001 - Trombley`
- `P002 - Lentil`
- `P003 - Buckingham`

Treat these as internal source folders.

Do not show the surnames publicly. Use the temporary neutral public titles specified earlier until I replace them through the administrator controls.

Do not rename or move my Drive folders without explicit permission.

16. ACCEPTANCE TESTS

Do not report completion until all applicable tests pass:

1. Run a full sync and confirm all three existing Drive folders are discovered.
2. Confirm the folders become three active gallery albums.
3. Confirm customer surnames are absent from the public website and public URLs.
4. Add a test image to a Drive folder and confirm it appears after manual sync.
5. Rename the test image and confirm the existing record updates without duplication.
6. Delete or move the test image and confirm it disappears after a successful sync.
7. Restore it and confirm the same record reactivates.
8. Create a test folder and confirm it becomes an album.
9. Remove the test folder and confirm it becomes inactive.
10. Confirm a failed Drive request does not remove existing content.
11. Confirm a filename beginning with `01-cover` becomes the automatic cover.
12. Select a different cover manually and confirm it survives another sync.
13. Confirm numbered images display in numerical order.
14. Confirm hourly synchronization is genuinely scheduled.
15. Confirm the authorized manual synchronization works.
16. Confirm no secret appears in the browser bundle or public logs.
17. Confirm the public gallery works for a signed-out visitor.
18. Confirm `/gallery` opens directly and survives refresh.
19. Confirm project cards and the viewer work on desktop and mobile.
20. Confirm text overlays are small and do not obscure the photographs.
21. Confirm existing gallery content was not unintentionally deleted.
22. Confirm the website does not require republishing after Drive changes.

17. COMPLETION REPORT

After implementation, provide:

- The synchronization method used
- Where and how the hourly schedule is configured
- The exact expected delay between a Drive change and the website update
- Database migration applied
- Files changed
- Secrets required, listed by variable name only
- Existing folders discovered
- Public titles assigned
- Cover selected for each album
- Number of images synchronized
- Last successful synchronization time
- Results of every acceptance test
- Any one-time deployment or configuration action that I still need to complete

Do not claim that the automation is complete if only the Figma Make preview works, if the scheduler is not active, or if Google Drive changes still require a website rebuild.
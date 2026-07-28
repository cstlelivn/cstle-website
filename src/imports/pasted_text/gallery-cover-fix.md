Fix the missing cover photographs on the Gallery album cards.

CURRENT BEHAVIOUR

- All three Google Drive folders synchronize successfully.
- Clicking an album card opens the album and its photographs display correctly.
- “View all images” also displays the photographs correctly.
- Only the album cover on the main Gallery cards is broken.
- Therefore, Google Drive access and the individual image URLs already work.
- Do not rebuild the synchronization system or change Google Drive permissions.

ROOT CAUSE TO FIX

The album card is attempting to use missing, incorrect or invented cover information instead of reusing one of the working images already associated with that album.

A Google Drive folder is not an image and cannot be used as an `<img>` source.

Do not construct a cover URL from:

- The album title
- `Renovation Project 001`
- The Google Drive folder name
- The folder ID
- A guessed filename
- A guessed storage location

The cover must be selected from the album’s real `gallery_images` records.

REQUIRED COVER LOGIC

When loading active Gallery albums:

1. Fetch the album’s active images from `gallery_images`.
2. Group those images by their real `album_id`.
3. Sort each album’s images using:
   - `display_position` first
   - `position` as the fallback
4. Select the cover in this order:
   - The image referenced by a valid `cover_image_id`, if available and active
   - Otherwise, the first active image whose source filename begins with `01-cover` or `01_cover`
   - Otherwise, the active image with position `0`
   - Otherwise, the first active image in the sorted album image collection
5. For the selected cover, use:
   - Its working `thumbnail_url`, when present
   - Otherwise, its working `url`
6. Pass that exact working URL to the album card.

Most importantly: if the selected image displays successfully after clicking the album, use the same image record and URL for the album cover. Do not generate a different card-specific Google Drive URL.

EXPECTED DATA SHAPE

Build each album result like this conceptually:

```ts
{
  id: album.id,
  name: album.public_title ?? album.name,
  slug: album.public_slug ?? album.slug,
  images: sortedAlbumImages,
  imageCount: sortedAlbumImages.length,
  coverUrl:
    selectedCover?.thumbnail_url ??
    selectedCover?.url ??
    null
}
```

Do not use an album name as the image source.

FRONTEND CARD

In `Gallery.tsx`, the image element must use only:

```tsx
src={album.coverUrl}
```

The album name belongs only in the text and accessible alt description:

```tsx
alt={`${album.name} project cover`}
```

Do not pass `album.name`, the folder name or public title into `src`.

Keep the current card design, spacing, rounded corners and interactions.

IMAGE-ERROR FALLBACK

If the preferred thumbnail fails to load:

1. Retry once using the selected image’s main `url`.
2. If that also fails, try the next active image from the same album.
3. Only show a neutral placeholder after all album images have failed.
4. Never display a broken-image icon.

Do not create an endless retry loop.

PRIVACY

Do not use internal folder names such as customer surnames as public card titles or alt text.

Continue using the safe public album titles:

- Renovation Project 001
- Renovation Project 002
- Renovation Project 003

Internal Google Drive folder names may be used only to synchronize and match records.

DO NOT DO THESE THINGS

- Do not rename or move Google Drive folders.
- Do not ask me to re-upload photographs.
- Do not create hard-coded cover imports.
- Do not create placeholder image filenames.
- Do not use the folder ID as an image ID.
- Do not remove working album or lightbox behaviour.
- Do not change the synchronization architecture.
- Do not create another gallery data source.
- Do not filter against columns without first confirming they exist.
- Do not claim that an existing column is missing based only on a caught or hidden query error.

ERROR VISIBILITY

Stop silently swallowing gallery query failures.

If an album or image query fails:

- Log the actual Supabase error message and error code.
- Identify the exact query that failed.
- Preserve the last working gallery state.
- Do not replace a failed query result with an empty collection and then claim the album has no images.

ACCEPTANCE TESTS

1. Load `/gallery`.
2. Confirm every album card displays a real photograph from its own album.
3. Confirm Project 001’s cover belongs to Project 001.
4. Confirm Project 002’s cover belongs to Project 002.
5. Confirm Project 003’s cover belongs to Project 003.
6. Click each cover and confirm the same photograph exists inside that album.
7. Confirm the album viewer continues to show all 20 synchronized images.
8. Confirm “View all images” still works.
9. Refresh `/gallery` and confirm covers remain visible.
10. Test while signed out of Google.
11. Confirm no card uses an album title, folder name or folder ID as an image URL.
12. Confirm customer surnames do not appear publicly.
13. Confirm an album without a preferred cover safely uses its first working image.
14. Confirm a failed image uses the next image rather than showing a broken icon.
15. Confirm mobile cards display the correct covers.

After fixing it, report for each album:

- Album ID
- Selected cover image ID
- Selected cover filename
- Whether `thumbnail_url` or `url` was used
- The final cover URL’s HTTP load result
- Confirmation that the same image works inside the album viewer

Do not report completion until all three album covers visibly render in the preview.
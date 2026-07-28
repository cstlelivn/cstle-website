# Gallery CMS Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         GOOGLE DRIVE (Source of Truth)                   │
│                                                                           │
│  📁 Website Photos (1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb)                   │
│  ├── 📁 Kitchen Projects                                                 │
│  │   ├── 🖼️ modern-kitchen-1.jpg                                         │
│  │   ├── 🖼️ modern-kitchen-2.jpg                                         │
│  │   └── 🖼️ traditional-kitchen.jpg                                      │
│  ├── 📁 Bathroom Finishes                                                │
│  │   └── 🖼️ luxury-bathroom.jpg                                          │
│  └── 📁 Living Spaces                                                    │
│      └── 🖼️ hardwood-flooring.jpg                                        │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ READ (via Service Account)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            SYNC SCRIPT (Local Mac)                        │
│                                                                           │
│  📄 run-sync.js                                                          │
│  ├── Loads .env.local                                                    │
│  ├── Validates environment                                               │
│  └── Executes:                                                           │
│                                                                           │
│  📄 scripts/syncGalleryFromDrive.ts                                      │
│  ├── 1. Discover albums (subfolders)                                    │
│  ├── 2. List images in each folder                                      │
│  ├── 3. Generate public URLs                                            │
│  └── 4. Sync to Supabase                                                │
│                                                                           │
│  Uses:                                                                    │
│  • lib/gdrive.ts (Google Drive API)                                     │
│  • @supabase/supabase-js (Database client)                              │
│                                                                           │
│  Run with: npm run sync:gallery                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ WRITE (via Service Role Key)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        SUPABASE (Database Layer)                          │
│                                                                           │
│  📊 gallery_albums                                                       │
│  ├── id: UUID                                                            │
│  ├── slug: "kitchen-projects"                                           │
│  ├── name: "Kitchen Projects"                                           │
│  ├── drive_folder_id: "abc123..."                                       │
│  ├── max_items: 4                                                        │
│  └── is_active: true                                                     │
│                                                                           │
│  📊 gallery_images                                                       │
│  ├── id: UUID                                                            │
│  ├── album_id: → gallery_albums.id                                      │
│  ├── drive_file_id: "xyz789..."                                         │
│  ├── title: "modern-kitchen-1"                                          │
│  ├── category: "Kitchen Projects"                                       │
│  ├── url: "https://drive.google.com/uc?export=view&id=xyz789"          │
│  └── position: 0                                                         │
│                                                                           │
│  🔒 RLS Policies:                                                        │
│  • Public can SELECT (read only)                                        │
│  • Service role can ALL (full access)                                   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ READ (via Anon Key + RLS)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        WEBSITE (Public Frontend)                          │
│                                                                           │
│  📄 pages/Gallery.tsx                                                    │
│  ├── useEffect → fetchGalleryItems()                                    │
│  ├── Display loading state                                              │
│  └── Render gallery grid                                                │
│                                                                           │
│  Uses:                                                                    │
│  • lib/gallery.ts (Data fetcher)                                        │
│  • utils/supabase/client.ts (Anon key client)                           │
│                                                                           │
│  URL: https://loud-rename-20379962.figma.site/Gallery                   │
│                                                                           │
│  🎨 Display:                                                             │
│  ┌─────────┬─────────┬─────────┬─────────┐                            │
│  │ Image 1 │ Image 2 │ Image 3 │ Image 4 │                            │
│  │ Kitchen │ Kitchen │ Bath    │ Living  │                            │
│  └─────────┴─────────┴─────────┴─────────┘                            │
└─────────────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Upload Photos (Non-Technical User)
```
User → Google Drive → Upload photos to album folder
```

### 2. Sync Photos (You or Automated)
```
Your Mac → npm run sync:gallery → Reads Drive → Writes to Supabase
```

### 3. Display Photos (Automatic)
```
Website → Reads Supabase → Displays to visitors
```

## Security Layers

```
┌─────────────────────────────────────────────────────────────────────┐
│ Layer 1: Google Drive                                               │
│ • Service account has READ-ONLY access                              │
│ • Folder shared only with service account (not public)              │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Layer 2: Sync Script (Your Mac)                                     │
│ • Service role key stored in .env.local (not committed)             │
│ • Runs server-side (not exposed to public)                          │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Layer 3: Supabase RLS                                               │
│ • Public can only SELECT (read)                                     │
│ • Public cannot INSERT/UPDATE/DELETE                                │
│ • Service role bypasses RLS (for sync only)                         │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Layer 4: Website (Public)                                           │
│ • Uses anon key (safe to expose)                                    │
│ • RLS automatically restricts to SELECT only                        │
│ • Cannot access sensitive operations                                │
└─────────────────────────────────────────────────────────────────────┘
```

## Environment Variables

```
┌─────────────────────────────────────────────────────────────────────┐
│ .env.local (Local Mac - Never Committed)                            │
│                                                                      │
│ GDRIVE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}           │
│   └─→ Used by: lib/gdrive.ts (sync script)                         │
│   └─→ Permissions: Read-only access to Drive folder                │
│                                                                      │
│ GDRIVE_GALLERY_ROOT_FOLDER=1xouZe7VAwbb_MjnyGljX3AVwAT8aI7Jb        │
│   └─→ Used by: lib/gdrive.ts (sync script)                         │
│   └─→ Purpose: Identifies root folder to sync                      │
│                                                                      │
│ SUPABASE_URL=https://mlxsfhdzlcxtvqeshgjx.supabase.co               │
│   └─→ Used by: scripts/syncGalleryFromDrive.ts                     │
│   └─→ Purpose: Connects to your Supabase project                   │
│                                                                      │
│ SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...                   │
│   └─→ Used by: scripts/syncGalleryFromDrive.ts                     │
│   └─→ Permissions: Full database access (bypasses RLS)             │
│   └─→ ⚠️ CRITICAL: Never expose publicly!                          │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ utils/supabase/info.tsx (Committed to Git - Public)                 │
│                                                                      │
│ projectId=mlxsfhdzlcxtvqeshgjx                                       │
│   └─→ Used by: Website frontend                                    │
│   └─→ Safe to expose: Just identifies the project                  │
│                                                                      │
│ publicAnonKey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...               │
│   └─→ Used by: Website frontend                                    │
│   └─→ Safe to expose: RLS restricts what it can do                 │
│   └─→ Permissions: SELECT only (read)                              │
└─────────────────────────────────────────────────────────────────────┘
```

## File Organization

```
Cstle Make Website/
│
├── 🔐 SECRETS (Never commit)
│   └── .env.local                          Your credentials
│
├── 📜 CONFIG
│   ├── .env.example                        Template
│   ├── package.json                        npm scripts
│   └── tsconfig.json                       TypeScript config
│
├── 🔄 SYNC SYSTEM
│   ├── run-sync.js                         Wrapper script
│   ├── scripts/
│   │   └── syncGalleryFromDrive.ts        Main sync logic
│   └── lib/
│       ├── gdrive.ts                      Google Drive API
│       └── gallery.ts                     Data fetcher
│
├── 🎨 FRONTEND
│   ├── pages/
│   │   └── Gallery.tsx                    Gallery page
│   └── utils/
│       └── supabase/
│           ├── client.ts                  Supabase client
│           └── info.tsx                   Public credentials
│
├── 🗄️ DATABASE
│   └── supabase/
│       └── migrations/
│           └── create_gallery_tables.sql  Schema
│
└── 📖 DOCUMENTATION
    ├── IMPLEMENTATION-COMPLETE.md          Summary (this file)
    ├── HOW-TO-RUN-GALLERY-SYNC.md         Quick start
    ├── GALLERY-SYNC-SETUP.md              Complete guide
    ├── GALLERY-SYNC-CHECKLIST.md          Checklist
    └── GALLERY-CMS-ARCHITECTURE.md        This file
```

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CONTENT EDITOR                              │
│                     (Non-technical person)                           │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ Upload photos
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         GOOGLE DRIVE                                 │
│            📁 Website Photos / Kitchen Projects                      │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ Notify developer
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          DEVELOPER (You)                             │
│                    Runs: npm run sync:gallery                        │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ Execute
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         SYNC SCRIPT                                  │
│         1. Read Drive folders ──→ Discover albums                   │
│         2. Read images ──→ Get first 4 per album                    │
│         3. Generate URLs ──→ Public Drive links                     │
│         4. Write to DB ──→ Upsert albums & images                   │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ Store
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         SUPABASE DATABASE                            │
│              gallery_albums + gallery_images                         │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ Fetch (automatic)
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          WEBSITE                                     │
│             https://loud-rename-20379962.figma.site                  │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ View
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          VISITORS                                    │
│                  See latest gallery photos                           │
└─────────────────────────────────────────────────────────────────────┘
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────────────────┐
│ Storage Layer                                                        │
│ • Google Drive (source of truth for photos)                         │
│ • Supabase PostgreSQL (metadata and URLs)                           │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ Sync Layer (Server-side)                                            │
│ • Node.js 18+                                                        │
│ • TypeScript                                                         │
│ • googleapis (Google Drive API client)                              │
│ • @supabase/supabase-js (Database client)                           │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ Frontend Layer (Client-side)                                        │
│ • React (UI framework)                                              │
│ • TypeScript                                                         │
│ • @supabase/supabase-js (Data fetching)                             │
│ • Tailwind CSS (Styling)                                            │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ Security Layer                                                       │
│ • Google Service Account (API authentication)                       │
│ • Supabase RLS (Row Level Security)                                 │
│ • Environment variables (Secrets management)                        │
└─────────────────────────────────────────────────────────────────────┘
```

---

**This diagram shows the complete architecture of your Gallery CMS system.**

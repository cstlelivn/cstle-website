# 🎨 Visual Setup Guide

**A picture is worth a thousand words!** This guide shows you exactly what to do, step by step.

---

## 🎯 Your Goal

Get from **"I have project files"** to **"I can edit my website!"**

---

## 📍 Where You Are Now

You're looking at this URL:
```
https://loud-rename-20379962.figma.site/#/
```

And when you try to visit:
```
https://loud-rename-20379962.figma.site/#/admin-setup
```

You see:
- ❌ 404 Error
- ❌ Blank page
- ❌ "Page not found"

**Why?** Figma's hosting doesn't support full React apps.

---

## 🛤️ Two Paths Forward

```
┌─────────────────────────────────────────┐
│                                         │
│  Path A: Run on Your Computer (Local)   │
│  ⏱️  Time: 5 minutes                     │
│  💰 Cost: Free                           │
│  🎯 Best for: Testing & Development      │
│                                         │
└─────────────────────────────────────────┘

                    OR

┌─────────────────────────────────────────┐
│                                         │
│  Path B: Deploy to Netlify (Live)       │
│  ⏱️  Time: 10 minutes                    │
│  💰 Cost: Free                           │
│  🎯 Best for: Production Website         │
│                                         │
└─────────────────────────────────────────┘
```

**Recommendation:** Do Path A first to test, then Path B to go live.

---

## 🅰️ Path A: Run Locally (Step-by-Step)

### Step 1: Download Node.js

**What it is:** Software that runs JavaScript on your computer

**Where to get it:** [nodejs.org](https://nodejs.org)

```
┌──────────────────────────────────────┐
│  nodejs.org                          │
│                                      │
│  ┌──────────────┐  ┌──────────────┐ │
│  │   v20.x.x    │  │   v18.x.x    │ │
│  │ Recommended  │  │      LTS     │ │
│  │ For Most     │  │              │ │
│  │ Users        │  │              │ │
│  │              │  │              │ │
│  │  [Download]  │  │  [Download]  │ │
│  └──────────────┘  └──────────────┘ │
│                                      │
│  👆 Click this one!                  │
└──────────────────────────────────────┘
```

**After installation:**
- You'll see an install wizard
- Click "Next" → "Next" → "Install"
- Wait 2 minutes
- Done! ✅

---

### Step 2: Download Your Project

**In Figma Make:**

```
┌────────────────────────────────────────┐
│  Figma Make                       ☰ ⚙️  │
├────────────────────────────────────────┤
│                                        │
│  Your Website Preview                  │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │                                  │ │
│  │   [Your Website Here]            │ │
│  │                                  │ │
│  └──────────────────────────────────┘ │
│                                        │
│  👆 Look for Export or Download        │
│     button (usually top-right)         │
└────────────────────────────────────────┘
```

1. Click **Export** or **Download**
2. Save the ZIP file (e.g., `cstle-livn-website.zip`)
3. Find it in your Downloads folder
4. **Unzip it** (double-click on Mac, right-click → Extract on Windows)

**You now have:**
```
📁 cstle-livn-website/
   ├── 📄 App.tsx
   ├── 📁 pages/
   ├── 📁 components/
   ├── 📁 content/
   └── ... (more files)
```

---

### Step 3: Open Terminal/Command Prompt

**Mac Users:**
```
1. Press: Cmd + Space
2. Type: "terminal"
3. Press: Enter

You'll see a black window:
┌────────────────────────────────────┐
│ Last login: Tue Oct 15 10:00:00   │
│ user@computer ~ %                 │
│ ▊                                 │
└────────────────────────────────────┘
```

**Windows Users:**
```
1. Press: Win + R
2. Type: "cmd"
3. Press: Enter

You'll see a black window:
┌────────────────────────────────────┐
│ Microsoft Windows [Version 10.0]  │
│ (c) Microsoft Corporation.        │
│                                   │
│ C:\Users\YourName>▊               │
└────────────────────────────────────┘
```

---

### Step 4: Navigate to Your Project

**Type this command:**

```bash
cd Downloads/cstle-livn-website
```

**Explanation:**
- `cd` = "change directory" (go to folder)
- `Downloads/cstle-livn-website` = your project folder

**Press Enter**

**You should see:**
```
┌────────────────────────────────────┐
│ user@computer cstle-livn-website % │
│ ▊                                 │
└────────────────────────────────────┘
```

Notice how it now says `cstle-livn-website`? You're in the right folder! ✅

**Tips:**
- If you extracted somewhere else, use that path instead
- Use Tab key to autocomplete folder names
- Type `ls` (Mac) or `dir` (Windows) to see files in current folder

---

### Step 5: Install Dependencies

**Type this command:**

```bash
npm install
```

**What happens:**

```
┌────────────────────────────────────────────┐
│ npm install                                │
│                                            │
│ downloading packages...                    │
│ ████████░░░░░░░░░░ 40%                     │
│                                            │
│ added 1 package                            │
│ added 5 packages                           │
│ added 20 packages                          │
│ ... (lots of text scrolling)               │
│                                            │
│ added 847 packages, and audited 848        │
│ packages in 2m 14s                         │
│                                            │
│ found 0 vulnerabilities                    │
│                                            │
│ user@computer cstle-livn-website %         │
│ ▊                                          │
└────────────────────────────────────────────┘
```

**Wait time:** 1-3 minutes (downloads libraries from internet)

**When done:** You'll see your prompt again (the `%` or `>` symbol)

✅ **Success!** All dependencies installed.

---

### Step 6: Start Development Server

**Type this command:**

```bash
npm run dev
```

**What you'll see:**

```
┌────────────────────────────────────────────┐
│ npm run dev                                │
│                                            │
│   VITE v4.5.0  ready in 524 ms             │
│                                            │
│   ➜  Local:   http://localhost:5173/      │
│   ➜  Network: use --host to expose        │
│                                            │
│                                            │
│                                            │
│ ▊                                          │
└────────────────────────────────────────────┘
```

**Important:** See that `http://localhost:5173/` URL? That's your website!

**DO NOT CLOSE THIS WINDOW!** Keep it running.

✅ **Success!** Server is running.

---

### Step 7: Open in Browser

**Open your web browser** (Chrome, Firefox, Safari, Edge)

**Type in address bar:**
```
http://localhost:5173/#/admin-setup
```

**You should see:**

```
┌─────────────────────────────────────────────┐
│  🔗 http://localhost:5173/#/admin-setup     │
├─────────────────────────────────────────────┤
│                                             │
│           Create Admin Account              │
│                                             │
│   ┌───────────────────────────────────┐    │
│   │ Full Name                         │    │
│   │ [________________]                │    │
│   │                                   │    │
│   │ Email                             │    │
│   │ [________________]                │    │
│   │                                   │    │
│   │ Password                          │    │
│   │ [________________]                │    │
│   │                                   │    │
│   │ Confirm Password                  │    │
│   │ [________________]                │    │
│   │                                   │    │
│   │  [ Create Admin Account ]         │    │
│   └───────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

🎉 **SUCCESS! Your admin panel is working!**

---

### Step 8: Create Admin Account

**Fill out the form:**

```
┌───────────────────────────────────┐
│ Full Name                         │
│ [John Doe______________]          │ ← Your name
│                                   │
│ Email                             │
│ [john@cstlelivn.com____]          │ ← Your email
│                                   │
│ Password                          │
│ [●●●●●●●●●●●________]             │ ← Strong password
│                                   │
│ Confirm Password                  │
│ [●●●●●●●●●●●________]             │ ← Same password
│                                   │
│  [ Create Admin Account ]         │ ← Click here
└───────────────────────────────────┘
```

**Click "Create Admin Account"**

**You'll see:**
```
✅ Admin account created successfully!
```

---

### Step 9: Log In

**Change URL to:**
```
http://localhost:5173/#/admin
```

**You'll see login form:**

```
┌───────────────────────────────────┐
│           Admin Login             │
│                                   │
│   Email                           │
│   [john@cstlelivn.com____]        │
│                                   │
│   Password                        │
│   [●●●●●●●●●●●________]           │
│                                   │
│   [ Login ]                       │
└───────────────────────────────────┘
```

**Enter your credentials → Click Login**

---

### Step 10: Welcome to Admin Panel! 🎉

**You'll see:**

```
┌──────────────────────────────────────────────┐
│  Admin Dashboard                        [×]  │
├──────────────────────────────────────────────┤
│                                              │
│  [ Reviews ]  [ Gallery ]  [ FAQs ]  [ Site Info ]
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │                                        │ │
│  │   📊 Recent Reviews                   │ │
│  │   ────────────────────────────────    │ │
│  │                                        │ │
│  │   (Your reviews will appear here)     │ │
│  │                                        │ │
│  │   [ Delete ] [ Approve ]              │ │
│  │                                        │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │   Add New Content                      │ │
│  │   ...                                  │ │
│  └────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

**You can now:**
- ✅ Upload gallery images
- ✅ Add/edit FAQs
- ✅ Update contact info
- ✅ Manage reviews

---

## 🅱️ Path B: Deploy to Netlify (Step-by-Step)

### Prerequisites
✅ Completed Path A (running locally)  
✅ Verified admin panel works locally

---

### Step 1: Build Production Version

**In your Terminal (still in project folder):**

**Stop the dev server** if running (press Ctrl+C)

**Type:**
```bash
npm run build
```

**You'll see:**

```
┌────────────────────────────────────────────┐
│ npm run build                              │
│                                            │
│ vite v4.5.0 building for production...    │
│ transforming...                            │
│ ✓ 547 modules transformed.                │
│ rendering chunks...                        │
│ dist/index.html                  2.54 kB  │
│ dist/assets/index-abc123.css    45.23 kB  │
│ dist/assets/index-def456.js    234.67 kB  │
│                                            │
│ ✓ built in 3.45s                           │
│                                            │
│ user@computer cstle-livn-website %         │
│ ▊                                          │
└────────────────────────────────────────────┘
```

**Look for:**  ✓ built in X.XXs

**This created a `dist` folder** in your project:

```
📁 cstle-livn-website/
   ├── 📁 dist/           ← NEW! Production files
   │   ├── index.html
   │   └── assets/
   ├── 📄 App.tsx
   └── ... (other files)
```

---

### Step 2: Find the dist Folder

**Open Finder (Mac) or File Explorer (Windows)**

**Navigate to:**
```
Downloads → cstle-livn-website → dist
```

**You should see:**

```
📁 dist/
   ├── 📄 index.html
   ├── 📁 assets/
   │   ├── index-abc123.css
   │   └── index-def456.js
   └── 📄 vite.svg
```

**Keep this window open!** You'll need it in a moment.

---

### Step 3: Create Netlify Account

**Open browser, go to:**
```
https://app.netlify.com/drop
```

**You'll see:**

```
┌─────────────────────────────────────────────┐
│  Netlify                                    │
├─────────────────────────────────────────────┤
│                                             │
│   Want to deploy a new site without        │
│   connecting to Git?                        │
│                                             │
│   Drag and drop your site output folder     │
│   here                                      │
│                                             │
│   ┌───────────────────────────────────┐    │
│   │                                   │    │
│   │     Drop Your Site Folder Here    │    │
│   │                                   │    │
│   │           or click to browse      │    │
│   │                                   │    │
│   └───────────────────────────────────┘    │
│                                             │
│   Need an account?  [Sign up] (free)       │
└─────────────────────────────────────────────┘
```

**If not logged in:**
1. Click **"Sign up"**
2. Choose GitHub, GitLab, Bitbucket, or Email
3. Create free account
4. Return to [app.netlify.com/drop](https://app.netlify.com/drop)

---

### Step 4: Deploy Your Site

**Drag the `dist` folder** from your file browser to the Netlify page:

```
┌─────────────────────────────────────────────┐
│  Finder/Explorer                            │
│                                             │
│  📁 dist/                                   │
│     ├── index.html                          │
│     └── assets/                             │
│                                             │
└─────────────────────────────────────────────┘
                    ↓
                  DRAG
                    ↓
┌─────────────────────────────────────────────┐
│  Netlify Drop Zone                          │
│                                             │
│   Drop Your Site Folder Here                │
│                                             │
└─────────────────────────────────────────────┘
```

**You'll see:**

```
┌─────────────────────────────────────────────┐
│  Uploading site...                          │
│                                             │
│  ████████████░░░░░░ 65%                     │
│                                             │
│  Uploading index.html...                    │
│  Uploading assets...                        │
│                                             │
└─────────────────────────────────────────────┘
```

**Wait 1-2 minutes...**

**Then you'll see:**

```
┌─────────────────────────────────────────────┐
│  🎉 Deploy complete!                        │
│                                             │
│  Your site is live at:                      │
│  https://adorable-unicorn-123abc.netlify.app│
│                                             │
│  [Visit Site]  [Site Settings]              │
└─────────────────────────────────────────────┘
```

🎉 **Your website is now LIVE on the internet!**

---

### Step 5: Access Your Live Admin Panel

**Copy the URL Netlify gave you**, for example:
```
https://adorable-unicorn-123abc.netlify.app
```

**Add `/#/admin-setup` to the end:**
```
https://adorable-unicorn-123abc.netlify.app/#/admin-setup
```

**Open in browser** → You'll see the admin setup page!

**Create your account** (same as before)

**Log in at:**
```
https://adorable-unicorn-123abc.netlify.app/#/admin
```

✅ **Your live admin panel is working!**

---

### Step 6: Customize Your URL (Optional)

**In Netlify dashboard:**

```
┌─────────────────────────────────────────────┐
│  Site Overview                              │
│                                             │
│  adorable-unicorn-123abc                    │
│  [Change site name]                         │
│                                             │
└─────────────────────────────────────────────┘
```

**Click "Change site name"**

**Enter new name:**
```
┌───────────────────────────────────┐
│ Site name                         │
│ [cstle-livn_____________]         │
│                                   │
│ Will become:                      │
│ cstle-livn.netlify.app            │
│                                   │
│ [Save]                            │
└───────────────────────────────────┘
```

**Click Save**

**Your new URL:**
```
https://cstle-livn.netlify.app
```

Much better! ✅

---

## 🎯 Final Checklist

After completing either path:

### Local Development (Path A)
- [ ] Node.js installed
- [ ] Project downloaded and extracted
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server running (`npm run dev`)
- [ ] Can access `http://localhost:5173/#/admin-setup`
- [ ] Admin account created
- [ ] Can log in at `http://localhost:5173/#/admin`
- [ ] Can upload images, add FAQs, etc.

### Live Deployment (Path B)
- [ ] Production build created (`npm run build`)
- [ ] Netlify account created
- [ ] Site deployed (dragged `dist` folder)
- [ ] Can access `https://your-site.netlify.app/#/admin-setup`
- [ ] Admin account created on live site
- [ ] Can log in on live site
- [ ] Can manage content on live site
- [ ] (Optional) Custom site name set

---

## 🔄 Next Time You Need to Make Changes

### For Development:
```bash
cd path/to/cstle-livn-website
npm run dev
# Open http://localhost:5173
# Make changes
# Ctrl+C to stop
```

### For Deployment:
```bash
npm run build
# Drag new dist folder to Netlify
# (Or set up Git auto-deploy)
```

---

## 📱 All Your URLs

### Local Development:
```
Homepage:     http://localhost:5173/
Admin Setup:  http://localhost:5173/#/admin-setup
Admin Panel:  http://localhost:5173/#/admin
Gallery:      http://localhost:5173/#/gallery
Reviews:      http://localhost:5173/#/reviews
FAQ:          http://localhost:5173/#/faq
Contact:      http://localhost:5173/#/contact
```

### Live Production:
```
Homepage:     https://cstle-livn.netlify.app/
Admin Setup:  https://cstle-livn.netlify.app/#/admin-setup
Admin Panel:  https://cstle-livn.netlify.app/#/admin
Gallery:      https://cstle-livn.netlify.app/#/gallery
Reviews:      https://cstle-livn.netlify.app/#/reviews
FAQ:          https://cstle-livn.netlify.app/#/faq
Contact:      https://cstle-livn.netlify.app/#/contact
```

---

## 🆘 Quick Troubleshooting

### "npm: command not found"
→ Install Node.js from [nodejs.org](https://nodejs.org)

### "Cannot find module"
→ Run `npm install` in your project folder

### Admin page is blank
→ Press F12, check Console tab for errors

### Can't upload images
→ Check file size (under 10MB) and format (JPEG/PNG/WebP)

---

## 🎊 You Did It!

You now have:
- ✅ A fully functional website
- ✅ An admin panel to manage content
- ✅ The ability to run it locally
- ✅ (Optional) A live website on the internet

**No more Figma hosting issues!** 🎉

---

**Need more help?** Check out:
- `START-HERE.md` - Quick start guide
- `LOCAL-DEVELOPMENT-SETUP.md` - Detailed setup
- `GET-STARTED.md` - How to use the CMS
- `FIGMA-HOSTING-WORKAROUND.md` - Deployment options

**Happy managing!** 🚀

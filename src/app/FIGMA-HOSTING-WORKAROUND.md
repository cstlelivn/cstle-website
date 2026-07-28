# 🔧 Figma Hosting Workaround

## The Issue

Your website is currently hosted at:
```
https://loud-rename-20379962.figma.site/#/
```

When you try to access the admin panel:
```
https://loud-rename-20379962.figma.site/#/admin-setup
```

**You're getting a 404 or blank page.** This is because Figma's hosting platform (`figma.site`) is designed for **static design prototypes**, not full React applications with:
- React Router for page navigation
- Supabase backend database
- Admin authentication
- File uploads

---

## 🎯 Immediate Solutions

### Solution 1: Run Locally on Your Computer (FASTEST)

**Time Required:** 5 minutes

1. **Download Node.js**
   - Go to [nodejs.org](https://nodejs.org)
   - Download and install the LTS version
   - Verify: Open Terminal/Command Prompt and type `node --version`

2. **Download Your Project**
   - In Figma Make, export/download your project files
   - Extract the ZIP to a folder on your computer

3. **Open Terminal/Command Prompt**
   - **Mac:** Press `Cmd + Space`, type "Terminal"
   - **Windows:** Press `Win + R`, type "cmd"

4. **Navigate to Your Project**
   ```bash
   cd path/to/your/project
   ```
   Example:
   ```bash
   cd Downloads/cstle-livn-website
   ```

5. **Install Dependencies**
   ```bash
   npm install
   ```
   (Wait 1-3 minutes)

6. **Start the Server**
   ```bash
   npm run dev
   ```

7. **Open Your Browser**
   - You'll see: `Local: http://localhost:5173/`
   - Visit: `http://localhost:5173/#/admin-setup`
   - **Your admin panel works!** ✅

---

### Solution 2: Deploy to Netlify (BEST FOR PRODUCTION)

**Time Required:** 10 minutes
**Cost:** Free

Netlify is a professional hosting platform that fully supports React applications.

#### Quick Deploy Steps:

1. **Run Locally First** (follow Solution 1 above)

2. **Build Production Version**
   ```bash
   npm run build
   ```
   This creates a `dist` folder.

3. **Deploy to Netlify**
   - Go to [app.netlify.com/drop](https://app.netlify.com/drop)
   - Sign up (free)
   - **Drag the `dist` folder** onto the page
   - Netlify uploads and gives you a URL

4. **Access Your Admin**
   - Your new URL: `https://your-site-name.netlify.app`
   - Admin panel: `https://your-site-name.netlify.app/#/admin-setup`
   - **Everything works!** ✅

#### Custom Domain (Optional):
In Netlify dashboard:
- Domain settings → Add custom domain
- Point `cstlelivn.com` (or your domain) to Netlify
- Get free SSL certificate

---

### Solution 3: Deploy to Vercel

**Alternative to Netlify, equally good**

1. Go to [vercel.com](https://vercel.com)
2. Sign up (free)
3. Click "Add New Project"
4. Upload your project or connect GitHub
5. Vercel auto-detects Vite and deploys
6. Get URL like `https://cstle-livn.vercel.app`

---

## 🤔 Why Doesn't Figma Hosting Work?

| Feature | Figma Hosting | Netlify/Vercel | Local Dev |
|---------|---------------|----------------|-----------|
| **Static HTML** | ✅ Yes | ✅ Yes | ✅ Yes |
| **React Router** | ❌ No | ✅ Yes | ✅ Yes |
| **API Calls** | ⚠️ Limited | ✅ Yes | ✅ Yes |
| **File Uploads** | ❌ No | ✅ Yes | ✅ Yes |
| **Hash Routing (#/)** | ⚠️ Partial | ✅ Yes | ✅ Yes |
| **Supabase Backend** | ⚠️ Limited | ✅ Yes | ✅ Yes |

**Bottom Line:** Figma hosting is great for showing designs to clients, but you need proper web hosting for a functional CMS application.

---

## 📋 Step-by-Step: Complete Netlify Setup

### Part 1: Setup Local Environment

1. **Install Node.js**
   - Download from [nodejs.org](https://nodejs.org)
   - Choose LTS version (recommended)
   - Install with default settings

2. **Verify Installation**
   Open Terminal/Command Prompt:
   ```bash
   node --version
   # Should show: v18.x.x or v20.x.x
   
   npm --version
   # Should show: 9.x.x or 10.x.x
   ```

3. **Download Your Project**
   - In Figma Make: Export project
   - Save ZIP file
   - Extract to folder (e.g., `cstle-livn-website`)

4. **Open Project in Terminal**
   ```bash
   cd path/to/cstle-livn-website
   ```

5. **Install Dependencies**
   ```bash
   npm install
   ```
   You'll see lots of text scrolling - this is normal!
   Wait for "added XXX packages" message.

6. **Test Locally**
   ```bash
   npm run dev
   ```
   
   Look for:
   ```
   ➜  Local:   http://localhost:5173/
   ```

7. **Open Browser**
   - Go to: `http://localhost:5173/#/admin-setup`
   - You should see the admin setup form!
   - If yes: **Local setup works!** ✅

### Part 2: Deploy to Netlify

8. **Build for Production**
   ```bash
   npm run build
   ```
   
   This creates a `dist` folder with optimized files.
   Look for "✓ built in XXXms" message.

9. **Create Netlify Account**
   - Go to [netlify.com](https://netlify.com)
   - Click "Sign up"
   - Use GitHub, GitLab, or email

10. **Deploy Your Site**
    - Go to [app.netlify.com/drop](https://app.netlify.com/drop)
    - Find the `dist` folder on your computer
    - **Drag the folder** onto the Netlify page
    - Wait for upload (1-2 minutes)

11. **Get Your URL**
    Netlify gives you a URL like:
    ```
    https://adorable-unicorn-123abc.netlify.app
    ```

12. **Test Your Live Site**
    - Visit: `https://your-url.netlify.app/#/admin-setup`
    - **Your admin panel is live!** 🎉

13. **Customize Your URL** (Optional)
    - In Netlify: Site settings → Domain management
    - Click "Change site name"
    - Choose: `cstle-livn` → Becomes `cstle-livn.netlify.app`

### Part 3: Connect Custom Domain (Optional)

14. **Add Your Domain**
    - In Netlify: Domain settings → Add custom domain
    - Enter: `cstlelivn.com` (your domain)
    - Follow DNS configuration instructions

15. **Enable HTTPS**
    - Netlify automatically provides free SSL
    - Your site will be `https://cstlelivn.com`

---

## 🚨 Common Errors & Fixes

### Error: "npm: command not found"
**Cause:** Node.js not installed
**Fix:** Install Node.js from [nodejs.org](https://nodejs.org)

### Error: "Cannot find module 'vite'"
**Cause:** Dependencies not installed
**Fix:** 
```bash
npm install
```

### Error: "Port 5173 already in use"
**Cause:** Server already running
**Fix:** 
- Find the existing terminal window running `npm run dev` and stop it (Ctrl+C)
- Or use different port: `npm run dev -- --port 3000`

### Error: "dist folder not found" (during Netlify deploy)
**Cause:** Forgot to run build
**Fix:**
```bash
npm run build
```

### Error: "Failed to fetch" (in admin panel)
**Cause:** Supabase credentials missing
**Fix:** 
- Check `/utils/supabase/info.tsx` has correct values
- Verify Supabase project is active

### Error: Admin page is blank
**Cause:** JavaScript error or routing issue
**Fix:**
- Open browser DevTools (F12)
- Check Console tab for errors
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

---

## 💡 What Each Command Does

| Command | Purpose |
|---------|---------|
| `npm install` | Downloads all libraries (React, Tailwind, Supabase, etc.) |
| `npm run dev` | Starts local development server at http://localhost:5173 |
| `npm run build` | Creates optimized production files in `dist` folder |
| `npm run preview` | Preview the production build locally |

---

## 🎯 Recommended Workflow

### For Development (Making Changes):
```bash
npm run dev
# Edit files in your code editor
# See changes instantly in browser
# Press Ctrl+C to stop server
```

### For Deployment (Going Live):
```bash
npm run build
# Upload dist folder to Netlify
# Site goes live in 1-2 minutes
```

### For Updates (After Making Changes):
```bash
npm run build
# Delete old deployment in Netlify
# Drag new dist folder to Netlify
```

**OR** connect GitHub for automatic deployments:
- Push code to GitHub
- Netlify auto-deploys on every push
- No manual uploads needed!

---

## 📊 Comparison: Hosting Options

| Platform | Free Tier | Custom Domain | SSL | Build Time | Best For |
|----------|-----------|---------------|-----|------------|----------|
| **Figma Hosting** | ✅ Yes | ❌ No | ✅ Yes | N/A | Static prototypes only |
| **Netlify** | ✅ Yes | ✅ Yes | ✅ Free | Fast | Full React apps (RECOMMENDED) |
| **Vercel** | ✅ Yes | ✅ Yes | ✅ Free | Fastest | Full React apps (also good) |
| **GitHub Pages** | ✅ Yes | ✅ Yes | ✅ Free | Medium | Static sites (limited) |
| **Local Dev** | ✅ Free | ❌ No | ❌ No | Instant | Development & testing |

**Recommendation:** Use **Local Dev** for testing, deploy to **Netlify** for production.

---

## 🔗 Useful Links

- **Node.js Download:** [nodejs.org](https://nodejs.org)
- **Netlify:** [netlify.com](https://netlify.com)
- **Vercel:** [vercel.com](https://vercel.com)
- **VS Code (Code Editor):** [code.visualstudio.com](https://code.visualstudio.com)
- **Supabase Dashboard:** [app.supabase.com](https://app.supabase.com)

---

## ✅ Success Checklist

Before considering your site "production ready," verify:

- [ ] Local development works (`npm run dev`)
- [ ] Can access admin panel locally (`localhost:5173/#/admin-setup`)
- [ ] Created admin account
- [ ] Uploaded at least one gallery image
- [ ] Added at least one FAQ
- [ ] Updated contact information
- [ ] Production build works (`npm run build`)
- [ ] Deployed to Netlify
- [ ] Can access live admin panel
- [ ] Tested all pages on live site
- [ ] Disabled `/admin-setup` route (for security)
- [ ] Set up custom domain (optional)

---

## 🎊 Next Steps

Once your site is live on Netlify:

1. **Create your admin account** at `https://your-site.netlify.app/#/admin-setup`
2. **Log in** at `https://your-site.netlify.app/#/admin`
3. **Add content** (gallery, FAQs, update contact info)
4. **Test public pages** to verify everything displays correctly
5. **Share your website** with the world! 🚀

---

## 🆘 Still Need Help?

If you're stuck:

1. **Check all documentation:**
   - `/LOCAL-DEVELOPMENT-SETUP.md` - Full setup guide
   - `/GET-STARTED.md` - Quick start guide
   - `/CMS-SETUP-GUIDE.md` - CMS instructions
   - `/QUICK-REFERENCE.md` - Quick reference

2. **Common issues:**
   - Make sure Node.js is installed: `node --version`
   - Make sure you ran `npm install`
   - Check for typos in commands
   - Verify you're in the correct folder: `ls` (Mac) or `dir` (Windows)

3. **Browser console:**
   - Press F12 in your browser
   - Click "Console" tab
   - Look for red error messages
   - Share these errors when asking for help

---

**Good luck! You've got this!** 💪

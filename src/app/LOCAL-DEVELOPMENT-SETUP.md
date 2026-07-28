# 💻 Local Development Setup Guide

## 🎯 Quick Start - Get Running in 2 Minutes!

Your Cstle Livn website is a React application that runs in your browser through **Figma Make**. Here's how to access your admin panel RIGHT NOW:

---

## ✅ Option 1: Using Figma Make Preview (EASIEST)

### What You're Looking At
You're currently viewing your website in **Figma Make's preview environment**. This is a live, running version of your React application!

### Access Your Admin Panel NOW:

1. **Look at your current URL** - It should be something like:
   ```
   https://loud-rename-20379962.figma.site/#/
   ```

2. **Add `admin-setup` to the end:**
   ```
   https://loud-rename-20379962.figma.site/#/admin-setup
   ```

3. **Press Enter**

4. **You should see the Admin Setup page!** ✅

### If That Doesn't Work:

The Figma Make preview environment should support React Router, but if you're getting a 404 or blank page, you need to **deploy to proper hosting** (see Option 2 below).

---

## 🚀 Option 2: Deploy to Netlify (RECOMMENDED for Production)

Figma's hosting (`figma.site`) is designed for static prototypes, not full React apps with databases. For your admin panel to work reliably, deploy to proper hosting:

### Step-by-Step Netlify Deployment:

#### 1. **Download Your Project Files**

In Figma Make:
- Click the **Export** or **Download** button (usually in the top-right)
- Save the ZIP file to your computer
- Extract the ZIP file to a folder (e.g., `cstle-livn-website`)

#### 2. **Install Node.js** (if you don't have it)

- Go to [nodejs.org](https://nodejs.org)
- Download the **LTS version** (recommended)
- Install it
- Verify by opening **Terminal** (Mac) or **Command Prompt** (Windows) and typing:
  ```bash
  node --version
  npm --version
  ```
  You should see version numbers!

#### 3. **Open Terminal/Command Prompt**

- **Mac:** Press `Cmd + Space`, type "Terminal", press Enter
- **Windows:** Press `Win + R`, type "cmd", press Enter
- **Navigate to your project folder:**
  ```bash
  cd path/to/cstle-livn-website
  ```
  
  Example:
  ```bash
  cd Downloads/cstle-livn-website
  ```

#### 4. **Install Dependencies**

Run this command:
```bash
npm install
```

This will download all the libraries your website needs (React, Supabase, etc.). It takes 1-3 minutes.

#### 5. **Test Locally First**

Run this command:
```bash
npm run dev
```

You should see output like:
```
  VITE v4.x.x  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

#### 6. **Open in Browser**

1. Open your web browser
2. Go to: `http://localhost:5173/#/admin-setup`
3. **You should see the Admin Setup page!** 🎉

#### 7. **Build for Production**

Once you've confirmed it works locally, build the production version:

```bash
npm run build
```

This creates a `dist` folder with optimized files ready for deployment.

#### 8. **Deploy to Netlify**

**Option A: Drag & Drop (Easiest)**
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Sign up (free)
3. Drag the `dist` folder onto the page
4. Netlify uploads and gives you a URL like `https://your-site-name.netlify.app`
5. Visit `https://your-site-name.netlify.app/#/admin-setup`
6. **Your admin panel is now live!** ✅

**Option B: Connect to GitHub (Better for updates)**
1. Push your code to GitHub
2. Go to [app.netlify.com](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub and select your repository
5. Configure:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Click "Deploy"
7. Your site is live!

---

## 💻 Option 3: Full Local Development Setup

If you want to develop and make changes locally on your computer:

### Prerequisites:
- ✅ Node.js installed (see Option 2, Step 2)
- ✅ Code editor (VS Code recommended: [code.visualstudio.com](https://code.visualstudio.com))
- ✅ Project files downloaded from Figma Make

### Setup Steps:

#### 1. **Open Your Project in VS Code**
```bash
cd path/to/cstle-livn-website
code .
```

#### 2. **Install Dependencies**
```bash
npm install
```

#### 3. **Check Environment Variables**

Your Supabase credentials should already be configured in Figma Make. If you're running locally and getting connection errors:

1. Check if there's a `.env` file in your project root
2. It should contain:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

These values are in `/utils/supabase/info.tsx`:
```tsx
export const projectId = 'your-project-id';
export const publicAnonKey = 'your-anon-key';
```

#### 4. **Start Development Server**
```bash
npm run dev
```

#### 5. **Open Your Website**

Your terminal will show:
```
➜  Local:   http://localhost:5173/
```

**Access your pages:**
- Homepage: `http://localhost:5173/`
- Admin Setup: `http://localhost:5173/#/admin-setup`
- Admin Panel: `http://localhost:5173/#/admin`
- Gallery: `http://localhost:5173/#/gallery`
- Reviews: `http://localhost:5173/#/reviews`
- FAQ: `http://localhost:5173/#/faq`
- Contact: `http://localhost:5173/#/contact`

#### 6. **Make Changes**

Edit any file in VS Code, save, and the browser will **auto-reload** with your changes! ⚡

---

## 🛠️ Development Commands

| Command | What It Does |
|---------|-------------|
| `npm install` | Install all dependencies (run once) |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

---

## 📁 Project Structure

```
cstle-livn-website/
├── App.tsx              # Main app with routes
├── pages/               # All page components
│   ├── Home.tsx
│   ├── Gallery.tsx
│   ├── Admin.tsx
│   ├── AdminSetup.tsx
│   └── ...
├── components/          # Reusable components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ui/             # Shadcn UI components
├── content/             # Editable content files
│   ├── site-info.ts
│   ├── home-content.ts
│   └── ...
├── styles/              # CSS files
│   └── globals.css
├── supabase/            # Backend server
│   └── functions/
│       └── server/
│           └── index.tsx
└── utils/               # Helper functions
    └── supabase/
        └── info.tsx     # Supabase config
```

---

## 🔧 Troubleshooting

### Problem: "npm: command not found"
**Solution:** Install Node.js from [nodejs.org](https://nodejs.org)

### Problem: "Cannot find module..."
**Solution:** 
```bash
rm -rf node_modules package-lock.json
npm install
```

### Problem: "Port 5173 already in use"
**Solution:** 
- Kill the existing process
- Or run on different port: `npm run dev -- --port 3000`

### Problem: Admin page is blank
**Solution:**
- Check browser console for errors (F12)
- Verify Supabase credentials in `/utils/supabase/info.tsx`
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Problem: Images won't upload
**Solution:**
- Check Supabase Storage is configured
- Verify file size (under 10MB)
- Check browser console for specific error

### Problem: Can't log in to admin
**Solution:**
- First create account at `/#/admin-setup`
- Check email/password are correct
- Open browser DevTools (F12) → Console tab for errors

---

## 🌐 URLs Reference

### Development (Local):
```
Homepage:     http://localhost:5173/
Admin Setup:  http://localhost:5173/#/admin-setup
Admin Panel:  http://localhost:5173/#/admin
Gallery:      http://localhost:5173/#/gallery
Reviews:      http://localhost:5173/#/reviews
FAQ:          http://localhost:5173/#/faq
Contact:      http://localhost:5173/#/contact
Book Service: http://localhost:5173/#/book
Our Mission:  http://localhost:5173/#/mission
```

### Production (After Deployment):
```
Homepage:     https://your-site.netlify.app/
Admin Setup:  https://your-site.netlify.app/#/admin-setup
Admin Panel:  https://your-site.netlify.app/#/admin
Gallery:      https://your-site.netlify.app/#/gallery
Reviews:      https://your-site.netlify.app/#/reviews
FAQ:          https://your-site.netlify.app/#/faq
Contact:      https://your-site.netlify.app/#/contact
Book Service: https://your-site.netlify.app/#/book
Our Mission:  https://your-site.netlify.app/#/mission
```

---

## ✅ First Steps After Setup

### 1. Create Admin Account
- Go to `/#/admin-setup`
- Create your account
- **IMPORTANT:** After creating, disable the route for security (see Security section below)

### 2. Log In
- Go to `/#/admin`
- Use your credentials

### 3. Add Content
- Upload gallery images
- Add FAQs
- Update contact info
- Review incoming customer reviews

### 4. Test Public Pages
- Visit `/#/gallery` to see your images
- Visit `/#/faq` to see your FAQs
- Visit `/#/reviews` to see customer reviews

---

## 🔒 Security: Disable Admin Setup After First Use

After you create your first admin account, **disable the signup route** to prevent others from creating accounts:

### Option 1: Comment Out the Route
1. Open `/App.tsx`
2. Find line 24:
   ```tsx
   <Route path="/admin-setup" element={<AdminSetup />} />
   ```
3. Comment it out:
   ```tsx
   {/* <Route path="/admin-setup" element={<AdminSetup />} /> */}
   ```
4. Save the file

### Option 2: Remove Import (More Secure)
1. Open `/App.tsx`
2. Remove line 10:
   ```tsx
   import { AdminSetup } from "./pages/AdminSetup";
   ```
3. Remove line 24:
   ```tsx
   <Route path="/admin-setup" element={<AdminSetup />} />
   ```
4. Save the file

You can always re-enable it later if needed!

---

## 🎯 Quick Reference

**I want to...**

| Task | How To |
|------|--------|
| Run website locally | `npm run dev` → Visit `localhost:5173` |
| Access admin panel | `localhost:5173/#/admin` |
| Create admin account | `localhost:5173/#/admin-setup` |
| Make code changes | Edit files in VS Code, auto-reloads |
| Deploy to production | `npm run build` → Upload `dist` to Netlify |
| Update content | Log in to `/#/admin` → Use admin panel |
| View database | Open Supabase dashboard |

---

## 📚 Additional Resources

- **Quick Start:** `/GET-STARTED.md`
- **CMS Guide:** `/CMS-SETUP-GUIDE.md`
- **Quick Reference:** `/QUICK-REFERENCE.md`
- **Guidelines:** `/guidelines/Guidelines.md`

---

## 🎊 You're Ready!

Your local development environment is now set up! You can:
- ✅ Run the website on your computer
- ✅ Access the admin panel
- ✅ Make changes and see them instantly
- ✅ Deploy to production when ready

**Happy developing!** 🚀

---

## 💡 Pro Tips

1. **Use VS Code Extensions:**
   - ES7+ React/Redux/React-Native snippets
   - Tailwind CSS IntelliSense
   - Prettier - Code formatter

2. **Git Version Control:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. **Environment Variables:**
   - Never commit `.env` files
   - Keep API keys secret
   - Use `.env.example` for templates

4. **Performance:**
   - Images: Use WebP format
   - Always optimize images before uploading
   - Test on mobile devices

5. **Backup:**
   - Export database regularly from Supabase
   - Keep screenshots of important content
   - Use Git for code backups

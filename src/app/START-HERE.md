# 🚀 START HERE - Your Admin Panel in 3 Steps

## ⚡ Fastest Path to Your Admin Panel

Your website URL: `https://loud-rename-20379962.figma.site/#/`

---

## 🎯 Try This First (30 Seconds)

Add `admin-setup` to your URL:
```
https://loud-rename-20379962.figma.site/#/admin-setup
```

**Does it work?** 
- ✅ **YES** → Skip to "Create Account" below
- ❌ **NO (404/blank page)** → Follow "Plan B" below

---

## 🔴 Plan B: Run on Your Computer (5 Minutes)

### You'll Need:
1. **Node.js** - [Download here](https://nodejs.org) (choose LTS)
2. **Your project files** - Export from Figma Make
3. **Terminal/Command Prompt** - Built into your computer

### Steps:

#### 1️⃣ Open Terminal
- **Mac:** Press `Cmd + Space` → type "Terminal" → Enter
- **Windows:** Press `Win + R` → type "cmd" → Enter

#### 2️⃣ Go to Your Project Folder
```bash
cd Downloads/cstle-livn-website
```
*(Replace with your actual folder path)*

#### 3️⃣ Run These 2 Commands
```bash
npm install
```
Wait 1-3 minutes, then:
```bash
npm run dev
```

#### 4️⃣ Open Your Browser
Look for this in Terminal:
```
➜  Local:   http://localhost:5173/
```

Go to:
```
http://localhost:5173/#/admin-setup
```

**🎉 Your admin panel is now working!**

---

## ✅ Create Your Admin Account

Once you can see the admin setup page:

1. **Fill out the form:**
   - Full Name: Your name
   - Email: Your email
   - Password: At least 6 characters
   - Confirm Password: Same password

2. **Click "Create Admin Account"**

3. **Log in at:**
   ```
   http://localhost:5173/#/admin
   ```
   (Or on live site: `https://your-site.netlify.app/#/admin`)

4. **Start managing your website!**

---

## 🎨 What You Can Do in Admin Panel

### Reviews Tab
- View customer reviews
- Delete spam
- Toggle approval (hide/show reviews)

### Gallery Tab
- Upload project photos
- Add title and category
- Delete images
- Changes appear instantly on `/#/gallery`

### FAQs Tab
- Add new questions/answers
- Edit existing FAQs
- Delete FAQs
- Organize by category
- Changes appear instantly on `/#/faq`

### Site Info Tab
- Update contact email/phone
- Change business hours
- Update service area
- Changes appear instantly on `/#/contact`

---

## 🌐 Want a Real Website URL?

### Deploy to Netlify (Free)

**Why?** Get a real URL like `https://cstle-livn.netlify.app` instead of localhost

**How?**
1. In Terminal:
   ```bash
   npm run build
   ```

2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)

3. Sign up (free)

4. Drag the `dist` folder to Netlify

5. Get your live URL in 2 minutes!

**Full instructions:** See `/FIGMA-HOSTING-WORKAROUND.md`

---

## 📱 All Your Website Pages

| Page | Local URL | Live URL |
|------|-----------|----------|
| **Home** | `http://localhost:5173/` | `https://your-site.netlify.app/` |
| **Gallery** | `http://localhost:5173/#/gallery` | `https://your-site.netlify.app/#/gallery` |
| **Reviews** | `http://localhost:5173/#/reviews` | `https://your-site.netlify.app/#/reviews` |
| **FAQ** | `http://localhost:5173/#/faq` | `https://your-site.netlify.app/#/faq` |
| **Contact** | `http://localhost:5173/#/contact` | `https://your-site.netlify.app/#/contact` |
| **Book Service** | `http://localhost:5173/#/book` | `https://your-site.netlify.app/#/book` |
| **Our Mission** | `http://localhost:5173/#/mission` | `https://your-site.netlify.app/#/mission` |
| **Admin Setup** | `http://localhost:5173/#/admin-setup` | `https://your-site.netlify.app/#/admin-setup` |
| **Admin Panel** | `http://localhost:5173/#/admin` | `https://your-site.netlify.app/#/admin` |

---

## 🆘 Troubleshooting

### "npm: command not found"
**Fix:** Install Node.js from [nodejs.org](https://nodejs.org)

### "Cannot find module"
**Fix:** Make sure you ran `npm install` first

### Admin page is blank
**Fix:** 
1. Press F12 in browser
2. Click "Console" tab
3. Look for errors (red text)

### Can't log in
**Fix:** 
1. Create account first at `/#/admin-setup`
2. Check email/password spelling
3. Password must be 6+ characters

---

## 📚 More Help

| Document | What It's For |
|----------|---------------|
| **`START-HERE.md`** | This file - quick start |
| **`LOCAL-DEVELOPMENT-SETUP.md`** | Detailed setup guide |
| **`FIGMA-HOSTING-WORKAROUND.md`** | Why Figma hosting doesn't work + fixes |
| **`GET-STARTED.md`** | How to use the CMS |
| **`CMS-SETUP-GUIDE.md`** | Complete CMS documentation |
| **`QUICK-REFERENCE.md`** | Quick reference card |

---

## ✅ Quick Checklist

- [ ] Tried accessing `/#/admin-setup` on Figma URL
- [ ] Installed Node.js
- [ ] Downloaded project files
- [ ] Ran `npm install`
- [ ] Ran `npm run dev`
- [ ] Opened `http://localhost:5173/#/admin-setup` in browser
- [ ] Created admin account
- [ ] Logged in at `/#/admin`
- [ ] Uploaded first gallery image
- [ ] Added first FAQ
- [ ] Updated contact info

---

## 🎯 What's Next?

### For Development & Testing:
Keep using `http://localhost:5173` - it's fast and works offline!

### For Sharing with Others:
Deploy to Netlify - get a real URL people can visit!

### For Custom Domain:
Deploy to Netlify, then add your domain (like `cstlelivn.com`)

---

## 💡 Pro Tips

1. **Bookmark your admin panel** (local or live)
2. **Keep Terminal window open** while developing
3. **Press Ctrl+C** in Terminal to stop the server
4. **Hard refresh** browser if changes don't appear (Ctrl+Shift+R)
5. **Check browser console** (F12) if something breaks

---

## 🎊 You're All Set!

Once you're logged into the admin panel, you can:
- Upload unlimited gallery images
- Add/edit/delete FAQs
- Manage customer reviews
- Update all contact information

**Every change appears instantly on your website!**

No coding required! 🚀

---

**Still stuck?** Read the detailed guides in the file list above. They have step-by-step instructions with screenshots and explanations.

**Ready to go?** Follow the "Plan B" steps above to get your admin panel running in the next 5 minutes!

Good luck! 💪

# Cstle Livn CMS Setup & User Guide

## 🎯 What You Now Have

Your website now has a **complete Content Management System (CMS)** that allows non-technical users to:

- ✅ **Manage Reviews** - View, approve, and delete customer reviews
- ✅ **Manage Gallery** - Upload new project images, add titles/categories, delete items
- ✅ **Manage FAQs** - Add, edit, and delete frequently asked questions
- ✅ **Update Site Information** - Change contact details, business hours, service area
- ✅ **Auto-Approval** - Reviews submitted by customers automatically appear on the website

## 🚀 Getting Started (First Time Setup)

### Step 1: Create Your Admin Account

1. Visit: `your-website.com/#/admin-setup`
2. Fill in the form:
   - Full Name (e.g., "John Smith")
   - Email Address (e.g., "admin@cstlelivn.com")
   - Password (minimum 6 characters)
   - Confirm Password
3. Click "Create Admin Account"
4. You'll see a success message
5. Click "Go to Admin Login"

**IMPORTANT:** After creating your admin account, you should remove the `/admin-setup` route from `/App.tsx` for security:

```tsx
// Remove this line from App.tsx:
<Route path="/admin-setup" element={<AdminSetup />} />
```

### Step 2: Log In to Admin Panel

1. Visit: `your-website.com/#/admin`
2. Enter your email and password
3. Click "Login"

You're now in the admin dashboard!

## 📋 How to Use the Admin Panel

### Managing Reviews

**View All Reviews:**
- Click the "Reviews" tab
- You'll see all reviews submitted by customers
- Each review shows: name, role, rating, text, and submission date

**Delete a Review:**
- Click the "Delete" button next to any review
- Confirm deletion

**Approve/Unapprove Reviews:**
- Reviews are automatically approved and shown on the website
- If you want to hide a review without deleting it, click "Approved" to toggle it off
- Click again to re-approve

**How Customers Submit Reviews:**
- Customers visit `your-website.com/#/reviews`
- They fill out the review form at the bottom of the page
- Once submitted, the review **automatically appears** on the reviews page
- No admin action needed (auto-approved by default)

---

### Managing Gallery

**Add a New Gallery Item:**

1. Click the "Gallery" tab
2. Scroll to "Add New Gallery Item" section
3. Fill in:
   - **Title** - Project name (e.g., "Modern Kitchen Installation")
   - **Category** - Room type (e.g., "Kitchen", "Bathroom", "Living Room")
   - **Image** - Click "Choose File" and select an image (JPEG, PNG, or WebP)
4. Click "Add Gallery Item"
5. Wait for upload to complete (may take a few seconds for large images)
6. Your new gallery item will appear on the website immediately!

**Delete a Gallery Item:**
- Scroll down to see all gallery items
- Click "Delete" under the item you want to remove
- Confirm deletion
- The item and image will be permanently removed

**Image Guidelines:**
- Supported formats: JPEG, PNG, WebP
- Maximum file size: 10MB
- Recommended: High-quality images at 1920x1080 or similar resolution
- Images will be displayed in a grid on the gallery page

---

### Managing FAQs

**Add a New FAQ:**

1. Click the "FAQs" tab
2. Fill in the form:
   - **Category** - Group name (e.g., "Services", "Pricing", "Timeline")
   - **Question** - The question customers ask
   - **Answer** - Your detailed answer
   - **Display Order** - Number to control order (0 = first, 1 = second, etc.)
3. Click "Add FAQ"

**Edit an FAQ:**
- Click "Edit" next to any FAQ
- The form will populate with that FAQ's data
- Make your changes
- Click "Update FAQ"
- Or click "Cancel" to discard changes

**Delete an FAQ:**
- Click "Delete" next to any FAQ
- Confirm deletion

**Organizing FAQs:**
- Use the "Display Order" number to control which FAQs appear first
- Lower numbers appear first (0, 1, 2, 3...)
- FAQs with the same order number are sorted by creation date

---

### Managing Site Information

**Update Contact Details:**

1. Click the "Site Info" tab
2. Update any of these fields:
   - **Site Name** - Business name (default: "Cstle Livn")
   - **Tagline** - Slogan (default: "Install. Perfect. Finish.")
   - **Email** - Contact email
   - **Phone** - Contact phone number
   - **Service Area** - Geographic area you serve
   - **Business Hours:**
     - Weekdays schedule
     - Saturday schedule
     - Sunday schedule
3. Click "Update Site Information"
4. Changes appear across all pages that display this info

**Where This Info Appears:**
- Contact page
- Footer (on all pages)
- Any other page displaying contact information

---

## 🔐 Security & Access

**Admin Login:**
- Only people with admin accounts can log in at `/admin`
- Passwords are securely encrypted
- Sessions persist until you log out

**Creating Additional Admin Accounts:**
- Currently, additional admins can only be created through the setup page
- For security, remove the `/admin-setup` route after creating your first account
- To create more admins later, temporarily re-enable the route

**Logging Out:**
- Click "Logout" in the top right corner of the admin panel
- You'll be redirected to the login page

---

## 📱 Public-Facing Features

### Customer Review Submission

**How It Works:**
1. Customer visits the Reviews page (`/#/reviews`)
2. Scrolls to "Share Your Experience" section
3. Fills out:
   - Name
   - Email (optional, not displayed publicly)
   - Role (e.g., "Homeowner", "Contractor")
   - Rating (1-5 stars)
   - Review text
4. Clicks "Submit Review"
5. **Review automatically appears on the page** (no admin approval needed)

**Auto-Approval:**
- By default, all submitted reviews are auto-approved
- They instantly appear in the public reviews list
- You can delete spam or inappropriate reviews from the admin panel

---

## 🛠️ Technical Details

### Database Storage

All content is stored in Supabase:
- **Reviews** - Stored in key-value store with prefix `review:`
- **Gallery Items** - Metadata in key-value store (`gallery:`), images in Supabase Storage
- **FAQs** - Stored in key-value store with prefix `faq:`
- **Site Info** - Stored as single record with key `site:info`

### Image Storage

- Images are uploaded to Supabase Storage bucket: `make-6e189709-gallery`
- Images are private and accessed via signed URLs (secure, expire after 1 hour)
- When you delete a gallery item, the image is also deleted from storage

### Data Persistence

- All data persists in the database
- Changes are immediate - no manual refresh needed
- Data survives across deployments and sessions

---

## 💡 Tips & Best Practices

### For Gallery:
- Use high-quality, well-lit photos
- Keep titles concise and descriptive
- Use consistent category names (Kitchen, Bathroom, Living Room, etc.)
- Upload images regularly to keep the portfolio fresh

### For Reviews:
- Check reviews daily for spam or inappropriate content
- Respond to negative reviews offline before deleting
- Feature the best reviews prominently
- Consider adding a review request to your email signature

### For FAQs:
- Group related questions in the same category
- Keep answers concise but thorough
- Update FAQs based on common customer questions
- Use the order field to put most important questions first

### For Site Info:
- Keep contact information current
- Update business hours for holidays
- Use a professional email address
- Include area code in phone number

---

## 🆘 Troubleshooting

**Can't log in:**
- Check that you're using the correct email and password
- Passwords are case-sensitive
- Clear your browser cache and try again

**Images not uploading:**
- Check file size (must be under 10MB)
- Ensure file is JPEG, PNG, or WebP format
- Try compressing the image and re-uploading

**Reviews not appearing:**
- Check that the review was submitted successfully
- Refresh the page
- Check the admin panel - it may have been deleted

**Changes not showing:**
- Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)
- Clear browser cache
- Wait a few seconds for database to sync

---

## 📞 Support

For technical issues or questions about the CMS:
1. Check this guide first
2. Review the `/content/README.md` file for content structure
3. Contact your web developer or system administrator

---

## ✅ Quick Checklist

After setup, you should be able to:
- [ ] Log in to `/admin`
- [ ] Add a new gallery item with image
- [ ] View submitted reviews
- [ ] Add and edit FAQs
- [ ] Update site contact information
- [ ] Submit a test review from the public Reviews page
- [ ] See the test review appear automatically

**Congratulations! Your CMS is fully set up and ready to use!** 🎉

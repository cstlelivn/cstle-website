import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Verify admin authentication
async function verifyAdmin(authHeader: string | null) {
  if (!authHeader) {
    return { error: 'No authorization header', user: null };
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return { error: 'No token provided', user: null };
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return { error: 'Invalid token', user: null };
  }

  return { error: null, user };
}

// Initialize storage bucket
async function initStorageBucket() {
  const bucketName = 'make-6e189709-gallery';
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
  
  if (!bucketExists) {
    await supabase.storage.createBucket(bucketName, {
      public: false,
      fileSizeLimit: 10485760, // 10MB
    });
  }
  
  return bucketName;
}

// Initialize bucket on startup
await initStorageBucket();

// ============================================
// ADMIN AUTH ROUTES
// ============================================

// Admin signup
app.post("/make-server-6e189709/admin/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true, // Auto-confirm since email server isn't configured
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: 'Failed to create admin account' }, 500);
  }
});

// Admin signin
app.post("/make-server-6e189709/admin/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Signin error:', error);
      return c.json({ error: error.message }, 401);
    }

    return c.json({ 
      success: true, 
      access_token: data.session.access_token,
      user: data.user 
    });
  } catch (error) {
    console.error('Signin error:', error);
    return c.json({ error: 'Failed to sign in' }, 500);
  }
});

// ============================================
// REVIEWS ROUTES
// ============================================

// Get all reviews (public)
app.get("/make-server-6e189709/reviews", async (c) => {
  try {
    const reviewKeys = await kv.getByPrefix('review:');
    const reviews = reviewKeys
      .filter(item => item.approved !== false) // Only show approved reviews
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return c.json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return c.json({ error: 'Failed to fetch reviews' }, 500);
  }
});

// Submit a review (public)
app.post("/make-server-6e189709/reviews", async (c) => {
  try {
    const { name, email, role, rating, text } = await c.req.json();
    
    const reviewId = `review:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const review = {
      id: reviewId,
      name,
      email,
      role,
      rating: parseInt(rating),
      text,
      date: new Date().toISOString(),
      approved: true, // Auto-approve by default
    };

    await kv.set(reviewId, review);
    
    return c.json({ success: true, review });
  } catch (error) {
    console.error('Error submitting review:', error);
    return c.json({ error: 'Failed to submit review' }, 500);
  }
});

// Get all reviews (admin only)
app.get("/make-server-6e189709/admin/reviews", async (c) => {
  const { error: authError } = await verifyAdmin(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const reviews = await kv.getByPrefix('review:');
    return c.json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return c.json({ error: 'Failed to fetch reviews' }, 500);
  }
});

// Delete review (admin only)
app.delete("/make-server-6e189709/admin/reviews/:id", async (c) => {
  const { error: authError } = await verifyAdmin(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const id = c.req.param('id');
    await kv.del(id);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting review:', error);
    return c.json({ error: 'Failed to delete review' }, 500);
  }
});

// Toggle review approval (admin only)
app.patch("/make-server-6e189709/admin/reviews/:id/approve", async (c) => {
  const { error: authError } = await verifyAdmin(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const id = c.req.param('id');
    const review = await kv.get(id);
    
    if (!review) {
      return c.json({ error: 'Review not found' }, 404);
    }

    review.approved = !review.approved;
    await kv.set(id, review);
    
    return c.json({ success: true, review });
  } catch (error) {
    console.error('Error toggling approval:', error);
    return c.json({ error: 'Failed to toggle approval' }, 500);
  }
});

// ============================================
// GALLERY ROUTES
// ============================================

// Get all gallery items (public)
app.get("/make-server-6e189709/gallery", async (c) => {
  try {
    const items = await kv.getByPrefix('gallery:');
    
    // Generate signed URLs for images
    const bucketName = 'make-6e189709-gallery';
    const itemsWithUrls = await Promise.all(
      items.map(async (item) => {
        const { data } = await supabase.storage
          .from(bucketName)
          .createSignedUrl(item.imagePath, 3600); // 1 hour expiry
        
        return {
          ...item,
          imageUrl: data?.signedUrl || '',
        };
      })
    );
    
    return c.json({ items: itemsWithUrls });
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return c.json({ error: 'Failed to fetch gallery items' }, 500);
  }
});

// Upload image (admin only)
app.post("/make-server-6e189709/admin/gallery/upload", async (c) => {
  const { error: authError } = await verifyAdmin(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    const bucketName = 'make-6e189709-gallery';
    const fileName = `${Date.now()}-${file.name}`;
    const fileBuffer = await file.arrayBuffer();

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return c.json({ error: 'Failed to upload image' }, 500);
    }

    return c.json({ success: true, path: data.path });
  } catch (error) {
    console.error('Error uploading image:', error);
    return c.json({ error: 'Failed to upload image' }, 500);
  }
});

// Add gallery item (admin only)
app.post("/make-server-6e189709/admin/gallery", async (c) => {
  const { error: authError } = await verifyAdmin(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const { title, category, imagePath } = await c.req.json();
    
    const itemId = `gallery:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const item = {
      id: itemId,
      title,
      category,
      imagePath,
      createdAt: new Date().toISOString(),
    };

    await kv.set(itemId, item);
    
    return c.json({ success: true, item });
  } catch (error) {
    console.error('Error adding gallery item:', error);
    return c.json({ error: 'Failed to add gallery item' }, 500);
  }
});

// Delete gallery item (admin only)
app.delete("/make-server-6e189709/admin/gallery/:id", async (c) => {
  const { error: authError } = await verifyAdmin(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const id = c.req.param('id');
    const item = await kv.get(id);
    
    if (!item) {
      return c.json({ error: 'Gallery item not found' }, 404);
    }

    // Delete image from storage
    const bucketName = 'make-6e189709-gallery';
    await supabase.storage.from(bucketName).remove([item.imagePath]);
    
    // Delete from KV store
    await kv.del(id);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return c.json({ error: 'Failed to delete gallery item' }, 500);
  }
});

// ============================================
// FAQ ROUTES
// ============================================

// Get all FAQs (public)
app.get("/make-server-6e189709/faqs", async (c) => {
  try {
    const faqs = await kv.getByPrefix('faq:');
    const sorted = faqs.sort((a, b) => a.order - b.order);
    
    return c.json({ faqs: sorted });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return c.json({ error: 'Failed to fetch FAQs' }, 500);
  }
});

// Add FAQ (admin only)
app.post("/make-server-6e189709/admin/faqs", async (c) => {
  const { error: authError } = await verifyAdmin(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const { category, question, answer, order } = await c.req.json();
    
    const faqId = `faq:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const faq = {
      id: faqId,
      category,
      question,
      answer,
      order: parseInt(order) || 0,
      createdAt: new Date().toISOString(),
    };

    await kv.set(faqId, faq);
    
    return c.json({ success: true, faq });
  } catch (error) {
    console.error('Error adding FAQ:', error);
    return c.json({ error: 'Failed to add FAQ' }, 500);
  }
});

// Update FAQ (admin only)
app.put("/make-server-6e189709/admin/faqs/:id", async (c) => {
  const { error: authError } = await verifyAdmin(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const id = c.req.param('id');
    const { category, question, answer, order } = await c.req.json();
    
    const existingFaq = await kv.get(id);
    if (!existingFaq) {
      return c.json({ error: 'FAQ not found' }, 404);
    }

    const updatedFaq = {
      ...existingFaq,
      category,
      question,
      answer,
      order: parseInt(order) || 0,
    };

    await kv.set(id, updatedFaq);
    
    return c.json({ success: true, faq: updatedFaq });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return c.json({ error: 'Failed to update FAQ' }, 500);
  }
});

// Delete FAQ (admin only)
app.delete("/make-server-6e189709/admin/faqs/:id", async (c) => {
  const { error: authError } = await verifyAdmin(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const id = c.req.param('id');
    await kv.del(id);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return c.json({ error: 'Failed to delete FAQ' }, 500);
  }
});

// ============================================
// SITE INFO ROUTES
// ============================================

// ============================================
// LEADS ROUTES
// ============================================

// Submit a lead (public)
app.post("/make-server-6e189709/leads", async (c) => {
  try {
    const leadData = await c.req.json();
    
    const leadId = `lead:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const lead = {
      id: leadId,
      ...leadData,
      submittedAt: new Date().toISOString(),
      status: 'new', // new, contacted, converted, closed
    };

    await kv.set(leadId, lead);
    
    return c.json({ success: true, lead });
  } catch (error) {
    console.error('Error submitting lead:', error);
    return c.json({ error: 'Failed to submit lead' }, 500);
  }
});

// Get all leads (admin only)
app.get("/make-server-6e189709/admin/leads", async (c) => {
  const { error: authError } = await verifyAdmin(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const leads = await kv.getByPrefix('lead:');
    const sorted = leads.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    return c.json({ leads: sorted });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return c.json({ error: 'Failed to fetch leads' }, 500);
  }
});

// Update lead status (admin only)
app.patch("/make-server-6e189709/admin/leads/:id/status", async (c) => {
  const { error: authError } = await verifyAdmin(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const id = c.req.param('id');
    const { status } = await c.req.json();
    const lead = await kv.get(id);
    
    if (!lead) {
      return c.json({ error: 'Lead not found' }, 404);
    }

    lead.status = status;
    await kv.set(id, lead);
    
    return c.json({ success: true, lead });
  } catch (error) {
    console.error('Error updating lead status:', error);
    return c.json({ error: 'Failed to update lead status' }, 500);
  }
});

// Delete lead (admin only)
app.delete("/make-server-6e189709/admin/leads/:id", async (c) => {
  const { error: authError } = await verifyAdmin(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const id = c.req.param('id');
    await kv.del(id);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return c.json({ error: 'Failed to delete lead' }, 500);
  }
});

// ============================================
// SITE INFO ROUTES (continued)
// ============================================

// Get site info (public)
app.get("/make-server-6e189709/site-info", async (c) => {
  try {
    let siteInfo = await kv.get('site:info');
    
    // If no site info exists, create default
    if (!siteInfo) {
      siteInfo = {
        name: "Cstle Livn",
        tagline: "Install. Perfect. Finish.",
        email: "info@cstlelivn.com",
        phone: "(306) 371-5817",
        serviceArea: "Saskatchewan Central Area",
        businessHours: {
          weekdays: "Monday - Friday :  9:00 AM - 5:00 PM",
          saturday: "Saturday :  9:00 AM - 4:00 PM",
          sunday: "Sunday :  Strictly By Appointment",
        },
      };
      await kv.set('site:info', siteInfo);
    }
    
    return c.json({ siteInfo });
  } catch (error) {
    console.error('Error fetching site info:', error);
    return c.json({ error: 'Failed to fetch site info' }, 500);
  }
});

// Update site info (admin only)
app.put("/make-server-6e189709/admin/site-info", async (c) => {
  const { error: authError } = await verifyAdmin(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const siteInfo = await c.req.json();
    await kv.set('site:info', siteInfo);
    
    return c.json({ success: true, siteInfo });
  } catch (error) {
    console.error('Error updating site info:', error);
    return c.json({ error: 'Failed to update site info' }, 500);
  }
});

// Health check endpoint
app.get("/make-server-6e189709/health", (c) => {
  return c.json({ status: "ok" });
});

Deno.serve(app.fetch);
# Connect Your Custom Admin App to Cstle Livn Backend

This guide shows how to connect your custom admin application (built at `https://ream-oculus-12377734.figma.site/`) to the Cstle Livn backend.

---

## Quick Setup

### 1. Backend Deployment (One-Time Setup)

First, deploy the backend to Supabase:

```bash
# Install Supabase CLI
brew install supabase/tap/supabase  # Mac
# or
scoop install supabase              # Windows

# Login and deploy
supabase login
supabase link --project-ref mlxsfhdzlcxtvqeshgjx
supabase functions deploy make-server-6e189709 --no-verify-jwt
```

### 2. Create Admin Account (One-Time Setup)

Run this in your browser console:

```javascript
fetch('https://mlxsfhdzlcxtvqeshgjx.supabase.co/functions/v1/make-server-6e189709/admin/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1seHNmaGR6bGN4dHZxZXNoZ2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NTIyOTEsImV4cCI6MjA3NjIyODI5MX0.ZC_CemlkjJgbPkVDCLOagfLkRDAKwKyLBkt9sA_gSvU'
  },
  body: JSON.stringify({
    email: 'your-email@example.com',
    password: 'your-secure-password',
    name: 'Your Name'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## Configuration for Your Admin App

### API Configuration

Add these constants to your admin app:

```javascript
const API_BASE_URL = 'https://mlxsfhdzlcxtvqeshgjx.supabase.co/functions/v1/make-server-6e189709';

const PUBLIC_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1seHNmaGR6bGN4dHZxZXNoZ2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NTIyOTEsImV4cCI6MjA3NjIyODI5MX0.ZC_CemlkjJgbPkVDCLOagfLkRDAKwKyLBkt9sA_gSvU';
```

---

## Example: Complete Admin App Integration

### 1. Login Component

```javascript
// Login.js
async function handleLogin(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PUBLIC_ANON_KEY}`
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (response.ok) {
      // Store access token
      localStorage.setItem('admin_token', data.access_token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } else {
      alert('Login failed: ' + data.error);
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Failed to connect to server');
  }
}
```

### 2. Fetch Leads

```javascript
// Leads.js
async function fetchLeads() {
  const token = localStorage.getItem('admin_token');
  
  if (!token) {
    window.location.href = '/login';
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/admin/leads`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
      return;
    }

    const data = await response.json();
    
    // Display leads in your UI
    displayLeads(data.leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
  }
}
```

### 3. Update Lead Status

```javascript
// UpdateLead.js
async function updateLeadStatus(leadId, newStatus) {
  const token = localStorage.getItem('admin_token');

  try {
    const response = await fetch(`${API_BASE_URL}/admin/leads/${leadId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    });

    if (response.ok) {
      alert('Lead status updated!');
      // Refresh leads list
      fetchLeads();
    } else {
      const error = await response.json();
      alert('Failed to update: ' + error.error);
    }
  } catch (error) {
    console.error('Error updating lead:', error);
  }
}
```

### 4. Upload Gallery Image

```javascript
// Gallery.js
async function uploadGalleryImage(file, title, category) {
  const token = localStorage.getItem('admin_token');

  try {
    // Step 1: Upload the image file
    const formData = new FormData();
    formData.append('file', file);

    const uploadResponse = await fetch(`${API_BASE_URL}/admin/gallery/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload image');
    }

    const uploadData = await uploadResponse.json();

    // Step 2: Create gallery item with the uploaded image path
    const createResponse = await fetch(`${API_BASE_URL}/admin/gallery`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: title,
        category: category,
        imagePath: uploadData.path
      })
    });

    if (createResponse.ok) {
      alert('Gallery item added successfully!');
      // Refresh gallery
      fetchGallery();
    } else {
      alert('Failed to create gallery item');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    alert('Failed to upload image');
  }
}
```

### 5. Manage Reviews

```javascript
// Reviews.js
async function fetchAllReviews() {
  const token = localStorage.getItem('admin_token');

  const response = await fetch(`${API_BASE_URL}/admin/reviews`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  return data.reviews;
}

async function toggleReviewApproval(reviewId) {
  const token = localStorage.getItem('admin_token');

  const response = await fetch(`${API_BASE_URL}/admin/reviews/${reviewId}/approve`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (response.ok) {
    alert('Review approval toggled!');
    // Refresh reviews
    fetchAllReviews();
  }
}

async function deleteReview(reviewId) {
  if (!confirm('Are you sure you want to delete this review?')) return;

  const token = localStorage.getItem('admin_token');

  const response = await fetch(`${API_BASE_URL}/admin/reviews/${reviewId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (response.ok) {
    alert('Review deleted!');
    fetchAllReviews();
  }
}
```

---

## Helper Functions

### API Client Utility

Create a reusable API client:

```javascript
// api.js
class CstleLivnAPI {
  constructor() {
    this.baseURL = 'https://mlxsfhdzlcxtvqeshgjx.supabase.co/functions/v1/make-server-6e189709';
    this.publicKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1seHNmaGR6bGN4dHZxZXNoZ2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NTIyOTEsImV4cCI6MjA3NjIyODI5MX0.ZC_CemlkjJgbPkVDCLOagfLkRDAKwKyLBkt9sA_gSvU';
  }

  getToken() {
    return localStorage.getItem('admin_token');
  }

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const isAdminEndpoint = endpoint.includes('/admin/');

    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${isAdminEndpoint ? token : this.publicKey}`
    };

    if (options.body && typeof options.body !== 'string') {
      headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(options.body);
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers
    });

    if (response.status === 401 && isAdminEndpoint) {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
      throw new Error('Session expired');
    }

    return response.json();
  }

  // Auth
  async login(email, password) {
    return this.request('/admin/signin', {
      method: 'POST',
      body: { email, password }
    });
  }

  // Leads
  async getLeads() {
    return this.request('/admin/leads');
  }

  async updateLeadStatus(leadId, status) {
    return this.request(`/admin/leads/${leadId}/status`, {
      method: 'PATCH',
      body: { status }
    });
  }

  async deleteLead(leadId) {
    return this.request(`/admin/leads/${leadId}`, {
      method: 'DELETE'
    });
  }

  // Reviews
  async getReviews() {
    return this.request('/admin/reviews');
  }

  async toggleReviewApproval(reviewId) {
    return this.request(`/admin/reviews/${reviewId}/approve`, {
      method: 'PATCH'
    });
  }

  async deleteReview(reviewId) {
    return this.request(`/admin/reviews/${reviewId}`, {
      method: 'DELETE'
    });
  }

  // Gallery
  async getGallery() {
    return this.request('/gallery');
  }

  async uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);

    const token = this.getToken();
    const response = await fetch(`${this.baseURL}/admin/gallery/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    return response.json();
  }

  async createGalleryItem(title, category, imagePath) {
    return this.request('/admin/gallery', {
      method: 'POST',
      body: { title, category, imagePath }
    });
  }

  async deleteGalleryItem(itemId) {
    return this.request(`/admin/gallery/${itemId}`, {
      method: 'DELETE'
    });
  }

  // FAQs
  async getFaqs() {
    return this.request('/faqs');
  }

  async createFaq(category, question, answer, order) {
    return this.request('/admin/faqs', {
      method: 'POST',
      body: { category, question, answer, order }
    });
  }

  async updateFaq(faqId, category, question, answer, order) {
    return this.request(`/admin/faqs/${faqId}`, {
      method: 'PUT',
      body: { category, question, answer, order }
    });
  }

  async deleteFaq(faqId) {
    return this.request(`/admin/faqs/${faqId}`, {
      method: 'DELETE'
    });
  }

  // Site Info
  async getSiteInfo() {
    return this.request('/site-info');
  }

  async updateSiteInfo(siteInfo) {
    return this.request('/admin/site-info', {
      method: 'PUT',
      body: siteInfo
    });
  }
}

// Usage:
const api = new CstleLivnAPI();

// Login
const loginData = await api.login('admin@example.com', 'password');
localStorage.setItem('admin_token', loginData.access_token);

// Get leads
const leadsData = await api.getLeads();
console.log(leadsData.leads);

// Update lead status
await api.updateLeadStatus('lead:123', 'contacted');
```

---

## Testing Your Connection

### Quick Test Script

Run this in your browser console to test the connection:

```javascript
// Test 1: Check if backend is running
fetch('https://mlxsfhdzlcxtvqeshgjx.supabase.co/functions/v1/make-server-6e189709/health')
  .then(res => res.json())
  .then(data => console.log('✅ Backend is running:', data))
  .catch(err => console.error('❌ Backend not accessible:', err));

// Test 2: Try to login (replace with your credentials)
fetch('https://mlxsfhdzlcxtvqeshgjx.supabase.co/functions/v1/make-server-6e189709/admin/signin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1seHNmaGR6bGN4dHZxZXNoZ2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NTIyOTEsImV4cCI6MjA3NjIyODI5MX0.ZC_CemlkjJgbPkVDCLOagfLkRDAKwKyLBkt9sA_gSvU'
  },
  body: JSON.stringify({
    email: 'your-email@example.com',
    password: 'your-password'
  })
})
  .then(res => res.json())
  .then(data => {
    if (data.access_token) {
      console.log('✅ Login successful! Token:', data.access_token.substring(0, 20) + '...');
      
      // Test 3: Fetch leads with the token
      return fetch('https://mlxsfhdzlcxtvqeshgjx.supabase.co/functions/v1/make-server-6e189709/admin/leads', {
        headers: {
          'Authorization': `Bearer ${data.access_token}`
        }
      });
    } else {
      console.error('❌ Login failed:', data);
    }
  })
  .then(res => res.json())
  .then(data => console.log('✅ Leads fetched:', data.leads))
  .catch(err => console.error('❌ Error:', err));
```

---

## Summary

Your custom admin app needs to:

1. ✅ **Deploy the backend once** (using Supabase CLI)
2. ✅ **Create an admin account once** (using the signup endpoint)
3. ✅ **Implement login** in your admin app (save the access token)
4. ✅ **Make API calls** using the endpoints in `API-REFERENCE.md`
5. ✅ **Include the access token** in all admin requests

**Full API Documentation:** See `API-REFERENCE.md`

**The backend is completely separate** - your Figma-hosted admin app will work perfectly as long as it makes HTTP requests to the API endpoints!

# Cstle Livn Backend API Reference

This document describes all API endpoints for connecting your custom admin application.

## Base Configuration

**Base URL:** `https://mlxsfhdzlcxtvqeshgjx.supabase.co/functions/v1/make-server-6e189709`

**Public Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1seHNmaGR6bGN4dHZxZXNoZ2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NTIyOTEsImV4cCI6MjA3NjIyODI5MX0.ZC_CemlkjJgbPkVDCLOagfLkRDAKwKyLBkt9sA_gSvU`

---

## Authentication Endpoints

### 1. Admin Signup (Create Admin Account)
**POST** `/admin/signup`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {publicAnonKey}"
}
```

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "securepassword",
  "name": "Admin Name"
}
```

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "admin@example.com",
    ...
  }
}
```

---

### 2. Admin Signin (Login)
**POST** `/admin/signin`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {publicAnonKey}"
}
```

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "securepassword"
}
```

**Response (Success):**
```json
{
  "success": true,
  "access_token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "email": "admin@example.com",
    ...
  }
}
```

**💡 Important:** Save the `access_token` - you'll need it for all admin endpoints below!

---

## Leads Endpoints

### 3. Get All Leads (Admin Only)
**GET** `/admin/leads`

**Headers:**
```json
{
  "Authorization": "Bearer {access_token}"
}
```

**Response:**
```json
{
  "leads": [
    {
      "id": "lead:1234567890-abc123",
      "type": "booking" | "contact",
      "name": "John Doe",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "(123) 456-7890",
      "address": "123 Main St",
      "serviceType": "Kitchen Finishing",
      "projectType": "Kitchen renovation",
      "projectDetails": "Details here...",
      "message": "Message here...",
      "preferredDate": "2024-01-15T00:00:00.000Z",
      "submittedAt": "2024-01-10T14:30:00.000Z",
      "status": "new" | "contacted" | "converted" | "closed"
    }
  ]
}
```

---

### 4. Update Lead Status (Admin Only)
**PATCH** `/admin/leads/{leadId}/status`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {access_token}"
}
```

**Request Body:**
```json
{
  "status": "new" | "contacted" | "converted" | "closed"
}
```

**Response:**
```json
{
  "success": true,
  "lead": { /* updated lead object */ }
}
```

---

### 5. Delete Lead (Admin Only)
**DELETE** `/admin/leads/{leadId}`

**Headers:**
```json
{
  "Authorization": "Bearer {access_token}"
}
```

**Response:**
```json
{
  "success": true
}
```

---

### 6. Submit Lead (Public - from website forms)
**POST** `/leads`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {publicAnonKey}"
}
```

**Request Body (Booking):**
```json
{
  "type": "booking",
  "firstName": "John",
  "lastName": "Doe",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "(123) 456-7890",
  "address": "123 Main St",
  "serviceType": "Kitchen Finishing",
  "projectDetails": "Details here...",
  "preferredDate": "2024-01-15T00:00:00.000Z"
}
```

**Request Body (Contact):**
```json
{
  "type": "contact",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "(123) 456-7890",
  "projectType": "Bathroom renovation",
  "message": "I need help with..."
}
```

**Response:**
```json
{
  "success": true,
  "lead": { /* created lead object */ }
}
```

---

## Reviews Endpoints

### 7. Get All Reviews (Public - Approved Only)
**GET** `/reviews`

**Headers:**
```json
{
  "Authorization": "Bearer {publicAnonKey}"
}
```

**Response:**
```json
{
  "reviews": [
    {
      "id": "review:1234567890-abc123",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "Homeowner",
      "rating": 5,
      "text": "Excellent work!",
      "date": "2024-01-10T14:30:00.000Z",
      "approved": true
    }
  ]
}
```

---

### 8. Get All Reviews (Admin - All Reviews)
**GET** `/admin/reviews`

**Headers:**
```json
{
  "Authorization": "Bearer {access_token}"
}
```

**Response:**
```json
{
  "reviews": [ /* all reviews including unapproved */ ]
}
```

---

### 9. Submit Review (Public)
**POST** `/reviews`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {publicAnonKey}"
}
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "Homeowner",
  "rating": 5,
  "text": "Excellent work!"
}
```

**Response:**
```json
{
  "success": true,
  "review": { /* created review object */ }
}
```

---

### 10. Toggle Review Approval (Admin Only)
**PATCH** `/admin/reviews/{reviewId}/approve`

**Headers:**
```json
{
  "Authorization": "Bearer {access_token}"
}
```

**Response:**
```json
{
  "success": true,
  "review": { /* updated review with toggled approved status */ }
}
```

---

### 11. Delete Review (Admin Only)
**DELETE** `/admin/reviews/{reviewId}`

**Headers:**
```json
{
  "Authorization": "Bearer {access_token}"
}
```

**Response:**
```json
{
  "success": true
}
```

---

## Gallery Endpoints

### 12. Get All Gallery Items (Public)
**GET** `/gallery`

**Headers:**
```json
{
  "Authorization": "Bearer {publicAnonKey}"
}
```

**Response:**
```json
{
  "items": [
    {
      "id": "gallery:1234567890-abc123",
      "title": "Modern Kitchen",
      "category": "Kitchen",
      "imagePath": "1234567890-image.jpg",
      "imageUrl": "https://signed-url-here",
      "createdAt": "2024-01-10T14:30:00.000Z"
    }
  ]
}
```

---

### 13. Upload Gallery Image (Admin Only)
**POST** `/admin/gallery/upload`

**Headers:**
```json
{
  "Authorization": "Bearer {access_token}"
}
```

**Request Body:** `FormData` with file
```javascript
const formData = new FormData();
formData.append('file', fileObject);
```

**Response:**
```json
{
  "success": true,
  "path": "1234567890-image.jpg"
}
```

---

### 14. Create Gallery Item (Admin Only)
**POST** `/admin/gallery`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {access_token}"
}
```

**Request Body:**
```json
{
  "title": "Modern Kitchen",
  "category": "Kitchen",
  "imagePath": "1234567890-image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "item": { /* created gallery item */ }
}
```

---

### 15. Delete Gallery Item (Admin Only)
**DELETE** `/admin/gallery/{itemId}`

**Headers:**
```json
{
  "Authorization": "Bearer {access_token}"
}
```

**Response:**
```json
{
  "success": true
}
```

---

## FAQ Endpoints

### 16. Get All FAQs (Public)
**GET** `/faqs`

**Headers:**
```json
{
  "Authorization": "Bearer {publicAnonKey}"
}
```

**Response:**
```json
{
  "faqs": [
    {
      "id": "faq:1234567890-abc123",
      "category": "Services",
      "question": "What services do you offer?",
      "answer": "We offer...",
      "order": 0,
      "createdAt": "2024-01-10T14:30:00.000Z"
    }
  ]
}
```

---

### 17. Add FAQ (Admin Only)
**POST** `/admin/faqs`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {access_token}"
}
```

**Request Body:**
```json
{
  "category": "Services",
  "question": "What services do you offer?",
  "answer": "We offer kitchen finishing, painting, trim...",
  "order": 0
}
```

**Response:**
```json
{
  "success": true,
  "faq": { /* created faq object */ }
}
```

---

### 18. Update FAQ (Admin Only)
**PUT** `/admin/faqs/{faqId}`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {access_token}"
}
```

**Request Body:**
```json
{
  "category": "Services",
  "question": "What services do you offer?",
  "answer": "Updated answer...",
  "order": 0
}
```

**Response:**
```json
{
  "success": true,
  "faq": { /* updated faq object */ }
}
```

---

### 19. Delete FAQ (Admin Only)
**DELETE** `/admin/faqs/{faqId}`

**Headers:**
```json
{
  "Authorization": "Bearer {access_token}"
}
```

**Response:**
```json
{
  "success": true
}
```

---

## Site Info Endpoints

### 20. Get Site Info (Public)
**GET** `/site-info`

**Headers:**
```json
{
  "Authorization": "Bearer {publicAnonKey}"
}
```

**Response:**
```json
{
  "siteInfo": {
    "name": "Cstle Livn",
    "tagline": "Install. Perfect. Finish.",
    "email": "info@cstlelivn.com",
    "phone": "(306) 371-5817",
    "serviceArea": "Saskatchewan Central Area",
    "businessHours": {
      "weekdays": "Monday - Friday: 9:00 AM - 5:00 PM",
      "saturday": "Saturday: 9:00 AM - 4:00 PM",
      "sunday": "Sunday: Strictly By Appointment"
    }
  }
}
```

---

### 21. Update Site Info (Admin Only)
**PUT** `/admin/site-info`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {access_token}"
}
```

**Request Body:**
```json
{
  "name": "Cstle Livn",
  "tagline": "Install. Perfect. Finish.",
  "email": "info@cstlelivn.com",
  "phone": "(306) 371-5817",
  "serviceArea": "Saskatchewan Central Area",
  "businessHours": {
    "weekdays": "Monday - Friday: 9:00 AM - 5:00 PM",
    "saturday": "Saturday: 9:00 AM - 4:00 PM",
    "sunday": "Sunday: Strictly By Appointment"
  }
}
```

**Response:**
```json
{
  "success": true,
  "siteInfo": { /* updated site info */ }
}
```

---

## Error Responses

All endpoints may return errors in this format:

```json
{
  "error": "Error message here"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (missing or invalid data)
- `401` - Unauthorized (missing or invalid access token)
- `404` - Not Found (resource doesn't exist)
- `500` - Server Error

---

## Example: Complete Authentication Flow

```javascript
// 1. Login
const loginResponse = await fetch(
  'https://mlxsfhdzlcxtvqeshgjx.supabase.co/functions/v1/make-server-6e189709/admin/signin',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1seHNmaGR6bGN4dHZxZXNoZ2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NTIyOTEsImV4cCI6MjA3NjIyODI5MX0.ZC_CemlkjJgbPkVDCLOagfLkRDAKwKyLBkt9sA_gSvU'
    },
    body: JSON.stringify({
      email: 'admin@example.com',
      password: 'yourpassword'
    })
  }
);

const loginData = await loginResponse.json();
const accessToken = loginData.access_token;

// 2. Use access token for admin requests
const leadsResponse = await fetch(
  'https://mlxsfhdzlcxtvqeshgjx.supabase.co/functions/v1/make-server-6e189709/admin/leads',
  {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  }
);

const leadsData = await leadsResponse.json();
console.log(leadsData.leads);
```

---

## Notes for Your Custom Admin App

1. **Store Access Token:** After login, store the `access_token` (in localStorage, sessionStorage, or state management)
2. **Include Token in Requests:** All admin endpoints require the access token in the Authorization header
3. **Handle Errors:** Check response status and handle 401 errors (token expired, need to re-login)
4. **CORS:** The backend has CORS enabled for all origins, so your Figma-hosted app will work
5. **Image URLs:** Gallery image URLs are signed and expire after 1 hour. Refresh them as needed.

---

## Testing the API

You can test endpoints using:
- **Browser Console:** Copy/paste fetch examples
- **Postman:** Import as HTTP requests
- **cURL:** Command line testing

Example cURL:
```bash
curl -X GET \
  'https://mlxsfhdzlcxtvqeshgjx.supabase.co/functions/v1/make-server-6e189709/leads' \
  -H 'Authorization: Bearer eyJhbG...'
```

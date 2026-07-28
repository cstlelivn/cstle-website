import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Review {
  id: string;
  name: string;
  role: string;
  rating: number;
  text: string;
  date: string;
  approved: boolean;
}

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imagePath: string;
  imageUrl?: string;
  createdAt: string;
}

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  order: number;
  createdAt: string;
}

interface Lead {
  id: string;
  type: 'booking' | 'contact';
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  address?: string;
  serviceType?: string;
  projectType?: string;
  projectDetails?: string;
  message?: string;
  preferredDate?: string;
  submittedAt: string;
  status: 'new' | 'contacted' | 'converted' | 'closed';
}

export function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Gallery state
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [newGallery, setNewGallery] = useState({
    title: "",
    category: "",
    file: null as File | null,
  });
  const [uploading, setUploading] = useState(false);

  // FAQs state
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loadingFaqs, setLoadingFaqs] = useState(false);
  const [newFaq, setNewFaq] = useState({
    category: "",
    question: "",
    answer: "",
    order: 0,
  });
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);

  // Site Info state
  const [siteInfo, setSiteInfo] = useState({
    name: "",
    tagline: "",
    email: "",
    phone: "",
    serviceArea: "",
    businessHours: {
      weekdays: "",
      saturday: "",
      sunday: "",
    },
  });
  const [loadingSiteInfo, setLoadingSiteInfo] = useState(false);

  // Leads state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('admin_access_token');
    if (token) {
      setAccessToken(token);
      setIsLoggedIn(true);
    }
  }, []);

  // Load data when logged in
  useEffect(() => {
    if (isLoggedIn && accessToken) {
      fetchReviews();
      fetchGallery();
      fetchFaqs();
      fetchSiteInfo();
      fetchLeads();
    }
  }, [isLoggedIn, accessToken]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6e189709/admin/signin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.access_token);
        setIsLoggedIn(true);
        localStorage.setItem('admin_access_token', data.access_token);
      } else {
        const errorData = await response.json();
        setLoginError(errorData.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Failed to connect to server');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAccessToken(null);
    localStorage.removeItem('admin_access_token');
    setEmail("");
    setPassword("");
  };

  // ========== REVIEWS FUNCTIONS ==========
  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6e189709/admin/reviews`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      } else {
        console.error('Error fetching reviews:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6e189709/admin/reviews/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        fetchReviews();
      } else {
        alert('Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    }
  };

  const toggleApproval = async (id: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6e189709/admin/reviews/${id}/approve`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        fetchReviews();
      } else {
        alert('Failed to toggle approval');
      }
    } catch (error) {
      console.error('Error toggling approval:', error);
      alert('Failed to toggle approval');
    }
  };

  // ========== GALLERY FUNCTIONS ==========
  const fetchGallery = async () => {
    setLoadingGallery(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6e189709/gallery`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setGalleryItems(data.items || []);
      } else {
        console.error('Error fetching gallery:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoadingGallery(false);
    }
  };

  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGallery.file) {
      alert('Please select an image');
      return;
    }

    setUploading(true);

    try {
      // First, upload the image
      const formData = new FormData();
      formData.append('file', newGallery.file);

      const uploadResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6e189709/admin/gallery/upload`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      const uploadData = await uploadResponse.json();

      // Then, create the gallery item
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6e189709/admin/gallery`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            title: newGallery.title,
            category: newGallery.category,
            imagePath: uploadData.path,
          }),
        }
      );

      if (response.ok) {
        alert('Gallery item added successfully!');
        setNewGallery({ title: "", category: "", file: null });
        fetchGallery();
      } else {
        alert('Failed to add gallery item');
      }
    } catch (error) {
      console.error('Error adding gallery item:', error);
      alert('Failed to add gallery item');
    } finally {
      setUploading(false);
    }
  };

  const deleteGalleryItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6e189709/admin/gallery/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        fetchGallery();
      } else {
        alert('Failed to delete gallery item');
      }
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      alert('Failed to delete gallery item');
    }
  };

  // ========== FAQ FUNCTIONS ==========
  const fetchFaqs = async () => {
    setLoadingFaqs(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6e189709/faqs`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFaqs(data.faqs || []);
      } else {
        console.error('Error fetching FAQs:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoadingFaqs(false);
    }
  };

  const handleFaqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6e189709/admin/faqs`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(newFaq),
        }
      );

      if (response.ok) {
        alert('FAQ added successfully!');
        setNewFaq({ category: "", question: "", answer: "", order: 0 });
        fetchFaqs();
      } else {
        alert('Failed to add FAQ');
      }
    } catch (error) {
      console.error('Error adding FAQ:', error);
      alert('Failed to add FAQ');
    }
  };

  const handleFaqUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6e189709/admin/faqs/${editingFaq.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            category: editingFaq.category,
            question: editingFaq.question,
            answer: editingFaq.answer,
            order: editingFaq.order,
          }),
        }
      );

      if (response.ok) {
        alert('FAQ updated successfully!');
        setEditingFaq(null);
        fetchFaqs();
      } else {
        alert('Failed to update FAQ');
      }
    } catch (error) {
      console.error('Error updating FAQ:', error);
      alert('Failed to update FAQ');
    }
  };

  const deleteFaq = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6e189709/admin/faqs/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        fetchFaqs();
      } else {
        alert('Failed to delete FAQ');
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      alert('Failed to delete FAQ');
    }
  };

  // ========== SITE INFO FUNCTIONS ==========
  const fetchSiteInfo = async () => {
    setLoadingSiteInfo(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6e189709/site-info`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSiteInfo(data.siteInfo);
      } else {
        console.error('Error fetching site info:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching site info:', error);
    } finally {
      setLoadingSiteInfo(false);
    }
  };

  const handleSiteInfoUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6e189709/admin/site-info`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(siteInfo),
        }
      );

      if (response.ok) {
        alert('Site information updated successfully!');
        fetchSiteInfo();
      } else {
        alert('Failed to update site information');
      }
    } catch (error) {
      console.error('Error updating site info:', error);
      alert('Failed to update site information');
    }
  };

  // ========== LEADS FUNCTIONS ==========
  const fetchLeads = async () => {
    setLoadingLeads(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6e189709/admin/leads`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLeads(data.leads || []);
      } else {
        console.error('Error fetching leads:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoadingLeads(false);
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6e189709/admin/leads/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        fetchLeads();
      } else {
        alert('Failed to delete lead');
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('Failed to delete lead');
    }
  };

  const updateLeadStatus = async (id: string, status: 'new' | 'contacted' | 'converted' | 'closed') => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6e189709/admin/leads/${id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        fetchLeads();
      } else {
        alert('Failed to update lead status');
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
      alert('Failed to update lead status');
    }
  };

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#f1f1f1] flex items-center justify-center p-4">
        <div className="bg-white p-12 rounded-[32px] max-w-md w-full shadow-lg">
          <h1 className="font-['Anybody',_sans-serif] text-[#191919] mb-8 text-center tracking-[-1px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 800, fontSize: '36px' }}>
            Admin Login
          </h1>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="email" className="font-['Roboto_Mono',_sans-serif] uppercase text-[12px] tracking-wider">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="password" className="font-['Roboto_Mono',_sans-serif] uppercase text-[12px] tracking-wider">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2"
              />
            </div>

            {loginError && (
              <p className="text-red-600 text-sm">{loginError}</p>
            )}

            <Button 
              type="submit" 
              className="w-full bg-black hover:bg-black/90 text-white rounded-[32px] py-6 font-['Roboto_Mono',_sans-serif] uppercase tracking-wider"
            >
              Login
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-4">
              Don't have an admin account yet?
            </p>
            <p className="text-xs text-gray-500 text-center">
              Contact the system administrator to create an account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-[#f1f1f1]">
      <div className="bg-black text-white py-6 px-8 flex justify-between items-center">
        <h1 className="font-['Anybody',_sans-serif] tracking-[-1px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 800, fontSize: '28px' }}>
          Cstle Livn Admin Panel
        </h1>
        <Button 
          onClick={handleLogout}
          className="bg-white text-black hover:bg-gray-200 rounded-[24px] font-['Roboto_Mono',_sans-serif] uppercase text-[11px] tracking-wider"
        >
          Logout
        </Button>
      </div>

      <div className="max-w-[1400px] mx-auto p-8">
        <Tabs defaultValue="leads" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
            <TabsTrigger value="siteinfo">Site Info</TabsTrigger>
          </TabsList>

          {/* LEADS TAB */}
          <TabsContent value="leads">
            <div className="bg-white p-8 rounded-[24px]">
              <h2 className="font-['Anybody',_sans-serif] text-[#191919] mb-6 tracking-[-1px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700, fontSize: '24px' }}>
                Manage Leads
              </h2>

              {loadingLeads ? (
                <p>Loading leads...</p>
              ) : (
                <div className="space-y-4">
                  {leads.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No leads yet. Leads will appear here when users submit the contact or booking forms.</p>
                  ) : (
                    leads.map((lead) => (
                      <div key={lead.id} className="border border-gray-200 p-6 rounded-lg">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`px-3 py-1 rounded-full text-xs uppercase tracking-wider ${
                                lead.type === 'booking' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                              }`}>
                                {lead.type}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-xs uppercase tracking-wider ${
                                lead.status === 'new' ? 'bg-yellow-100 text-yellow-700' :
                                lead.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                                lead.status === 'converted' ? 'bg-green-100 text-green-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {lead.status}
                              </span>
                            </div>
                            <p className="font-bold text-lg">{lead.name}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 text-sm">
                              <p><span className="font-semibold">Email:</span> {lead.email}</p>
                              <p><span className="font-semibold">Phone:</span> {lead.phone}</p>
                              {lead.address && (
                                <p><span className="font-semibold">Address:</span> {lead.address}</p>
                              )}
                              {lead.serviceType && (
                                <p><span className="font-semibold">Service:</span> {lead.serviceType}</p>
                              )}
                              {lead.projectType && (
                                <p><span className="font-semibold">Project:</span> {lead.projectType}</p>
                              )}
                              {lead.preferredDate && (
                                <p><span className="font-semibold">Preferred Date:</span> {new Date(lead.preferredDate).toLocaleDateString()}</p>
                              )}
                            </div>
                            {(lead.projectDetails || lead.message) && (
                              <div className="mt-3">
                                <p className="font-semibold text-sm">Details:</p>
                                <p className="text-gray-700 mt-1">{lead.projectDetails || lead.message}</p>
                              </div>
                            )}
                            <p className="text-sm text-gray-500 mt-3">
                              Submitted: {new Date(lead.submittedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4 flex-wrap">
                          <select
                            value={lead.status}
                            onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                            className="border border-gray-300 rounded px-3 py-1 text-sm"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="converted">Converted</option>
                            <option value="closed">Closed</option>
                          </select>
                          <Button
                            onClick={() => deleteLead(lead.id)}
                            variant="destructive"
                            size="sm"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          {/* REVIEWS TAB */}
          <TabsContent value="reviews">
            <div className="bg-white p-8 rounded-[24px]">
              <h2 className="font-['Anybody',_sans-serif] text-[#191919] mb-6 tracking-[-1px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700, fontSize: '24px' }}>
                Manage Reviews
              </h2>

              {loadingReviews ? (
                <p>Loading reviews...</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border border-gray-200 p-6 rounded-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-bold text-lg">{review.name}</p>
                          <p className="text-sm text-gray-600">{review.role}</p>
                          <div className="flex mt-2">
                            {[...Array(review.rating)].map((_, i) => (
                              <svg key={i} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => toggleApproval(review.id)}
                            variant={review.approved ? "default" : "outline"}
                            size="sm"
                          >
                            {review.approved ? 'Approved' : 'Approve'}
                          </Button>
                          <Button
                            onClick={() => deleteReview(review.id)}
                            variant="destructive"
                            size="sm"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.text}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Submitted: {new Date(review.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* GALLERY TAB */}
          <TabsContent value="gallery">
            <div className="bg-white p-8 rounded-[24px]">
              <h2 className="font-['Anybody',_sans-serif] text-[#191919] mb-6 tracking-[-1px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700, fontSize: '24px' }}>
                Manage Gallery
              </h2>

              {/* Add New Gallery Item */}
              <div className="bg-[#f1f1f1] p-6 rounded-lg mb-8">
                <h3 className="font-['Anybody',_sans-serif] text-[#191919] mb-4" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700, fontSize: '18px' }}>
                  Add New Gallery Item
                </h3>
                <form onSubmit={handleGallerySubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="gallery-title" className="font-['Roboto_Mono',_sans-serif] uppercase text-[11px] tracking-wider">
                      Title *
                    </Label>
                    <Input
                      id="gallery-title"
                      value={newGallery.title}
                      onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })}
                      required
                      className="mt-2 bg-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gallery-category" className="font-['Roboto_Mono',_sans-serif] uppercase text-[11px] tracking-wider">
                      Category *
                    </Label>
                    <Input
                      id="gallery-category"
                      value={newGallery.category}
                      onChange={(e) => setNewGallery({ ...newGallery, category: e.target.value })}
                      placeholder="e.g., Kitchen, Bathroom, Living Room"
                      required
                      className="mt-2 bg-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gallery-image" className="font-['Roboto_Mono',_sans-serif] uppercase text-[11px] tracking-wider">
                      Image *
                    </Label>
                    <input
                      id="gallery-image"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => setNewGallery({ ...newGallery, file: e.target.files?.[0] || null })}
                      required
                      className="mt-2 w-full"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={uploading}
                    className="bg-black hover:bg-black/90 text-white rounded-[24px] font-['Roboto_Mono',_sans-serif] uppercase text-[11px] tracking-wider"
                  >
                    {uploading ? 'Uploading...' : 'Add Gallery Item'}
                  </Button>
                </form>
              </div>

              {/* Gallery Items List */}
              {loadingGallery ? (
                <p>Loading gallery...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {galleryItems.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      {item.imageUrl && (
                        <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
                      )}
                      <div className="p-4">
                        <p className="font-bold">{item.title}</p>
                        <p className="text-sm text-gray-600">{item.category}</p>
                        <Button
                          onClick={() => deleteGalleryItem(item.id)}
                          variant="destructive"
                          size="sm"
                          className="mt-4 w-full"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* FAQs TAB */}
          <TabsContent value="faqs">
            <div className="bg-white p-8 rounded-[24px]">
              <h2 className="font-['Anybody',_sans-serif] text-[#191919] mb-6 tracking-[-1px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700, fontSize: '24px' }}>
                Manage FAQs
              </h2>

              {/* Add/Edit FAQ Form */}
              <div className="bg-[#f1f1f1] p-6 rounded-lg mb-8">
                <h3 className="font-['Anybody',_sans-serif] text-[#191919] mb-4" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700, fontSize: '18px' }}>
                  {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
                </h3>
                <form onSubmit={editingFaq ? handleFaqUpdate : handleFaqSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="faq-category" className="font-['Roboto_Mono',_sans-serif] uppercase text-[11px] tracking-wider">
                      Category *
                    </Label>
                    <Input
                      id="faq-category"
                      value={editingFaq ? editingFaq.category : newFaq.category}
                      onChange={(e) => editingFaq 
                        ? setEditingFaq({ ...editingFaq, category: e.target.value })
                        : setNewFaq({ ...newFaq, category: e.target.value })
                      }
                      placeholder="e.g., Services, Pricing, Timeline"
                      required
                      className="mt-2 bg-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="faq-question" className="font-['Roboto_Mono',_sans-serif] uppercase text-[11px] tracking-wider">
                      Question *
                    </Label>
                    <Input
                      id="faq-question"
                      value={editingFaq ? editingFaq.question : newFaq.question}
                      onChange={(e) => editingFaq 
                        ? setEditingFaq({ ...editingFaq, question: e.target.value })
                        : setNewFaq({ ...newFaq, question: e.target.value })
                      }
                      required
                      className="mt-2 bg-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="faq-answer" className="font-['Roboto_Mono',_sans-serif] uppercase text-[11px] tracking-wider">
                      Answer *
                    </Label>
                    <Textarea
                      id="faq-answer"
                      value={editingFaq ? editingFaq.answer : newFaq.answer}
                      onChange={(e) => editingFaq 
                        ? setEditingFaq({ ...editingFaq, answer: e.target.value })
                        : setNewFaq({ ...newFaq, answer: e.target.value })
                      }
                      rows={4}
                      required
                      className="mt-2 bg-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="faq-order" className="font-['Roboto_Mono',_sans-serif] uppercase text-[11px] tracking-wider">
                      Display Order
                    </Label>
                    <Input
                      id="faq-order"
                      type="number"
                      value={editingFaq ? editingFaq.order : newFaq.order}
                      onChange={(e) => editingFaq 
                        ? setEditingFaq({ ...editingFaq, order: parseInt(e.target.value) })
                        : setNewFaq({ ...newFaq, order: parseInt(e.target.value) })
                      }
                      className="mt-2 bg-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      type="submit" 
                      className="bg-black hover:bg-black/90 text-white rounded-[24px] font-['Roboto_Mono',_sans-serif] uppercase text-[11px] tracking-wider"
                    >
                      {editingFaq ? 'Update FAQ' : 'Add FAQ'}
                    </Button>
                    {editingFaq && (
                      <Button 
                        type="button"
                        onClick={() => setEditingFaq(null)}
                        variant="outline"
                        className="rounded-[24px] font-['Roboto_Mono',_sans-serif] uppercase text-[11px] tracking-wider"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </div>

              {/* FAQs List */}
              {loadingFaqs ? (
                <p>Loading FAQs...</p>
              ) : (
                <div className="space-y-4">
                  {faqs.map((faq) => (
                    <div key={faq.id} className="border border-gray-200 p-6 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">{faq.category}</p>
                          <p className="font-bold text-lg mb-2">{faq.question}</p>
                          <p className="text-gray-700">{faq.answer}</p>
                          <p className="text-sm text-gray-500 mt-2">Order: {faq.order}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            onClick={() => setEditingFaq(faq)}
                            variant="outline"
                            size="sm"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => deleteFaq(faq.id)}
                            variant="destructive"
                            size="sm"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* SITE INFO TAB */}
          <TabsContent value="siteinfo">
            <div className="bg-white p-8 rounded-[24px]">
              <h2 className="font-['Anybody',_sans-serif] text-[#191919] mb-6 tracking-[-1px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700, fontSize: '24px' }}>
                Site Information
              </h2>

              {loadingSiteInfo ? (
                <p>Loading site info...</p>
              ) : (
                <form onSubmit={handleSiteInfoUpdate} className="space-y-6">
                  <div>
                    <Label htmlFor="site-name" className="font-['Roboto_Mono',_sans-serif] uppercase text-[11px] tracking-wider">
                      Site Name
                    </Label>
                    <Input
                      id="site-name"
                      value={siteInfo.name}
                      onChange={(e) => setSiteInfo({ ...siteInfo, name: e.target.value })}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="site-tagline" className="font-['Roboto_Mono',_sans-serif] uppercase text-[11px] tracking-wider">
                      Tagline
                    </Label>
                    <Input
                      id="site-tagline"
                      value={siteInfo.tagline}
                      onChange={(e) => setSiteInfo({ ...siteInfo, tagline: e.target.value })}
                      className="mt-2"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="site-email" className="font-['Roboto_Mono',_sans-serif] uppercase text-[11px] tracking-wider">
                        Email
                      </Label>
                      <Input
                        id="site-email"
                        type="email"
                        value={siteInfo.email}
                        onChange={(e) => setSiteInfo({ ...siteInfo, email: e.target.value })}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="site-phone" className="font-['Roboto_Mono',_sans-serif] uppercase text-[11px] tracking-wider">
                        Phone
                      </Label>
                      <Input
                        id="site-phone"
                        value={siteInfo.phone}
                        onChange={(e) => setSiteInfo({ ...siteInfo, phone: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="site-service-area" className="font-['Roboto_Mono',_sans-serif] uppercase text-[11px] tracking-wider">
                      Service Area
                    </Label>
                    <Input
                      id="site-service-area"
                      value={siteInfo.serviceArea}
                      onChange={(e) => setSiteInfo({ ...siteInfo, serviceArea: e.target.value })}
                      className="mt-2"
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-['Anybody',_sans-serif] text-[#191919]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700, fontSize: '16px' }}>
                      Business Hours
                    </h3>
                    
                    <div>
                      <Label htmlFor="hours-weekdays" className="font-['Roboto_Mono',_sans-serif] uppercase text-[11px] tracking-wider">
                        Weekdays
                      </Label>
                      <Input
                        id="hours-weekdays"
                        value={siteInfo.businessHours.weekdays}
                        onChange={(e) => setSiteInfo({ 
                          ...siteInfo, 
                          businessHours: { ...siteInfo.businessHours, weekdays: e.target.value }
                        })}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="hours-saturday" className="font-['Roboto_Mono',_sans-serif] uppercase text-[11px] tracking-wider">
                        Saturday
                      </Label>
                      <Input
                        id="hours-saturday"
                        value={siteInfo.businessHours.saturday}
                        onChange={(e) => setSiteInfo({ 
                          ...siteInfo, 
                          businessHours: { ...siteInfo.businessHours, saturday: e.target.value }
                        })}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="hours-sunday" className="font-['Roboto_Mono',_sans-serif] uppercase text-[11px] tracking-wider">
                        Sunday
                      </Label>
                      <Input
                        id="hours-sunday"
                        value={siteInfo.businessHours.sunday}
                        onChange={(e) => setSiteInfo({ 
                          ...siteInfo, 
                          businessHours: { ...siteInfo.businessHours, sunday: e.target.value }
                        })}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="bg-black hover:bg-black/90 text-white rounded-[32px] py-6 px-8 font-['Roboto_Mono',_sans-serif] uppercase tracking-wider"
                  >
                    Update Site Information
                  </Button>
                </form>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
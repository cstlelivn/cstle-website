import { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { reviewsContent } from '../content/reviews-content';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Review {
  id: string;
  name: string;
  role: string;
  rating: number;
  text: string;
  date: string;
  email?: string;
}

export function Reviews() {
  // Use local reviews content instead of fetching
  const reviews = reviewsContent.testimonials.map(t => ({
    id: t.id.toString(),
    name: t.name,
    role: t.role,
    rating: t.rating,
    text: t.text,
    date: t.date,
  }));
  
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    rating: "5",
    text: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6e189709/reviews`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        alert("✅ Thank you for your review! It has been published.");
        setFormData({
          name: "",
          email: "",
          role: "",
          rating: "5",
          text: ""
        });
      } else {
        const error = await response.json();
        alert(`Failed to submit review: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-white content-stretch flex flex-col items-center relative min-h-screen w-full">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-[#f1f1f1] to-white w-full flex flex-col items-center pt-[28px] md:pt-[56px] pb-[40px] md:pb-[80px]">
        <Header />
        
        <div className="mt-[40px] md:mt-[80px] text-center px-4">
          <h1 className="font-['Anybody',_sans-serif] text-[#191919] tracking-[-1.2px] md:tracking-[-1.563px] hyphens-none" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 800, fontSize: '32px' }}>
            Client Reviews
          </h1>
          <p className="font-['Anybody',_sans-serif] text-[#191919] mt-4 max-w-2xl mx-auto" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 600, fontSize: '16px' }}>
            What our clients say about working with us
          </p>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="w-full max-w-[1400px] mx-auto px-[20px] md:px-[40px] lg:px-[80px] py-[50px] md:py-[80px] lg:py-[100px]">
        {reviews.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-['Anybody',_sans-serif] text-[#191919]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500, fontSize: '18px' }}>
              No reviews yet. Be the first to share your experience!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-20">
            {reviews.map((review) => (
              <div 
                key={review.id}
                className="bg-[#f1f1f1] p-6 md:p-8 rounded-[20px] md:rounded-[24px] flex flex-col justify-between hover:shadow-lg transition-shadow"
              >
                <div>
                  <div className="flex mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-[#191919]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  
                  <p className="font-['Anybody',_sans-serif] text-[#191919] mb-6 leading-relaxed" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500, fontSize: '14px' }}>
                    "{review.text}"
                  </p>
                </div>
                
                <div className="border-t border-[#191919]/10 pt-4">
                  <p className="font-['Anybody',_sans-serif] text-[#191919] mb-1" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 800, fontSize: '16px' }}>
                    {review.name}
                  </p>
                  <p className="font-['Roboto_Mono',_sans-serif] text-[#666] uppercase text-[10px] tracking-wider mb-2">
                    {review.role}
                  </p>
                  <p className="font-['Anybody',_sans-serif] text-[#848580] text-[12px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}>
                    {new Date(review.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Leave a Review Section */}
        <div className="max-w-[800px] mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-['Anybody',_sans-serif] text-[#191919] mb-4 tracking-[-0.8px] md:tracking-[-1px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 800, fontSize: '28px' }}>
              Share Your Experience
            </h2>
            <p className="font-['Anybody',_sans-serif] text-[#191919]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500, fontSize: '16px' }}>
              We'd love to hear about your experience working with us
            </p>
          </div>

          <div className="bg-[#f1f1f1] p-12 rounded-[32px]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="font-['Roboto_Mono',_sans-serif] uppercase text-[12px] tracking-wider">
                    Your Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-2 bg-white border-none"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="font-['Roboto_Mono',_sans-serif] uppercase text-[12px] tracking-wider">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-2 bg-white border-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="role" className="font-['Roboto_Mono',_sans-serif] uppercase text-[12px] tracking-wider">
                    Role *
                  </Label>
                  <Input
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="e.g., Homeowner, Contractor, Designer"
                    required
                    className="mt-2 bg-white border-none"
                  />
                </div>

                <div>
                  <Label htmlFor="rating" className="font-['Roboto_Mono',_sans-serif] uppercase text-[12px] tracking-wider">
                    Rating *
                  </Label>
                  <select
                    id="rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full bg-white border-none rounded-md px-3 py-2 h-10"
                  >
                    <option value="5">5 Stars - Excellent</option>
                    <option value="4">4 Stars - Very Good</option>
                    <option value="3">3 Stars - Good</option>
                    <option value="2">2 Stars - Fair</option>
                    <option value="1">1 Star - Poor</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="text" className="font-['Roboto_Mono',_sans-serif] uppercase text-[12px] tracking-wider">
                  Your Review *
                </Label>
                <Textarea
                  id="text"
                  name="text"
                  value={formData.text}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Tell us about your experience..."
                  className="mt-2 bg-white border-none resize-none"
                />
              </div>

              <Button 
                type="submit"
                disabled={submitting}
                className="w-full bg-black hover:bg-black/90 text-white rounded-[32px] py-6 font-['Roboto_Mono',_sans-serif] uppercase tracking-wider disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black w-full">
        <Footer />
      </div>
    </div>
  );
}
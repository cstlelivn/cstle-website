import { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { siteInfo } from "../content/site-info";
import { serviceTypes } from "../content/services";
import svgPaths from "../imports/svg-eom6d2fu0o";
import { projectId, publicAnonKey } from '../utils/supabase/info';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    projectType: "",
    message: "",
    company: "" // Honeypot field
  });

  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = (email: string): boolean => {
    return /^\S+@\S+\.\S+$/.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true; // Phone is optional
    return /^[\d\s\+\-\(\)]+$/.test(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check - silently drop if filled
    if (formData.company) {
      setFormData({ firstName: "", lastName: "", email: "", phone: "", projectType: "", message: "", company: "" });
      setFormState('success');
      return;
    }

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      setErrorMessage("Please fill in all required fields.");
      setFormState('error');
      return;
    }

    if (!validateEmail(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      setFormState('error');
      return;
    }

    if (!validatePhone(formData.phone)) {
      setErrorMessage("Please enter a valid phone number.");
      setFormState('error');
      return;
    }

    setFormState('submitting');
    setErrorMessage("");
    
    try {
      // Insert into Supabase leads table using REST API.
      //
      // IMPORTANT: "Prefer: return=minimal", not "return=representation".
      // A public visitor is allowed to INSERT a lead (leads_insert_web /
      // leads_public_insert RLS policies, anon role) but is deliberately
      // NOT allowed to read leads back (leads_select requires
      // can_view_crm(), staff-only). Postgres RLS treats "hand the new row
      // back to the caller" as a read, governed by the SELECT policy, not
      // the INSERT policy -- asking for return=representation here made
      // the whole insert fail with a generic RLS error, because the
      // visitor could insert but could never be handed back the row they
      // just created. return=minimal skips that read entirely: the
      // response body is empty on success, which is all this form needs.
      const response = await fetch(`https://${projectId}.supabase.co/rest/v1/leads`, {
        method: "POST",
        headers: {
          "apikey": publicAnonKey,
          "Authorization": `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          source_form: "contact",
          first_name: formData.firstName,
          last_name: formData.lastName,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone || null,
          project_type: formData.projectType || null,
          message: formData.message,
          status: "new"
        })
      });

      if (!response.ok) {
        // return=minimal means an error response may still carry a JSON
        // body describing what went wrong -- but don't assume it does.
        let message = `HTTP error ${response.status}`;
        try {
          const errorData = await response.json();
          console.error('Supabase insert error:', errorData);
          if (errorData?.message) message = errorData.message;
        } catch {
          // No JSON body to parse -- the generic message above stands.
        }
        throw new Error(message);
      }

      console.log('Successfully inserted contact lead');

      // Success! Form submission complete
      // Note: Email notifications removed due to CORS. Admin can view leads in Supabase dashboard or admin app.
      setFormState('success');
      setFormData({ firstName: "", lastName: "", email: "", phone: "", projectType: "", message: "", company: "" });
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error) {
      console.error("Error submitting contact:", error);
      setErrorMessage("There was an error submitting your message. Please try again or contact us directly.");
      setFormState('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (formState === 'error') {
      setErrorMessage("");
      setFormState('idle');
    }
  };

  return (
    <div className="bg-white content-stretch flex flex-col items-center relative min-h-screen w-full">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-[#f1f1f1] to-white w-full flex flex-col items-center pt-[28px] md:pt-[56px] pb-[40px] md:pb-[80px] gap-[40px] md:gap-[80px]">
        <Header />
        
        <div className="box-border content-stretch flex flex-col items-start px-[20px] md:px-[16px] py-0 relative shrink-0 w-full max-w-[704px]">
          <div className="relative shrink-0 w-full">
            <div className="flex flex-row items-center justify-center size-full">
              <div className="box-border content-stretch flex gap-[10px] items-center justify-center px-[10px] md:px-[23px] py-0 relative w-full">
                <h1 className="font-['Anybody',_sans-serif] leading-[1.031] relative text-[#191919] text-[28px] md:text-[39.075px] text-center tracking-[-1.12px] md:tracking-[-1.563px] hyphens-none" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700 }}>
                  Get In Touch
                </h1>
              </div>
            </div>
          </div>
          <div className="relative shrink-0 w-full">
            <div className="flex flex-row items-center justify-center size-full">
              <div className="box-border content-stretch flex gap-[10px] items-center justify-center p-[10px] relative w-full">
                <p className="font-['Anybody',_sans-serif] leading-[1.64] relative text-[#191919] text-[13px] md:text-[15px] text-center tracking-[-0.52px] md:tracking-[-0.6px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700 }}>
                  Let's discuss your next project
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Content */}
      <div className="content-center flex flex-col lg:flex-row gap-[30px] md:gap-[40px] lg:gap-[50px] items-start justify-center max-w-[1000px] relative shrink-0 w-full mb-[60px] md:mb-[112px] px-[20px] md:px-[40px]">
        {/* Left Side - Contact Info */}
        <div className="content-stretch flex flex-col gap-[24px] md:gap-[32px] items-start relative shrink-0 w-full lg:w-[468px]">
          {/* Let's Work Together */}
          <div className="content-stretch flex flex-col gap-[16px] md:gap-[24px] items-start relative shrink-0 w-full">
            <div className="content-stretch flex gap-[10px] items-start relative shrink-0 w-full">
              <p className="font-['Anybody',_sans-serif] leading-[1.64] relative text-[#191919] text-[15px] tracking-[-0.6px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700 }}>
                Let's Work Together
              </p>
            </div>
            <div className="box-border content-stretch flex gap-[10px] items-center justify-center px-0 py-px relative shrink-0 w-full">
              <p className="font-['Anybody',_sans-serif] leading-[1.64] relative text-[#191919] text-[14px] tracking-[-0.56px] w-full" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}>
                Whether you're a contractor, designer, or homeowner, we're here to help bring your vision to life with expert finishing installations.
              </p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="content-stretch flex flex-col gap-[20px] md:gap-[24px] items-start relative shrink-0 w-full">
            {/* Email */}
            <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
              <div className="bg-[#f1f1f1] relative rounded-full shrink-0 size-[48px] flex items-center justify-center">
                <div className="h-[24px] w-[24px]">
                  <svg className="block size-full" fill="none" viewBox="0 0 20 16">
                    <path d={svgPaths.p3ea2cd00} stroke="#0A0A0A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col gap-[4px] flex-1 min-w-0">
                <p className="font-['Roboto_Mono',_sans-serif] text-[12px] text-neutral-950 tracking-[0.6px] uppercase">Email</p>
                <a href={`mailto:${siteInfo.contact.email}`} className="font-['Anybody',_sans-serif] leading-[1.64] text-[#191919] text-[14px] md:text-[15px] tracking-[-0.6px] break-words hover:opacity-70 transition-opacity" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700 }}>
                  {siteInfo.contact.email}
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
              <div className="bg-[#f1f1f1] relative rounded-full shrink-0 size-[48px] flex items-center justify-center">
                <div className="h-[24px] w-[24px]">
                  <svg className="block size-full" fill="none" viewBox="0 0 20 20">
                    <path d={svgPaths.p262b1780} stroke="#0A0A0A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col gap-[4px] flex-1 min-w-0">
                <p className="font-['Roboto_Mono',_sans-serif] text-[12px] text-neutral-950 tracking-[0.6px] uppercase">Phone</p>
                <a href={`tel:${siteInfo.contact.phoneFormatted}`} className="font-['Anybody',_sans-serif] leading-[1.64] text-[#191919] text-[14px] md:text-[15px] tracking-[-0.6px] break-words hover:opacity-70 transition-opacity" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700 }}>
                  {siteInfo.contact.phone}
                </a>
              </div>
            </div>

            {/* Service Area */}
            <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
              <div className="bg-[#f1f1f1] relative rounded-full shrink-0 size-[48px] flex items-center justify-center">
                <div className="h-[24px] w-[24px]">
                  <svg className="block size-full" fill="none" viewBox="0 0 18 21">
                    <path d={svgPaths.p30ab3100} stroke="#0A0A0A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                  <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[6px] w-[6px]" fill="none" viewBox="0 0 8 8">
                    <path d={svgPaths.p25f258f2} stroke="#0A0A0A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col gap-[4px] flex-1 min-w-0">
                <p className="font-['Roboto_Mono',_sans-serif] text-[12px] text-neutral-950 tracking-[0.6px] uppercase">Service Area</p>
                <p className="font-['Anybody',_sans-serif] leading-[1.64] text-[#191919] text-[14px] md:text-[15px] tracking-[-0.6px] break-words" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700 }}>
                  {siteInfo.serviceArea}
                </p>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-[#f1f1f1] relative rounded-[20px] md:rounded-[24px] shrink-0 w-full p-[24px] md:p-[32px]">
            <div className="flex flex-col gap-[12px] md:gap-[16px]">
              <p className="font-['Anybody',_sans-serif] leading-[1.64] text-[#191919] text-[15px] tracking-[-0.6px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700 }}>
                Business Hours
              </p>
              <div className="flex flex-col gap-[8px]">
                <p className="font-['Anybody',_sans-serif] leading-[1.64] text-[#191919] text-[13px] md:text-[14px] tracking-[-0.56px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}>
                  {siteInfo.businessHours.weekdays}
                </p>
                <p className="font-['Anybody',_sans-serif] leading-[1.64] text-[#191919] text-[13px] md:text-[14px] tracking-[-0.56px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}>
                  {siteInfo.businessHours.saturday}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div className="bg-[#f1f1f1] box-border content-stretch flex flex-col items-start p-[24px] md:p-[32px] lg:p-[40px] relative rounded-[24px] md:rounded-[32px] shrink-0 w-full lg:w-[468px]">
          <form onSubmit={handleSubmit} className="content-stretch flex flex-col gap-[20px] md:gap-[24px] items-start relative shrink-0 w-full">
            {/* First Name Field */}
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              <label htmlFor="firstName" className="font-['Roboto_Mono',_sans-serif] font-bold leading-[1.2] relative shrink-0 text-[11px] text-neutral-950 uppercase">
                First Name *
              </label>
              <input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="bg-white h-[44px] md:h-[48px] rounded-[8px] shrink-0 w-full px-3 border-none outline-none font-['Anybody',_sans-serif] text-[14px]"
                style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}
              />
            </div>

            {/* Last Name Field */}
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              <label htmlFor="lastName" className="font-['Roboto_Mono',_sans-serif] font-bold leading-[1.2] relative shrink-0 text-[11px] text-neutral-950 uppercase">
                Last Name *
              </label>
              <input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="bg-white h-[44px] md:h-[48px] rounded-[8px] shrink-0 w-full px-3 border-none outline-none font-['Anybody',_sans-serif] text-[14px]"
                style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}
              />
            </div>

            {/* Email Field */}
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              <label htmlFor="email" className="font-['Roboto_Mono',_sans-serif] font-bold leading-[1.2] relative shrink-0 text-[11px] text-neutral-950 uppercase">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-white h-[44px] md:h-[48px] rounded-[8px] shrink-0 w-full px-3 border-none outline-none font-['Anybody',_sans-serif] text-[14px]"
                style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}
              />
            </div>

            {/* Phone Field */}
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              <label htmlFor="phone" className="font-['Roboto_Mono',_sans-serif] font-bold leading-[1.2] relative shrink-0 text-[11px] text-neutral-950 uppercase">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="bg-white h-[44px] md:h-[48px] rounded-[8px] shrink-0 w-full px-3 border-none outline-none font-['Anybody',_sans-serif] text-[14px]"
                style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}
              />
            </div>

            {/* Project Type Field */}
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              <label htmlFor="projectType" className="font-['Roboto_Mono',_sans-serif] font-bold leading-[1.2] relative shrink-0 text-[11px] text-neutral-950 uppercase">
                Project Type
              </label>
              <select
                id="projectType"
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                className="bg-white h-[44px] md:h-[48px] rounded-[8px] shrink-0 w-full px-3 border-none outline-none font-['Anybody',_sans-serif] text-[13px] md:text-[14px] cursor-pointer"
                style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}
              >
                <option value="">Select a service</option>
                {serviceTypes.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>

            {/* Message Field */}
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              <label htmlFor="message" className="font-['Roboto_Mono',_sans-serif] font-bold leading-[1.2] relative shrink-0 text-[11px] text-neutral-950 uppercase">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="bg-white min-h-[100px] rounded-[8px] shrink-0 w-full px-3 py-3 border-none outline-none resize-y font-['Anybody',_sans-serif] text-[14px]"
                style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}
              />
            </div>

            {/* Honeypot field - hidden from users */}
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              style={{ position: 'absolute', left: '-9999px', height: 0, width: 0 }}
              tabIndex={-1}
              autoComplete="off"
            />

            {/* Success Message */}
            {formState === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-[8px] p-4 w-full">
                <p className="font-['Anybody',_sans-serif] leading-[1.64] text-green-800 text-[14px] tracking-[-0.56px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700 }}>
                  Thanks—your message was received. We'll reply within 1 business day.
                </p>
              </div>
            )}

            {/* Error Message */}
            {formState === 'error' && errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-[8px] p-4 w-full">
                <p className="font-['Anybody',_sans-serif] leading-[1.64] text-red-800 text-[14px] tracking-[-0.56px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700 }}>
                  {errorMessage}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={formState === 'submitting'}
              className="bg-black min-h-[48px] md:min-h-[52px] relative rounded-[32px] shrink-0 w-full hover:bg-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed py-3"
            >
              <p className="font-['Roboto_Mono',_sans-serif] font-bold leading-[1.2] text-[12px] text-white uppercase text-center">
                {formState === 'submitting' ? 'Sending...' : 'Send Message'}
              </p>
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
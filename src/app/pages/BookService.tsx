import { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { format } from "date-fns";
import svgPaths from "../imports/svg-y52ip8r7g1";
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { serviceTypes, timeSlots, formatTime12Hour } from "../content/services";

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export function BookService() {
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    serviceType: "",
    consultationTime: "",
    projectDetails: "",
    company: "" // Honeypot field
  });
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = (email: string): boolean => {
    return /^\S+@\S+\.\S+$/.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    return /^[\d\s\+\-\(\)]+$/.test(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check - silently drop if filled
    if (formData.company) {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        province: "",
        serviceType: "",
        consultationTime: "",
        projectDetails: "",
        company: ""
      });
      setDate(undefined);
      setFormState('success');
      return;
    }

    // Validation — email or phone required; project details is optional
    if (!formData.firstName || !formData.lastName || !formData.address || !formData.city || !formData.province || !formData.serviceType) {
      setErrorMessage("Please fill in all required fields.");
      setFormState('error');
      return;
    }

    if (!formData.email && !formData.phone) {
      setErrorMessage("Please provide an email address or phone number so we can reach you.");
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
          source_form: "booking",
          first_name: formData.firstName,
          last_name: formData.lastName,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email || null,
          phone: formData.phone || null,
          project_address: formData.address || null,
          city: formData.city || null,
          province: formData.province || null,
          service_type: formData.serviceType,
          project_type: formData.serviceType,
          consultation_date: date ? date.toISOString() : null,
          consultation_time: formData.consultationTime || null,
          project_details: formData.projectDetails || null,
          notes: formData.projectDetails || null,
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

      console.log('Successfully inserted booking lead');

      // Success! Booking submitted
      // Note: Email notifications removed due to CORS. Admin can view leads in Supabase dashboard or admin app.
      setFormState('success');
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        province: "",
        serviceType: "",
        consultationTime: "",
        projectDetails: "",
        company: ""
      });
      setDate(undefined);
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error) {
      console.error("Error submitting booking:", error);
      setErrorMessage("There was an error submitting your booking. Please try again or contact us directly.");
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
    <div className="bg-white content-stretch flex flex-col items-center relative w-full">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-[#d9d9d9] to-[#ffffff] relative shrink-0 w-full">
        <div className="flex flex-col items-center size-full">
          <div className="box-border content-stretch flex flex-col gap-[40px] md:gap-[80px] items-center px-px py-[28px] md:py-[56px] relative w-full">
            <Header />
            <div className="box-border content-stretch flex flex-col items-start px-[20px] md:px-[16px] py-0 relative shrink-0 w-full max-w-[704px]">
              <div className="relative shrink-0 w-full">
                <div className="flex flex-row items-center justify-center size-full">
                  <div className="box-border content-stretch flex gap-[10px] items-center justify-center px-[10px] md:px-[23px] py-0 relative w-full">
                    <h1 className="font-['Anybody',_sans-serif] leading-[1.031] relative text-[#191919] text-[28px] md:text-[39.075px] text-center tracking-[-1.12px] md:tracking-[-1.563px] hyphens-none" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700 }}>
                      Request a Free Estimate
                    </h1>
                  </div>
                </div>
              </div>
              <div className="relative shrink-0 w-full">
                <div className="flex flex-row items-center justify-center size-full">
                  <div className="box-border content-stretch flex gap-[10px] items-center justify-center p-[10px] relative w-full">
                    <p className="font-['Anybody',_sans-serif] leading-[1.64] relative text-[#191919] text-[13px] md:text-[15px] text-center tracking-[-0.52px] md:tracking-[-0.6px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 600 }}>
                      Tell us about your project and {"we'll"} contact you to discuss the next step.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="box-border content-stretch flex flex-col gap-[60px] md:gap-[100px] items-start px-[20px] md:px-[40px] py-[50px] md:py-[100px] relative shrink-0 w-full max-w-[1008px]">
        <div className="bg-[#f1f1f1] relative rounded-[20px] md:rounded-[32px] shrink-0 w-full">
          <div className="size-full">
            <div className="box-border content-stretch flex flex-col items-start p-[20px] md:p-[32px] lg:pb-[20px] lg:pt-[48px] lg:px-[48px] relative w-full">
              <form onSubmit={handleSubmit} className="content-stretch flex flex-col gap-[32px] md:gap-[48px] lg:gap-[61px] items-start relative shrink-0 w-full">
                {/* Personal Information */}
                <div className="content-stretch flex flex-col gap-[20px] md:gap-[24px] items-start relative shrink-0 w-full">
                  <div className="content-stretch flex gap-[10px] items-start relative shrink-0 w-full">
                    <p className="font-['Anybody',_sans-serif] leading-[1.64] relative text-[#191919] text-[15px] tracking-[-0.6px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700 }}>
                      Personal Information
                    </p>
                  </div>
                  
                  <div className="gap-[16px] md:gap-[24px] grid grid-cols-1 md:grid-cols-2 relative shrink-0 w-full">
                    {/* First Name */}
                    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                      <label htmlFor="firstName" className="font-['Roboto_Mono',_sans-serif] leading-[1.2] relative shrink-0 text-[11px] text-neutral-950 uppercase" style={{ fontWeight: 700 }}>
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="bg-white h-[44px] md:h-[48px] rounded-[8px] shrink-0 w-full px-3 outline-none font-['Anybody',_sans-serif] text-[14px]"
                        style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}
                      />
                    </div>

                    {/* Last Name */}
                    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                      <label htmlFor="lastName" className="font-['Roboto_Mono',_sans-serif] leading-[1.2] relative shrink-0 text-[11px] text-neutral-950 uppercase" style={{ fontWeight: 700 }}>
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="bg-white h-[44px] md:h-[48px] rounded-[8px] shrink-0 w-full px-3 outline-none font-['Anybody',_sans-serif] text-[14px]"
                        style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}
                      />
                    </div>

                    {/* Email */}
                    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                      <label htmlFor="email" className="font-['Roboto_Mono',_sans-serif] leading-[1.2] relative shrink-0 text-[11px] text-neutral-950 uppercase" style={{ fontWeight: 700 }}>
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="bg-white h-[44px] md:h-[48px] rounded-[8px] shrink-0 w-full px-3 outline-none font-['Anybody',_sans-serif] text-[14px]"
                        style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                      <label htmlFor="phone" className="font-['Roboto_Mono',_sans-serif] leading-[1.2] relative shrink-0 text-[11px] text-neutral-950 uppercase" style={{ fontWeight: 700 }}>
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="bg-white h-[44px] md:h-[48px] rounded-[8px] shrink-0 w-full px-3 outline-none font-['Anybody',_sans-serif] text-[14px]"
                        style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}
                      />
                    </div>

                    {/* Project Address */}
                    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                      <label htmlFor="address" className="font-['Roboto_Mono',_sans-serif] leading-[1.2] relative shrink-0 text-[11px] text-neutral-950 uppercase" style={{ fontWeight: 700 }}>
                        Project Address *
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="bg-white h-[44px] md:h-[48px] rounded-[8px] shrink-0 w-full px-3 outline-none font-['Anybody',_sans-serif] text-[14px] placeholder:text-[#848580]"
                        style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}
                      />
                    </div>

                    {/* City + Province -- split into two within the same slot Province used to occupy alone */}
                    <div className="gap-[16px] md:gap-[24px] grid grid-cols-2 relative shrink-0 w-full">
                      <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                        <label htmlFor="city" className="font-['Roboto_Mono',_sans-serif] leading-[1.2] relative shrink-0 text-[11px] text-neutral-950 uppercase" style={{ fontWeight: 700 }}>
                          City *
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          className="bg-white h-[44px] md:h-[48px] rounded-[8px] shrink-0 w-full px-3 outline-none font-['Anybody',_sans-serif] text-[14px] placeholder:text-[#848580]"
                          style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}
                        />
                      </div>

                      <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                        <label htmlFor="province" className="font-['Roboto_Mono',_sans-serif] leading-[1.2] relative shrink-0 text-[11px] text-neutral-950 uppercase" style={{ fontWeight: 700 }}>
                          Province *
                        </label>
                        <select
                          id="province"
                          name="province"
                          value={formData.province}
                          onChange={handleChange}
                          required
                          className="bg-white h-[44px] md:h-[48px] rounded-[8px] shrink-0 w-full px-3 outline-none font-['Anybody',_sans-serif] text-[13px] md:text-[14px] cursor-pointer"
                          style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}
                        >
                          <option value="">Select province</option>
                          <option value="Saskatchewan">Saskatchewan</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="content-stretch flex flex-col gap-[20px] md:gap-[24px] items-start relative shrink-0 w-full">
                  <div className="content-stretch flex gap-[10px] items-start relative shrink-0 w-full">
                    <p className="font-['Anybody',_sans-serif] leading-[1.64] relative text-[#191919] text-[15px] tracking-[-0.6px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700 }}>
                      Project Details
                    </p>
                  </div>
                  
                  <div className="content-stretch flex flex-col gap-[20px] md:gap-[24px] items-start relative shrink-0 w-full">
                    <div className="content-stretch flex flex-col md:flex-row gap-[20px] md:gap-[24px] items-start relative shrink-0 w-full">
                      {/* Preferred Consultation Date */}
                      <div className="w-full md:flex-1 content-stretch flex flex-col gap-[8px] items-start relative shrink-0">
                        <label className="font-['Roboto_Mono',_sans-serif] leading-[1.2] relative shrink-0 text-[11px] text-neutral-950 uppercase" style={{ fontWeight: 700 }}>
                          Preferred Consultation Date
                        </label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="bg-white box-border content-stretch flex gap-[8px] h-[44px] md:h-[48px] items-center px-[16px] py-0 relative rounded-[8px] shrink-0 w-full hover:bg-gray-50 transition-colors text-left"
                            >
                              <div className="h-[24px] relative shrink-0 w-[24px] flex-shrink-0">
                                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                                  <path d={svgPaths.p0} stroke="#0A0A0A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                </svg>
                              </div>
                              <p className="flex-1 font-['Anybody',_sans-serif] leading-[1.64] text-[#191919] text-[13px] md:text-[14px] tracking-[-0.52px] md:tracking-[-0.56px] truncate" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}>
                                {date ? format(date, "PPP") : "Select a date"}
                              </p>
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      {/* Preferred Consultation Time */}
                      <div className="w-full md:flex-1 content-stretch flex flex-col gap-[8px] items-start relative shrink-0">
                        <label htmlFor="consultationTime" className="font-['Roboto_Mono',_sans-serif] leading-[1.2] relative shrink-0 text-[11px] text-neutral-950 uppercase" style={{ fontWeight: 700 }}>
                          Preferred Time
                        </label>
                        <select
                          id="consultationTime"
                          name="consultationTime"
                          value={formData.consultationTime}
                          onChange={handleChange}
                          className="bg-white h-[44px] md:h-[48px] rounded-[8px] shrink-0 w-full px-3 outline-none font-['Anybody',_sans-serif] text-[13px] md:text-[14px] cursor-pointer"
                          style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}
                        >
                          <option value="">Select a time</option>
                          {timeSlots.map((time) => (
                            <option key={time} value={time}>
                              {formatTime12Hour(time)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="content-stretch flex flex-col md:flex-row gap-[20px] md:gap-[24px] items-start relative shrink-0 w-full">
                      {/* Service Type */}
                      <div className="w-full md:flex-1 content-stretch flex flex-col gap-[8px] items-start relative shrink-0">
                        <label htmlFor="serviceType" className="font-['Roboto_Mono',_sans-serif] leading-[1.2] relative shrink-0 text-[11px] text-neutral-950 uppercase" style={{ fontWeight: 700 }}>
                          Service Type *
                        </label>
                        <select
                          id="serviceType"
                          name="serviceType"
                          value={formData.serviceType}
                          onChange={handleChange}
                          required
                          className="bg-white h-[44px] md:h-[48px] rounded-[8px] shrink-0 w-full px-3 outline-none font-['Anybody',_sans-serif] text-[13px] md:text-[14px] cursor-pointer"
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
                    </div>

                    {/* Project Details Textarea */}
                    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                      <label htmlFor="projectDetails" className="font-['Roboto_Mono',_sans-serif] leading-[1.2] relative shrink-0 text-[11px] text-neutral-950 uppercase" style={{ fontWeight: 700 }}>
                        Project Details
                      </label>
                      <textarea
                        id="projectDetails"
                        name="projectDetails"
                        value={formData.projectDetails}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Tell us about your project..."
                        className="bg-white min-h-[120px] rounded-[8px] shrink-0 w-full px-3 py-3 outline-none resize-y font-['Anybody',_sans-serif] text-[13px] md:text-[14px] placeholder:text-[#848580]"
                        style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}
                      />
                    </div>
                  </div>
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
                      {"Thank you—your request has been received. We'll contact you to discuss your project and the next step."}
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
                <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
                  <button
                    type="submit"
                    disabled={formState === 'submitting'}
                    className="bg-black min-h-[48px] md:min-h-[52px] relative rounded-[32px] shrink-0 w-full hover:bg-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed py-3"
                  >
                    <p className="font-['Roboto_Mono',_sans-serif] leading-[1.2] text-[12px] text-white uppercase text-center" style={{ fontWeight: 700 }}>
                      {formState === 'submitting' ? 'Submitting...' : 'Submit Request'}
                    </p>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
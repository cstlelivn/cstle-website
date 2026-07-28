/**
 * Book Service page content
 * Update this file to change text on the book service page
 */

export const bookServiceContent = {
  hero: {
    title: "Book a Service",
    subtitle: "Schedule your free consultation to get started.",
  },
  
  form: {
    personalInfo: {
      title: "Personal Information",
      fields: {
        firstName: "First Name *",
        lastName: "Last Name *",
        email: "Email Address *",
        phone: "Phone Number *",
        address: "Address",
      }
    },
    
    projectDetails: {
      title: "Project Details",
      fields: {
        serviceType: "Service Type *",
        preferredDate: "Preferred Date",
        projectDetails: "Project Details *",
      },
      placeholders: {
        projectDetails: "Tell us about your project...",
      }
    },
    
    submitButton: "Submit Booking Request",
    successMessage: "Thank you for your booking request! We'll contact you within 24 hours to confirm.",
  },
  
  serviceTypes: [
    "Finishing Installation",
    "Interior Painting",
    "Trim & Molding",
    "Cabinet Installation",
    "Drywall Finishing",
    "Custom Woodwork",
    "Flooring Installation",
    "Door Installation",
    "Other"
  ],
  
  process: {
    title: "What to Expect",
    steps: [
      {
        number: "01",
        title: "Initial Consultation",
        description: "We'll discuss your project, timeline, and vision in detail.",
      },
      {
        number: "02",
        title: "Detailed Proposal",
        description: "Receive a comprehensive quote with timeline and materials breakdown.",
      },
      {
        number: "03",
        title: "Expert Execution",
        description: "Our team delivers precision craftsmanship with meticulous attention to detail.",
      }
    ]
  }
};

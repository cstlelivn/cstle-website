/**
 * Site-wide information and contact details
 * Update this file to change contact info across the entire site
 */

export const siteInfo = {
  name: "Cstle Livn",
  searchName: "Cstle Construction",
  legalName: "Cstle Livn Inc.",
  tagline: "Install. Perfect. Finish.",
  
  contact: {
    email: "info@cstlelivn.ca",
    phone: "(306) 371-5817",
    phoneFormatted: "306-371-5817",
  },

  // Office is by appointment only -- shown low-key on the Contact page only,
  // not in the header/footer/hero, so it's findable by someone specifically
  // looking for it without being a prominent, sitewide address.
  office: {
    line1: "1862 Angus Street",
    line2: "Regina, SK",
    note: "By appointment only",
  },

  serviceArea: "Saskatchewan",
  
  businessHours: {
    weekdays: "Monday - Friday :  9:00 AM - 5:00 PM",
    saturday: "Saturday :  Strictly By Appointment",
  },
  
  social: {
    instagram: "https://www.instagram.com/cstlelivn/",
    facebook: "",
    linkedin: "",
  }
};

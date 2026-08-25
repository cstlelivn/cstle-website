/**
 * Services offered by Cstle Livn
 * Shared across Contact and Book Service forms
 */

// Kept in sync by hand with SERVICE_TYPES in the admin app
// (Cstle Livn Web App 2/src/app/src/constants/serviceTypes.ts) -- same
// company service structure, confirmed order: Commercial Renovation,
// Residential Renovation, then Residential's own sub-services (Secondary
// Suite Development, Kitchen Renovation, Bathroom Renovation, Basement
// Development), then Finishing, then a catch-all Other.
export const serviceTypes = [
  "Commercial Renovation",
  "Residential Renovation",
  "Secondary Suite Development",
  "Kitchen Renovation",
  "Bathroom Renovation",
  "Basement Development",
  "Finishing",
  "Other"
];

/**
 * Available consultation time slots
 * Business hours: 8:00 AM - 6:00 PM in 30-minute increments
 */
export const timeSlots = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00"
];

/**
 * Helper function to format time in 12-hour format for display
 */
export const formatTime12Hour = (time24: string): string => {
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours);
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${hour12}:${minutes} ${period}`;
};
/**
 * Services offered by Cstle Livn
 * Shared across Contact and Book Service forms
 */

export const serviceTypes = [
  "Basement Finishing & Development",
  "Interior Renovation",
  "Flooring Installation",
  "Trim, Doors & Millwork Installation",
  "Drywall Finishing & Interior Painting",
  "Finishing, Refresh & Detail Work",
  "Project Planning & Coordination",
  "Other Services"
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
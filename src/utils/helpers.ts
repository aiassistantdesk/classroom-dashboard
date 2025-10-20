/**
 * Generate a unique ID for a student
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Calculate age from birth date
 */
export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

/**
 * Format date to display string
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');

  // Format as +91 XXXXX XXXXX or XXXXX XXXXX
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }

  return phoneNumber;
};

/**
 * Validate Aadhaar number format (12 digits)
 */
export const isValidAadhaar = (aadhaar: string): boolean => {
  const cleaned = aadhaar.replace(/\D/g, '');
  return cleaned.length === 12;
};

/**
 * Format Aadhaar number (XXXX XXXX XXXX)
 */
export const formatAadhaar = (aadhaar: string): string => {
  const cleaned = aadhaar.replace(/\D/g, '');

  if (cleaned.length === 12) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 8)} ${cleaned.slice(8)}`;
  }

  return aadhaar;
};

/**
 * Validate mobile number (10 digits)
 */
export const isValidMobileNumber = (mobile: string): boolean => {
  const cleaned = mobile.replace(/\D/g, '');
  return cleaned.length === 10;
};

/**
 * Get initials from full name
 */
export const getInitials = (fullName: string): string => {
  const names = fullName.trim().split(' ');
  if (names.length === 0) return '';
  if (names.length === 1) return names[0].charAt(0).toUpperCase();

  return (
    names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase()
  );
};

/**
 * Search text match (case-insensitive)
 */
export const matchesSearch = (text: string, query: string): boolean => {
  return text.toLowerCase().includes(query.toLowerCase());
};

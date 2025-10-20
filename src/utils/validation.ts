import { z } from 'zod';

// Helper validation functions
const isValidAadhaar = (value: string): boolean => {
  const cleaned = value.replace(/\D/g, '');
  return cleaned.length === 12;
};

const isValidMobile = (value: string): boolean => {
  const cleaned = value.replace(/\D/g, '');
  return cleaned.length === 10;
};

// Zod schema for Student
export const studentSchema = z.object({
  // Basic Information
  rollNo: z.string().min(1, 'Roll number is required'),
  registerName: z.string().min(1, 'Register name is required'),
  studentFullName: z.string().min(2, 'Full name must be at least 2 characters'),

  // Class Information
  classStandard: z.string().min(1, 'Class standard is required'),
  division: z.string().min(1, 'Division is required'),
  academicYear: z.string().min(1, 'Academic year is required'),

  // Government IDs
  saralId: z.string().min(1, 'Saral ID is required'),
  aparId: z.string().min(1, 'Apar ID is required'),
  penNo: z.string().min(1, 'PEN number is required'),
  aadhaarNo: z
    .string()
    .min(1, 'Aadhaar number is required')
    .refine(isValidAadhaar, {
      message: 'Aadhaar number must be 12 digits',
    }),

  // Physical Attributes
  studentWeight: z.string().min(1, 'Weight is required'),
  studentHeight: z.string().min(1, 'Height is required'),

  // Personal Information
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Gender is required',
  }),
  birthDate: z.string().min(1, 'Birth date is required'),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
    required_error: 'Blood group is required',
  }),

  // Family Information
  studentFatherName: z.string().min(2, 'Father name must be at least 2 characters'),
  studentMotherName: z.string().min(2, 'Mother name must be at least 2 characters'),
  fatherMobileNo: z
    .string()
    .min(1, 'Father mobile number is required')
    .refine(isValidMobile, {
      message: 'Mobile number must be 10 digits',
    }),
  motherMobileNo: z
    .string()
    .min(1, 'Mother mobile number is required')
    .refine(isValidMobile, {
      message: 'Mobile number must be 10 digits',
    }),

  // Cultural Information
  motherTongue: z.string().min(1, 'Mother tongue is required'),
  religion: z.string().min(1, 'Religion is required'),
  caste: z.string().min(1, 'Caste is required'),
  casteCategory: z.enum(['General', 'OBC', 'SC', 'ST', 'EWS', 'Other'], {
    required_error: 'Caste category is required',
  }),

  // Address
  fullAddress: z.string().min(5, 'Address must be at least 5 characters'),

  // Financial
  studentBankAccountNo: z.string().optional().or(z.literal('')),

  // Optional fields
  photoUrl: z.string().optional(),
  notes: z.string().optional(),
});

// Type inference from schema
export type StudentFormData = z.infer<typeof studentSchema>;

// Validation function
export const validateStudent = (data: unknown) => {
  return studentSchema.safeParse(data);
};

// Individual field validators for inline validation
export const fieldValidators = {
  rollNo: (value: string) => value.trim().length > 0,
  studentFullName: (value: string) => value.trim().length >= 2,
  aadhaarNo: isValidAadhaar,
  mobileNo: isValidMobile,
  email: (value: string) => {
    if (!value) return true; // Optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },
};

// Error messages helper
export const getErrorMessage = (error: z.ZodError, field: string): string | undefined => {
  const fieldError = error.errors.find((err) => err.path[0] === field);
  return fieldError?.message;
};

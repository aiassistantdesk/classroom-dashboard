export type Gender = 'male' | 'female' | 'other';

export type CasteCategory = 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'Other';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface Student {
  // System Fields
  id: string;
  teacherId: string; // Firebase user ID of the teacher who owns this student
  createdAt: string;
  updatedAt: string;
  photoUrl?: string;

  // Basic Information
  rollNo: string;
  registerName: string;
  studentFullName: string;

  // Class Information
  classStandard: string; // e.g., "1", "2", "10", "11", "12"
  division: string; // e.g., "A", "B", "C"
  academicYear: string; // e.g., "2024-2025", "2025-2026"

  // Government IDs
  saralId: string;
  aparId: string;
  penNo: string;
  aadhaarNo: string;

  // Physical Attributes
  studentWeight: string; // in kg
  studentHeight: string; // in cm

  // Personal Information
  gender: Gender;
  birthDate: string; // ISO date string
  age: number; // Auto-calculated from birthDate
  bloodGroup: BloodGroup;

  // Family Information
  studentFatherName: string;
  studentMotherName: string;
  fatherMobileNo: string;
  motherMobileNo: string;

  // Cultural Information
  motherTongue: string;
  religion: string;
  caste: string;
  casteCategory: CasteCategory;

  // Address
  fullAddress: string;

  // Financial
  studentBankAccountNo: string;

  // Additional
  notes?: string;
}

// Type for creating a new student (without system-generated fields)
export type CreateStudentInput = Omit<Student, 'id' | 'teacherId' | 'createdAt' | 'updatedAt' | 'age'>;

// Type for updating a student (all fields optional except id)
export type UpdateStudentInput = Partial<Omit<Student, 'id' | 'createdAt'>> & {
  id: string;
};

// Filter options for student list
export interface StudentFilters {
  searchQuery?: string;
  classStandard?: string;
  division?: string;
  gender?: Gender;
  casteCategory?: CasteCategory;
  bloodGroup?: BloodGroup;
  academicYear?: string;
}

// Sort options
export type StudentSortField = 'studentFullName' | 'rollNo' | 'age' | 'classStandard';
export type SortOrder = 'asc' | 'desc';

export interface StudentSortOptions {
  field: StudentSortField;
  order: SortOrder;
}

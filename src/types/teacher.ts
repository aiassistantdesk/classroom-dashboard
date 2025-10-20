export interface Teacher {
  id: string;
  name: string;
  email: string;
  password: string; // In production, this should be hashed
  subject: string;
  classStandard: string; // e.g., "7", "10", "12"
  division?: string; // Optional: specific division like "A", "B"
  academicYear: string; // e.g., "2024-2025", "2025-2026"
  photoUrl?: string;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherLoginInput {
  email: string;
  password: string;
}

export interface TeacherSession {
  teacher: Teacher;
  academicYear: string; // Current selected academic year
  loginTime: string;
}

export type CreateTeacherInput = Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTeacherInput = Partial<Teacher> & { id: string };

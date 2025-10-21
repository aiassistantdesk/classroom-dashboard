import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Student,
  CreateStudentInput,
  UpdateStudentInput,
  StudentFilters,
  StudentSortOptions,
} from '../types/student';
import { calculateAge, matchesSearch } from '../utils/helpers';
import { useTeacher } from './TeacherContext';
import { useAuth } from './AuthContext';
import {
  addStudent as addStudentToFirestore,
  updateStudent as updateStudentInFirestore,
  deleteStudent as deleteStudentFromFirestore,
  subscribeToStudents,
  getStudentsByTeacher,
} from '../services/firestore';

interface StudentContextType {
  students: Student[];
  loading: boolean;
  error: string | null;

  // CRUD operations
  addStudent: (input: CreateStudentInput) => Promise<Student>;
  updateStudent: (input: UpdateStudentInput) => Promise<Student>;
  deleteStudent: (id: string) => Promise<void>;
  getStudentById: (id: string) => Student | undefined;

  // Filtering and sorting
  filteredStudents: Student[];
  setFilters: (filters: StudentFilters) => void;
  setSortOptions: (options: StudentSortOptions) => void;
  filters: StudentFilters;
  sortOptions: StudentSortOptions;

  // Utility functions
  clearAllData: () => Promise<void>;
  refreshStudents: () => Promise<void>;

  // Statistics
  getTotalStudents: () => number;
  getStudentsByClass: (classStandard: string) => Student[];
  getStudentsByGender: (gender: string) => Student[];
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

interface StudentProviderProps {
  children: ReactNode;
}

export const StudentProvider: React.FC<StudentProviderProps> = ({ children }) => {
  const { currentSession } = useTeacher();
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<StudentFilters>({});
  const [sortOptions, setSortOptions] = useState<StudentSortOptions>({
    field: 'studentFullName',
    order: 'asc',
  });

  // Subscribe to real-time student updates from Firestore
  useEffect(() => {
    if (!user || !currentSession) {
      setStudents([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Subscribe to real-time updates
    const unsubscribe = subscribeToStudents(user.uid, currentSession.academicYear, (updatedStudents) => {
      setStudents(updatedStudents);
      setLoading(false);
    });

    // Cleanup subscription on unmount or when user changes
    return () => unsubscribe();
  }, [user, currentSession]);

  // Apply filters and sorting whenever students, filters, sortOptions, or teacher session changes
  useEffect(() => {
    applyFiltersAndSort();
  }, [students, filters, sortOptions, currentSession]);

  const addStudent = async (input: CreateStudentInput): Promise<Student> => {
    try {
      if (!user || !currentSession) {
        throw new Error('User not authenticated or session not found');
      }

      const studentData = {
        ...input,
        age: calculateAge(input.birthDate),
      };

      const studentId = await addStudentToFirestore(user.uid, currentSession.academicYear, studentData);

      // Return the newly created student
      const newStudent: Student = {
        ...studentData,
        id: studentId,
        teacherId: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return newStudent;
    } catch (err) {
      setError('Failed to add student');
      throw err;
    }
  };

  const updateStudent = async (input: UpdateStudentInput): Promise<Student> => {
    try {
      const existingStudent = students.find((s) => s.id === input.id);
      if (!existingStudent) {
        throw new Error('Student not found');
      }

      // Recalculate age if birthDate is updated
      const age = input.birthDate
        ? calculateAge(input.birthDate)
        : existingStudent.age;

      const updates = {
        ...input,
        age,
      };

      await updateStudentInFirestore(input.id, updates);

      // Return the updated student (will be updated in real-time via subscription)
      const updatedStudent: Student = {
        ...existingStudent,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      return updatedStudent;
    } catch (err) {
      setError('Failed to update student');
      throw err;
    }
  };

  const deleteStudent = async (id: string): Promise<void> => {
    try {
      await deleteStudentFromFirestore(id);
      // Student will be removed from local state via real-time subscription
    } catch (err) {
      setError('Failed to delete student');
      throw err;
    }
  };

  const getStudentById = (id: string): Student | undefined => {
    return students.find((s) => s.id === id);
  };

  const applyFiltersAndSort = () => {
    let result = [...students];

    // Apply teacher-specific filters first (class and academic year)
    if (currentSession) {
      const teacher = currentSession.teacher;
      const academicYear = currentSession.academicYear;

      // Filter by current academic year
      result = result.filter((s) => s.academicYear === academicYear);
    }

    // Apply search filter
    if (filters.searchQuery) {
      result = result.filter(
        (student) =>
          matchesSearch(student.studentFullName, filters.searchQuery!) ||
          matchesSearch(student.rollNo, filters.searchQuery!) ||
          matchesSearch(student.saralId, filters.searchQuery!) ||
          matchesSearch(student.aadhaarNo, filters.searchQuery!)
      );
    }

    // Apply class filter (additional to teacher's class if needed)
    if (filters.classStandard) {
      result = result.filter((s) => s.classStandard === filters.classStandard);
    }

    // Apply division filter
    if (filters.division) {
      result = result.filter((s) => s.division === filters.division);
    }

    // Apply gender filter
    if (filters.gender) {
      result = result.filter((s) => s.gender === filters.gender);
    }

    // Apply caste category filter
    if (filters.casteCategory) {
      result = result.filter((s) => s.casteCategory === filters.casteCategory);
    }

    // Apply blood group filter
    if (filters.bloodGroup) {
      result = result.filter((s) => s.bloodGroup === filters.bloodGroup);
    }

    // Apply academic year filter
    if (filters.academicYear) {
      result = result.filter((s) => s.academicYear === filters.academicYear);
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue: any = a[sortOptions.field];
      let bValue: any = b[sortOptions.field];

      // Handle string comparison
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortOptions.order === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOptions.order === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredStudents(result);
  };

  const clearAllData = async (): Promise<void> => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Delete all students one by one
      const deletePromises = students.map((student) => deleteStudentFromFirestore(student.id));
      await Promise.all(deletePromises);
      // Students will be cleared from local state via real-time subscription
    } catch (err) {
      setError('Failed to clear all data');
      throw err;
    }
  };

  const refreshStudents = async (): Promise<void> => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      setLoading(true);
      const loadedStudents = await getStudentsByTeacher(user.uid);
      setStudents(loadedStudents);
      setLoading(false);
    } catch (err) {
      setError('Failed to refresh students');
      setLoading(false);
      throw err;
    }
  };

  const getTotalStudents = (): number => {
    return students.length;
  };

  const getStudentsByClass = (classStandard: string): Student[] => {
    return students.filter((s) => s.classStandard === classStandard);
  };

  const getStudentsByGender = (gender: string): Student[] => {
    return students.filter((s) => s.gender === gender);
  };

  const value: StudentContextType = {
    students,
    loading,
    error,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentById,
    filteredStudents,
    setFilters,
    setSortOptions,
    filters,
    sortOptions,
    clearAllData,
    refreshStudents,
    getTotalStudents,
    getStudentsByClass,
    getStudentsByGender,
  };

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
};

export const useStudents = (): StudentContextType => {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudents must be used within a StudentProvider');
  }
  return context;
};

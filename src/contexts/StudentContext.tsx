import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Student,
  CreateStudentInput,
  UpdateStudentInput,
  StudentFilters,
  StudentSortOptions,
} from '../types/student';
import { loadStudents, saveStudents, clearAllStudents } from '../utils/storage';
import { generateId, calculateAge, matchesSearch } from '../utils/helpers';
import { useTeacher } from './TeacherContext';

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
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<StudentFilters>({});
  const [sortOptions, setSortOptions] = useState<StudentSortOptions>({
    field: 'studentFullName',
    order: 'asc',
  });

  // Load students on mount from local storage
  useEffect(() => {
    loadStudentsFromStorage();
  }, []);

  // Apply filters and sorting whenever students, filters, sortOptions, or teacher session changes
  useEffect(() => {
    applyFiltersAndSort();
  }, [students, filters, sortOptions, currentSession]);

  const loadStudentsFromStorage = async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedStudents = await loadStudents();
      setStudents(loadedStudents);
    } catch (err) {
      setError('Failed to load students');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveStudentsToStorage = async (updatedStudents: Student[]) => {
    try {
      await saveStudents(updatedStudents);
      setStudents(updatedStudents);
    } catch (err) {
      setError('Failed to save students');
      throw err;
    }
  };

  const addStudent = async (input: CreateStudentInput): Promise<Student> => {
    try {
      const newStudent: Student = {
        ...input,
        id: generateId(),
        teacherId: 'local-teacher', // Dummy ID for local storage
        age: calculateAge(input.birthDate),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedStudents = [...students, newStudent];
      await saveStudentsToStorage(updatedStudents);
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

      const updatedStudent: Student = {
        ...existingStudent,
        ...input,
        age,
        updatedAt: new Date().toISOString(),
      };

      const updatedStudents = students.map((s) =>
        s.id === input.id ? updatedStudent : s
      );

      await saveStudentsToStorage(updatedStudents);
      return updatedStudent;
    } catch (err) {
      setError('Failed to update student');
      throw err;
    }
  };

  const deleteStudent = async (id: string): Promise<void> => {
    try {
      const updatedStudents = students.filter((s) => s.id !== id);
      await saveStudentsToStorage(updatedStudents);
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

    // Apply teacher-specific filters first (class and academic year) if session exists
    if (currentSession) {
      const teacher = currentSession.teacher;
      const academicYear = currentSession.academicYear;

      // Filter by teacher's class
      result = result.filter((s) => s.classStandard === teacher.classStandard);

      // Filter by teacher's division if specified
      if (teacher.division) {
        result = result.filter((s) => s.division === teacher.division);
      }

      // Filter by current academic year if student has one
      result = result.filter((s) => !s.academicYear || s.academicYear === academicYear);
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
      await clearAllStudents();
      setStudents([]);
      setFilteredStudents([]);
    } catch (err) {
      setError('Failed to clear all data');
      throw err;
    }
  };

  const refreshStudents = async (): Promise<void> => {
    await loadStudentsFromStorage();
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

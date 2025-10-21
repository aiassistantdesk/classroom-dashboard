import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Teacher, TeacherSession } from '../types/teacher';

interface TeacherContextType {
  teacher: Teacher | null;
  isAuthenticated: boolean;
  loading: boolean;
  refreshTeacherData: () => Promise<void>;
  updateTeacherProfile: (updates: Partial<Teacher>) => Promise<void>;
  currentSession: TeacherSession | null;
  changeAcademicYear: (academicYear: string) => Promise<void>;
}

const TeacherContext = createContext<TeacherContextType | undefined>(undefined);

// Default mock teacher for local storage mode
const DEFAULT_TEACHER: Teacher = {
  id: 'local-teacher',
  name: 'Teacher',
  email: 'teacher@local.com',
  subject: 'All Subjects',
  schoolName: 'Local School',
  classStandard: '1-12', // All classes
  division: undefined,
  academicYear: '2024-2025',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const TeacherProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [teacher, setTeacher] = useState<Teacher | null>(DEFAULT_TEACHER);
  const [loading, setLoading] = useState(false);
  const [currentSession, setCurrentSession] = useState<TeacherSession | null>({
    teacher: DEFAULT_TEACHER,
    academicYear: '2024-2025',
    loginTime: new Date().toISOString(),
  });

  const refreshTeacherData = async () => {
    // No-op for local storage mode
    return Promise.resolve();
  };

  const updateTeacherProfile = async (updates: Partial<Teacher>) => {
    if (teacher) {
      const updatedTeacher = { ...teacher, ...updates };
      setTeacher(updatedTeacher);
      if (currentSession) {
        setCurrentSession({
          ...currentSession,
          teacher: updatedTeacher,
        });
      }
    }
  };

  const changeAcademicYear = async (academicYear: string) => {
    if (currentSession) {
      const updatedSession: TeacherSession = {
        ...currentSession,
        academicYear,
      };
      setCurrentSession(updatedSession);
      if (teacher) {
        setTeacher({ ...teacher, academicYear });
      }
    }
  };

  return (
    <TeacherContext.Provider
      value={{
        teacher,
        isAuthenticated: true, // Always authenticated in local mode
        loading,
        refreshTeacherData,
        updateTeacherProfile,
        currentSession,
        changeAcademicYear,
      }}
    >
      {children}
    </TeacherContext.Provider>
  );
};

export const useTeacher = (): TeacherContextType => {
  const context = useContext(TeacherContext);
  if (context === undefined) {
    throw new Error('useTeacher must be used within a TeacherProvider');
  }
  return context;
};

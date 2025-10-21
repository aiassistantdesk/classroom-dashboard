import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Teacher, TeacherSession } from '../types/teacher';
import { getCurrentTeacher, saveTeacherProfile, getAuthSession } from '../utils/storage';
import { useAuth } from './AuthContext';

interface TeacherContextType {
  teacher: Teacher | null;
  loading: boolean;
  refreshTeacherData: () => Promise<void>;
  updateTeacherProfile: (updates: Partial<Teacher>) => Promise<void>;
  saveTeacher: (teacher: Teacher) => Promise<void>;
  currentSession: TeacherSession | null;
  changeAcademicYear: (academicYear: string) => Promise<void>;
}

const TeacherContext = createContext<TeacherContextType | undefined>(undefined);

export const TeacherProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { email, isAuthenticated } = useAuth();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentSession, setCurrentSession] = useState<TeacherSession | null>(null);

  // Load teacher data when authentication changes
  useEffect(() => {
    if (isAuthenticated && email) {
      loadTeacherData();
    } else {
      setTeacher(null);
      setCurrentSession(null);
    }
  }, [isAuthenticated, email]);

  const loadTeacherData = async () => {
    try {
      setLoading(true);
      const teacherData = await getCurrentTeacher();
      setTeacher(teacherData);

      if (teacherData) {
        const session = await getAuthSession();
        setCurrentSession({
          teacher: teacherData,
          academicYear: teacherData.academicYear,
          loginTime: session?.loginTime || new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error loading teacher data:', error);
      setTeacher(null);
      setCurrentSession(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshTeacherData = async () => {
    await loadTeacherData();
  };

  const saveTeacher = async (teacherData: Teacher) => {
    try {
      await saveTeacherProfile(teacherData);
      setTeacher(teacherData);

      const session = await getAuthSession();
      setCurrentSession({
        teacher: teacherData,
        academicYear: teacherData.academicYear,
        loginTime: session?.loginTime || new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error saving teacher:', error);
      throw error;
    }
  };

  const updateTeacherProfile = async (updates: Partial<Teacher>) => {
    if (!teacher) {
      throw new Error('No teacher profile to update');
    }

    const updatedTeacher: Teacher = {
      ...teacher,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await saveTeacher(updatedTeacher);
  };

  const changeAcademicYear = async (academicYear: string) => {
    if (teacher) {
      await updateTeacherProfile({ academicYear });
    }
  };

  return (
    <TeacherContext.Provider
      value={{
        teacher,
        loading,
        refreshTeacherData,
        updateTeacherProfile,
        saveTeacher,
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

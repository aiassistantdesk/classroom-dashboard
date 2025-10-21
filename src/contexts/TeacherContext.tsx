import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Teacher, TeacherSession } from '../types/teacher';
import { useAuth } from './AuthContext';
import { getTeacherProfile, saveTeacherProfile } from '../services/firestore';

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

export const TeacherProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isLoading: authLoading } = useAuth();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSession, setCurrentSession] = useState<TeacherSession | null>(null);

  const fetchTeacherData = useCallback(async () => {
    if (user) {
      setLoading(true);
      try {
        const profile = await getTeacherProfile(user.uid);
        setTeacher(profile);
        if (profile) {
          const session: TeacherSession = {
            teacher: profile,
            academicYear: profile.academicYear,
            loginTime: new Date().toISOString(),
          };
          setCurrentSession(session);
        }
      } catch (error) {
        console.error('Failed to fetch teacher data:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchTeacherData();
  }, [fetchTeacherData]);

  const refreshTeacherData = async () => {
    await fetchTeacherData();
  };

  const updateTeacherProfile = async (updates: Partial<Teacher>) => {
    if (teacher) {
      await saveTeacherProfile(teacher.id, updates);
      await refreshTeacherData();
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
            await saveTeacherProfile(teacher.id, { academicYear });
        }
    }
  };

  return (
    <TeacherContext.Provider
      value={{
        teacher,
        isAuthenticated: !!teacher,
        loading: loading || authLoading,
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
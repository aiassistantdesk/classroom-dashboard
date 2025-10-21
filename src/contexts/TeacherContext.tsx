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
          const academicYear = profile.academicYear || '2024-2025';
          const session: TeacherSession = {
            teacher: profile,
            academicYear: academicYear,
            loginTime: new Date().toISOString(),
          };
          setCurrentSession(session);

          // If the academic year was missing, save it to the profile
          if (!profile.academicYear) {
            await saveTeacherProfile(user.uid, { academicYear });
          }
        }
        // If profile is null, that's okay - means first-time user
        // The loading will stop and CreateTeacherScreen will show
      } catch (error) {
        console.error('Failed to fetch teacher data:', error);
        // On error, treat as first-time user (no profile)
        setTeacher(null);
        setCurrentSession(null);
      } finally {
        setLoading(false);
      }
    } else {
      // User logged out - clear teacher data
      setTeacher(null);
      setCurrentSession(null);
      setLoading(false);
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
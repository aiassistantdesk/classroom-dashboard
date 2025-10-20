import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Teacher, TeacherLoginInput, TeacherSession } from '../types/teacher';
import { loadTeachers, saveTeachers, loadSession, saveSession, clearSession } from '../utils/storage';
import { generateId } from '../utils/helpers';

interface TeacherContextType {
  // Authentication State
  currentSession: TeacherSession | null;
  isAuthenticated: boolean;
  loading: boolean;

  // Authentication Actions
  login: (credentials: TeacherLoginInput) => Promise<void>;
  logout: () => Promise<void>;
  changeAcademicYear: (academicYear: string) => Promise<void>;
  updateTeacherProfile: (updates: Partial<Teacher>) => Promise<void>;

  // Teacher Data
  teachers: Teacher[];
  getCurrentTeacher: () => Teacher | null;
}

const TeacherContext = createContext<TeacherContextType | undefined>(undefined);

interface TeacherProviderProps {
  children: ReactNode;
}

export const TeacherProvider: React.FC<TeacherProviderProps> = ({ children }) => {
  const [currentSession, setCurrentSession] = useState<TeacherSession | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize: Load session and teachers from storage
  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);

        // Load teachers
        const loadedTeachers = await loadTeachers();

        // If no teachers exist, create sample teachers
        if (loadedTeachers.length === 0) {
          const sampleTeachers = createSampleTeachers();
          await saveTeachers(sampleTeachers);
          setTeachers(sampleTeachers);
        } else {
          setTeachers(loadedTeachers);
        }

        // Load session
        const session = await loadSession();
        setCurrentSession(session);
      } catch (error) {
        console.error('Failed to initialize teacher context:', error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const login = async (credentials: TeacherLoginInput): Promise<void> => {
    try {
      // Find teacher by email and password
      const teacher = teachers.find(
        (t) => t.email === credentials.email && t.password === credentials.password
      );

      if (!teacher) {
        throw new Error('Invalid email or password');
      }

      // Create session
      const session: TeacherSession = {
        teacher,
        academicYear: teacher.academicYear,
        loginTime: new Date().toISOString(),
      };

      // Save session
      await saveSession(session);
      setCurrentSession(session);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await clearSession();
      setCurrentSession(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const changeAcademicYear = async (academicYear: string): Promise<void> => {
    try {
      if (!currentSession) {
        throw new Error('No active session');
      }

      const updatedSession: TeacherSession = {
        ...currentSession,
        academicYear,
      };

      await saveSession(updatedSession);
      setCurrentSession(updatedSession);
    } catch (error) {
      console.error('Failed to change academic year:', error);
      throw error;
    }
  };

  const updateTeacherProfile = async (updates: Partial<Teacher>): Promise<void> => {
    try {
      if (!currentSession) {
        throw new Error('No active session');
      }

      // Update teacher in the list
      const updatedTeachers = teachers.map((t) =>
        t.id === currentSession.teacher.id
          ? { ...t, ...updates, updatedAt: new Date().toISOString() }
          : t
      );

      await saveTeachers(updatedTeachers);
      setTeachers(updatedTeachers);

      // Update session with new teacher data
      const updatedTeacher = updatedTeachers.find((t) => t.id === currentSession.teacher.id);
      if (updatedTeacher) {
        const updatedSession: TeacherSession = {
          ...currentSession,
          teacher: updatedTeacher,
        };
        await saveSession(updatedSession);
        setCurrentSession(updatedSession);
      }
    } catch (error) {
      console.error('Failed to update teacher profile:', error);
      throw error;
    }
  };

  const getCurrentTeacher = (): Teacher | null => {
    return currentSession?.teacher || null;
  };

  return (
    <TeacherContext.Provider
      value={{
        currentSession,
        isAuthenticated: currentSession !== null,
        loading,
        login,
        logout,
        changeAcademicYear,
        updateTeacherProfile,
        teachers,
        getCurrentTeacher,
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

// Helper function to create sample teachers for testing
function createSampleTeachers(): Teacher[] {
  const now = new Date().toISOString();

  return [
    {
      id: generateId(),
      name: 'Priya Sharma',
      email: 'priya.sharma@school.com',
      password: 'password123',
      subject: 'Mathematics',
      classStandard: '7',
      division: 'A',
      academicYear: '2024-2025',
      phoneNumber: '9876543210',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@school.com',
      password: 'password123',
      subject: 'Science',
      classStandard: '8',
      division: 'B',
      academicYear: '2024-2025',
      phoneNumber: '9876543211',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      name: 'Anjali Desai',
      email: 'anjali.desai@school.com',
      password: 'password123',
      subject: 'English',
      classStandard: '10',
      division: 'A',
      academicYear: '2024-2025',
      phoneNumber: '9876543212',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      name: 'Vikram Patel',
      email: 'vikram.patel@school.com',
      password: 'password123',
      subject: 'History',
      classStandard: '12',
      academicYear: '2024-2025',
      phoneNumber: '9876543213',
      createdAt: now,
      updatedAt: now,
    },
  ];
}

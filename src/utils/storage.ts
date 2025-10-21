import AsyncStorage from '@react-native-async-storage/async-storage';
import { Student } from '../types/student';
import { Teacher, TeacherSession } from '../types/teacher';

const STUDENTS_STORAGE_KEY = '@classroom_dashboard:students';
const TEACHERS_STORAGE_KEY = '@classroom_dashboard:teachers';
const SESSION_STORAGE_KEY = '@classroom_dashboard:session';
const AUTH_SESSION_KEY = '@classroom_dashboard:auth_session';
const AUTH_CREDENTIALS_KEY = '@classroom_dashboard:auth_credentials';

/**
 * Save all students to AsyncStorage
 */
export const saveStudents = async (students: Student[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(students);
    await AsyncStorage.setItem(STUDENTS_STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving students to storage:', error);
    throw new Error('Failed to save students');
  }
};

/**
 * Load all students from AsyncStorage
 */
export const loadStudents = async (): Promise<Student[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STUDENTS_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error loading students from storage:', error);
    return [];
  }
};

/**
 * Clear all students from AsyncStorage
 */
export const clearAllStudents = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STUDENTS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing students from storage:', error);
    throw new Error('Failed to clear students');
  }
};

/**
 * Export students data as JSON string
 */
export const exportStudentsToJSON = async (): Promise<string> => {
  try {
    const students = await loadStudents();
    return JSON.stringify(students, null, 2);
  } catch (error) {
    console.error('Error exporting students:', error);
    throw new Error('Failed to export students');
  }
};

/**
 * Import students from JSON string
 */
export const importStudentsFromJSON = async (jsonString: string): Promise<Student[]> => {
  try {
    const students: Student[] = JSON.parse(jsonString);

    // Validate that it's an array
    if (!Array.isArray(students)) {
      throw new Error('Invalid JSON format: Expected an array of students');
    }

    // Basic validation of each student object
    students.forEach((student, index) => {
      if (!student.id || !student.studentFullName || !student.rollNo) {
        throw new Error(`Invalid student data at index ${index}`);
      }
    });

    await saveStudents(students);
    return students;
  } catch (error) {
    console.error('Error importing students:', error);
    throw new Error('Failed to import students: ' + (error as Error).message);
  }
};

/**
 * Save all teachers to AsyncStorage
 */
export const saveTeachers = async (teachers: Teacher[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(teachers);
    await AsyncStorage.setItem(TEACHERS_STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving teachers to storage:', error);
    throw new Error('Failed to save teachers');
  }
};

/**
 * Load all teachers from AsyncStorage
 */
export const loadTeachers = async (): Promise<Teacher[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(TEACHERS_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error loading teachers from storage:', error);
    return [];
  }
};

/**
 * Save teacher session to AsyncStorage
 */
export const saveSession = async (session: TeacherSession | null): Promise<void> => {
  try {
    if (session === null) {
      await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
    } else {
      const jsonValue = JSON.stringify(session);
      await AsyncStorage.setItem(SESSION_STORAGE_KEY, jsonValue);
    }
  } catch (error) {
    console.error('Error saving session to storage:', error);
    throw new Error('Failed to save session');
  }
};

/**
 * Load teacher session from AsyncStorage
 */
export const loadSession = async (): Promise<TeacherSession | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error loading session from storage:', error);
    return null;
  }
};

/**
 * Clear teacher session from AsyncStorage
 */
export const clearSession = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing session from storage:', error);
    throw new Error('Failed to clear session');
  }
};

/**
 * Auth Session Types
 */
export interface AuthSession {
  email: string;
  rememberMe: boolean;
  loginTime: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

/**
 * Save auth session to AsyncStorage
 */
export const saveAuthSession = async (email: string, rememberMe: boolean): Promise<void> => {
  try {
    const session: AuthSession = {
      email,
      rememberMe,
      loginTime: new Date().toISOString(),
    };
    const jsonValue = JSON.stringify(session);
    await AsyncStorage.setItem(AUTH_SESSION_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving auth session:', error);
    throw new Error('Failed to save auth session');
  }
};

/**
 * Get auth session from AsyncStorage
 */
export const getAuthSession = async (): Promise<AuthSession | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(AUTH_SESSION_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error getting auth session:', error);
    return null;
  }
};

/**
 * Clear auth session from AsyncStorage (logout)
 */
export const clearAuthSession = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(AUTH_SESSION_KEY);
  } catch (error) {
    console.error('Error clearing auth session:', error);
    throw new Error('Failed to clear auth session');
  }
};

/**
 * Save auth credentials to AsyncStorage (for demo/remember me)
 */
export const saveAuthCredentials = async (email: string, password: string): Promise<void> => {
  try {
    const credentials: AuthCredentials = { email, password };
    const jsonValue = JSON.stringify(credentials);
    await AsyncStorage.setItem(AUTH_CREDENTIALS_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving credentials:', error);
    throw new Error('Failed to save credentials');
  }
};

/**
 * Get auth credentials from AsyncStorage
 */
export const getAuthCredentials = async (): Promise<AuthCredentials | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(AUTH_CREDENTIALS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error getting credentials:', error);
    return null;
  }
};

/**
 * Verify credentials (demo authentication)
 */
export const verifyCredentials = async (email: string, password: string): Promise<boolean> => {
  try {
    const stored = await getAuthCredentials();
    if (!stored) {
      // First time user - save credentials
      await saveAuthCredentials(email, password);
      return true;
    }
    // Verify credentials match
    return stored.email === email && stored.password === password;
  } catch (error) {
    console.error('Error verifying credentials:', error);
    return false;
  }
};

/**
 * Get current teacher profile from storage
 */
export const getCurrentTeacher = async (): Promise<Teacher | null> => {
  try {
    const teachers = await loadTeachers();
    const session = await getAuthSession();
    if (!session) return null;

    // Find teacher by email
    const teacher = teachers.find(t => t.email === session.email);
    return teacher || null;
  } catch (error) {
    console.error('Error getting current teacher:', error);
    return null;
  }
};

/**
 * Save or update teacher profile
 */
export const saveTeacherProfile = async (teacher: Teacher): Promise<void> => {
  try {
    const teachers = await loadTeachers();
    const existingIndex = teachers.findIndex(t => t.email === teacher.email);

    if (existingIndex >= 0) {
      // Update existing teacher
      teachers[existingIndex] = {
        ...teacher,
        updatedAt: new Date().toISOString(),
      };
    } else {
      // Add new teacher
      teachers.push({
        ...teacher,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    await saveTeachers(teachers);
  } catch (error) {
    console.error('Error saving teacher profile:', error);
    throw new Error('Failed to save teacher profile');
  }
};

/**
 * Check if teacher profile is complete
 */
export const isProfileComplete = async (email: string): Promise<boolean> => {
  try {
    const teachers = await loadTeachers();
    const teacher = teachers.find(t => t.email === email);
    return teacher !== undefined;
  } catch (error) {
    console.error('Error checking profile completion:', error);
    return false;
  }
};

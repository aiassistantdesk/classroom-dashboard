import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  Timestamp,
  DocumentData,
  QuerySnapshot,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Student } from '../types/student';
import { Teacher } from '../types/teacher';

// Collection names
const COLLECTIONS = {
  TEACHERS: 'teachers',
  STUDENTS: 'students',
};

// ============================================
// TEACHER OPERATIONS
// ============================================

/**
 * Create or update teacher profile in Firestore
 */
export const saveTeacherProfile = async (
  userId: string,
  teacherData: Partial<Teacher>
): Promise<void> => {
  try {
    const teacherRef = doc(db, COLLECTIONS.TEACHERS, userId);
    await setDoc(teacherRef, {
      ...teacherData,
      updatedAt: Timestamp.now(),
    }, { merge: true });
  } catch (error) {
    console.error('Error saving teacher profile:', error);
    throw error;
  }
};

/**
 * Get teacher profile from Firestore
 */
export const getTeacherProfile = async (userId: string): Promise<Teacher | null> => {
  try {
    const teacherRef = doc(db, COLLECTIONS.TEACHERS, userId);
    const teacherSnap = await getDoc(teacherRef);

    if (teacherSnap.exists()) {
      return teacherSnap.data() as Teacher;
    }
    return null;
  } catch (error) {
    console.error('Error getting teacher profile:', error);
    throw error;
  }
};

/**
 * Create a new teacher profile in Firestore
 */
export const createTeacher = async (
  userId: string,
  teacherData: Omit<Teacher, 'id'>
): Promise<void> => {
  try {
    const teacherRef = doc(db, COLLECTIONS.TEACHERS, userId);
    await setDoc(teacherRef, {
      ...teacherData,
      id: userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error creating teacher:', error);
    throw error;
  }
};

/**
 * Listen to real-time updates for teacher profile
 */
export const subscribeToTeacherProfile = (
  userId: string,
  callback: (teacher: Teacher | null) => void
): (() => void) => {
  const teacherRef = doc(db, COLLECTIONS.TEACHERS, userId);

  return onSnapshot(teacherRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data() as Teacher);
    } else {
      callback(null);
    }
  }, (error) => {
    console.error('Error listening to teacher profile:', error);
    callback(null);
  });
};

// ============================================
// STUDENT OPERATIONS
// ============================================

/**
 * Add a new student to Firestore
 */
export const addStudent = async (
  teacherId: string,
  student: Omit<Student, 'id' | 'teacherId'>
): Promise<string> => {
  try {
    // Create a unique ID for the student
    const studentRef = doc(collection(db, COLLECTIONS.STUDENTS));
    const studentId = studentRef.id;

    const studentData: Student = {
      ...student,
      id: studentId,
      teacherId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(studentRef, studentData);
    return studentId;
  } catch (error) {
    console.error('Error adding student:', error);
    throw error;
  }
};

/**
 * Update an existing student in Firestore
 */
export const updateStudent = async (
  studentId: string,
  updates: Partial<Student>
): Promise<void> => {
  try {
    const studentRef = doc(db, COLLECTIONS.STUDENTS, studentId);
    await updateDoc(studentRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};

/**
 * Delete a student from Firestore
 */
export const deleteStudent = async (studentId: string): Promise<void> => {
  try {
    const studentRef = doc(db, COLLECTIONS.STUDENTS, studentId);
    await deleteDoc(studentRef);
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
};

/**
 * Get a single student by ID
 */
export const getStudent = async (studentId: string): Promise<Student | null> => {
  try {
    const studentRef = doc(db, COLLECTIONS.STUDENTS, studentId);
    const studentSnap = await getDoc(studentRef);

    if (studentSnap.exists()) {
      return studentSnap.data() as Student;
    }
    return null;
  } catch (error) {
    console.error('Error getting student:', error);
    throw error;
  }
};

/**
 * Get all students for a specific teacher
 */
export const getStudentsByTeacher = async (teacherId: string): Promise<Student[]> => {
  try {
    const studentsRef = collection(db, COLLECTIONS.STUDENTS);
    const q = query(studentsRef, where('teacherId', '==', teacherId));
    const querySnapshot = await getDocs(q);

    const students: Student[] = [];
    querySnapshot.forEach((doc) => {
      students.push(doc.data() as Student);
    });

    return students;
  } catch (error) {
    console.error('Error getting students:', error);
    throw error;
  }
};

/**
 * Listen to real-time updates for all students of a teacher
 */
export const subscribeToStudents = (
  teacherId: string,
  callback: (students: Student[]) => void
): (() => void) => {
  const studentsRef = collection(db, COLLECTIONS.STUDENTS);
  const q = query(
    studentsRef,
    where('teacherId', '==', teacherId)
  );

  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const students: Student[] = [];
    snapshot.forEach((doc) => {
      students.push(doc.data() as Student);
    });
    callback(students);
  }, (error) => {
    console.error('Error listening to students:', error);
    callback([]);
  });
};

/**
 * Bulk import students (useful for initial data migration)
 */
export const bulkImportStudents = async (
  teacherId: string,
  students: Omit<Student, 'id' | 'teacherId'>[]
): Promise<void> => {
  try {
    const promises = students.map((student) =>
      addStudent(teacherId, student)
    );
    await Promise.all(promises);
  } catch (error) {
    console.error('Error bulk importing students:', error);
    throw error;
  }
};

/**
 * Export all students as JSON (for backup purposes)
 */
export const exportStudentsAsJSON = async (teacherId: string): Promise<string> => {
  try {
    const students = await getStudentsByTeacher(teacherId);
    return JSON.stringify(students, null, 2);
  } catch (error) {
    console.error('Error exporting students:', error);
    throw error;
  }
};

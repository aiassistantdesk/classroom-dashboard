import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { saveTeacherProfile } from './firestore';

/**
 * Sign in with Google using popup (desktop) or redirect (mobile)
 */
export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    // Try popup first (works better on desktop)
    const result = await signInWithPopup(auth, googleProvider);

    // After successful sign-in, save/update teacher profile
    if (result.user) {
      await saveTeacherProfile(result.user.uid, {
        id: result.user.uid,
        name: result.user.displayName || 'Unknown',
        email: result.user.email || '',
        photoUrl: result.user.photoURL || undefined,
        subject: '', // Can be updated later by the user
        schoolName: '', // Can be updated later by the user
      });
    }

    return result;
  } catch (error: any) {
    // If popup is blocked, fall back to redirect
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
      await signInWithRedirect(auth, googleProvider);
      throw new Error('redirect'); // Signal that redirect was initiated
    }
    throw error;
  }
};

/**
 * Handle redirect result after Google Sign-In redirect
 * Call this on app initialization
 */
export const handleRedirectResult = async (): Promise<UserCredential | null> => {
  try {
    const result = await getRedirectResult(auth);

    if (result && result.user) {
      // Save/update teacher profile after redirect sign-in
      await saveTeacherProfile(result.user.uid, {
        id: result.user.uid,
        name: result.user.displayName || 'Unknown',
        email: result.user.email || '',
        photoUrl: result.user.photoURL || undefined,
        subject: '',
        schoolName: '',
      });
    }

    return result;
  } catch (error) {
    console.error('Error handling redirect result:', error);
    throw error;
  }
};

/**
 * Sign out the current user
 */
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

/**
 * Get the current authenticated user
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Subscribe to authentication state changes
 */
export const subscribeToAuthState = (
  callback: (user: User | null) => void
): (() => void) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!auth.currentUser;
};

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

    // Don't create teacher profile here - let CreateTeacherScreen handle it
    // This prevents Firestore calls before user has set up their profile

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

    // Don't create teacher profile here - let CreateTeacherScreen handle it
    // This prevents Firestore calls before user has set up their profile

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

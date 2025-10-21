import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

// Firebase configuration
// Your Firebase project configuration from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyD0tOboyzsoH4V49IPZ-jkkAq3KGps1ESs",
  authDomain: "classroom-dashboard-3a8c9.firebaseapp.com",
  projectId: "classroom-dashboard-3a8c9",
  storageBucket: "classroom-dashboard-3a8c9.firebasestorage.app",
  messagingSenderId: "103280595527",
  appId: "1:103280595527:web:38a48c0cbb4d31d4680be2",
  measurementId: "G-NSE58LK3XV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Google Auth Provider for OAuth
export const googleProvider = new GoogleAuthProvider();

// Enable offline persistence for Firestore
// This allows the app to work offline and sync when back online
try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      console.warn('Persistence not available in this browser');
    }
  });
} catch (err) {
  console.error('Error enabling persistence:', err);
}

export default app;

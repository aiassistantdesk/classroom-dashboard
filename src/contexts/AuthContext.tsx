import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  getAuthSession,
  saveAuthSession,
  clearAuthSession,
  verifyCredentials,
  isProfileComplete,
  AuthSession,
} from '../utils/storage';

interface AuthContextType {
  email: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isProfileComplete: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  checkProfileCompletion: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      setIsLoading(true);
      const session = await getAuthSession();

      if (session && session.rememberMe) {
        setEmail(session.email);
        const complete = await isProfileComplete(session.email);
        setProfileComplete(complete);
      } else {
        setEmail(null);
        setProfileComplete(false);
      }
    } catch (err) {
      console.error('Error checking session:', err);
      setEmail(null);
      setProfileComplete(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, rememberMe: boolean): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);

      // Verify credentials (demo authentication)
      const isValid = await verifyCredentials(email, password);

      if (!isValid) {
        setError('Invalid email or password');
        return false;
      }

      // Save session
      await saveAuthSession(email, rememberMe);
      setEmail(email);

      // Check if profile is complete
      const complete = await isProfileComplete(email);
      setProfileComplete(complete);

      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to login');
      console.error('Login error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await clearAuthSession();
      setEmail(null);
      setProfileComplete(false);
    } catch (err: any) {
      setError(err.message || 'Failed to logout');
      console.error('Logout error:', err);
    }
  };

  const checkProfileCompletion = async () => {
    if (email) {
      const complete = await isProfileComplete(email);
      setProfileComplete(complete);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        email,
        isAuthenticated: !!email,
        isLoading,
        isProfileComplete: profileComplete,
        login,
        logout,
        checkProfileCompletion,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

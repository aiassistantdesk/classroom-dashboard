import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  getAuthSession,
  saveAuthSession,
  clearAuthSession,
  verifyCredentials,
  createUserAccount,
  isProfileComplete,
  AuthSession,
} from '../utils/storage';

interface AuthContextType {
  email: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isProfileComplete: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<{ success: boolean; error?: string }>;
  createAccount: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
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

  const createAccount = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setError(null);
      setIsLoading(true);

      // Create account
      const result = await createUserAccount(email, password);

      if (!result.success) {
        setError(result.error || 'Failed to create account');
        return { success: false, error: result.error };
      }

      // Auto-login after account creation (always remember)
      await saveAuthSession(email, true);
      setEmail(email);

      // Profile is not complete yet (needs to go to Teacher Setup)
      setProfileComplete(false);

      return { success: true };
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to create account';
      setError(errorMsg);
      console.error('Create account error:', err);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, rememberMe: boolean): Promise<{ success: boolean; error?: string }> => {
    try {
      setError(null);
      setIsLoading(true);

      // Verify credentials
      const result = await verifyCredentials(email, password);

      if (!result.success) {
        setError(result.error || 'Failed to login');
        return { success: false, error: result.error };
      }

      // Save session
      await saveAuthSession(email, rememberMe);
      setEmail(email);

      // Check if profile is complete
      const complete = await isProfileComplete(email);
      setProfileComplete(complete);

      return { success: true };
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to login';
      setError(errorMsg);
      console.error('Login error:', err);
      return { success: false, error: errorMsg };
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
        createAccount,
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

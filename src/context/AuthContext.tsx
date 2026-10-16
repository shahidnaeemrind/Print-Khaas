import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { AdminUser } from '../types';

// The verified owner email bootstrapped from environment
export const BOOTSTRAPPED_ADMIN_EMAIL = 'shahidnaeemrind@gmail.com';

interface AuthContextType {
  currentUser: User | null;
  adminUser: AdminUser | null;
  loading: boolean;
  isAuthorizedAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const checkAdminPrivilege = async (user: User): Promise<boolean> => {
    try {
      const email = user.email?.toLowerCase().trim() || '';
      // Check if primary bootstrapped owner
      if (email === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase()) {
        return true;
      }
      // Check if registered in /admins/{uid}
      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      if (adminDoc.exists()) {
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Error checking admin privilege in Firestore:', err);
      // Fallback check: if email matches bootstrapped owner
      return user.email?.toLowerCase().trim() === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase();
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setCurrentUser(user);
        const authorized = await checkAdminPrivilege(user);
        setAdminUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          isAuthorizedAdmin: authorized,
        });
      } else {
        setCurrentUser(null);
        setAdminUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const isAuth = await checkAdminPrivilege(user);
      if (!isAuth) {
        setAuthError(
          `Access restricted: The Google account (${user.email}) is not authorized as an administrator for Print Khaas. Please sign in with ${BOOTSTRAPPED_ADMIN_EMAIL} or request admin access.`
        );
      }
    } catch (error: any) {
      console.error('Google Sign-in error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in cancelled. Please select your authorized Google account to continue.');
      } else {
        setAuthError(error.message || 'Failed to authenticate with Google.');
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setAdminUser(null);
      setCurrentUser(null);
      setAuthError(null);
    } catch (error: any) {
      console.error('Sign out error:', error);
    }
  };

  const clearAuthError = () => setAuthError(null);

  const isAuthorizedAdmin = Boolean(adminUser?.isAuthorizedAdmin);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        adminUser,
        loading,
        isAuthorizedAdmin,
        signInWithGoogle,
        logout,
        authError,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

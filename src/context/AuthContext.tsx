'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, db } from '@/config/firebase';
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import type { UserProfile, SignUpData } from '@/types/auth';
import LoadingScreen from '@/components/LoadingScreen';
import { setCookie, deleteCookie } from '@/utils/cookies';

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  signUp: (data: SignUpData) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: { firstName: string; lastName: string }) => Promise<void>;
  isLoading: boolean;
  authSuccess: boolean;
  clearAuthSuccess: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoading(true);
      setUser(user);

      if (user) {
        try {
          // Set the token cookie on auth state change
          const idToken = await user.getIdToken();
          setCookie('firebase-token', idToken);
          
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserProfile({
              id: user.uid,
              email: user.email!,
              firstName: data.firstName,
              lastName: data.lastName,
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date()
            });
          }
        } catch (error) {
          console.error('Error setting up user:', error);
          await firebaseSignOut(auth);
          setUserProfile(null);
          deleteCookie('firebase-token');
        }
      } else {
        setUserProfile(null);
        deleteCookie('firebase-token');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [mounted]);

  if (!mounted) {
    return null;
  }

  const signUp = async (data: SignUpData) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setAuthSuccess(true);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setIsTransitioning(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Get the ID token
      const idToken = await userCredential.user.getIdToken();
      // Set the cookie with proper options
      setCookie('firebase-token', idToken);
      
      // Wait for auth state to update and cookie to be set
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Wait for loading animation
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Use replace instead of push to prevent back navigation
      window.location.replace('/dashboard');
    } finally {
      setIsLoading(false);
      setIsTransitioning(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await firebaseSignOut(auth);
      deleteCookie('firebase-token');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: { firstName: string; lastName: string }) => {
    if (!user) throw new Error('No user logged in');

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp()
    });

    if (userProfile) {
      setUserProfile({
        ...userProfile,
        ...data,
        updatedAt: new Date()
      });
    }
  };

  const clearAuthSuccess = () => setAuthSuccess(false);

  return (
    <AuthContext.Provider value={{ 
      user, 
      userProfile, 
      signUp, 
      signIn, 
      signOut,
      updateProfile,
      isLoading,
      authSuccess,
      clearAuthSuccess 
    }}>
      {isTransitioning && <LoadingScreen />}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 
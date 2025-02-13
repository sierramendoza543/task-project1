'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth';
import { auth, db } from '@/config/firebase';
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import type { UserProfile, SignUpData, UpdateUserProfileData, AuthUser } from '@/types/user';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { setCookie, deleteCookie } from '@/utils/cookies';
import { CustomUser } from '@/types/user';

interface AuthContextType {
  user: AuthUser | null;
  userProfile: UserProfile | null;
  signUp: (data: SignUpData) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: UpdateUserProfileData) => Promise<void>;
  isLoading: boolean;
  authSuccess: boolean;
  clearAuthSuccess: () => void;
  refreshUserProfile: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
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

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);

      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          setCookie('firebase-token', idToken);
          
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            const userProfile: AuthUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName,
              firstName: data.firstName,
              lastName: data.lastName,
              emailVerified: firebaseUser.emailVerified,
              isAnonymous: firebaseUser.isAnonymous,
              createdAt: data.createdAt?.toDate(),
              updatedAt: data.updatedAt?.toDate(),
              metadata: {
                creationTime: firebaseUser.metadata.creationTime,
                lastSignInTime: firebaseUser.metadata.lastSignInTime
              }
            };
            setUser(userProfile);
            setUserProfile(userProfile);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUser(null);
          setUserProfile(null);
        }
      } else {
        setUser(null);
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
      // Create the user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Set the display name
      await updateProfile(userCredential.user, {
        displayName: `${data.firstName} ${data.lastName}`.trim()
      });

      // Create a user document in Firestore
      const userDoc = doc(db, 'users', userCredential.user.uid);
      await setDoc(userDoc, {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        displayName: `${data.firstName} ${data.lastName}`.trim(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      setAuthSuccess(true);
    } catch (error) {
      console.error('Error in signUp:', error);
      throw error;
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

  const updateUserProfile = async (data: UpdateUserProfileData) => {
    if (!user) throw new Error('No user logged in');

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp()
    });

    // Fetch updated profile
    const updatedDoc = await getDoc(userRef);
    if (updatedDoc.exists()) {
      const updatedData = updatedDoc.data();
      setUserProfile(prev => ({
        ...prev!,
        ...updatedData,
        updatedAt: updatedData.updatedAt?.toDate() || new Date()
      }));
    }
  };

  const clearAuthSuccess = () => setAuthSuccess(false);

  const refreshUserProfile = async () => {
    if (auth.currentUser) {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data() as UserProfile);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userProfile, 
      signUp, 
      signIn, 
      signOut,
      updateUserProfile,
      isLoading,
      authSuccess,
      clearAuthSuccess,
      refreshUserProfile,
      loading: isLoading,
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
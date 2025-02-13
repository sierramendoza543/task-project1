import { User as FirebaseUser } from 'firebase/auth';

// Base user profile interface
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  firstName: string;
  lastName: string;
  emailVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for updating user profile
export interface UpdateUserProfileData {
  displayName?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

// Extended Firebase user type
export interface CustomUser extends FirebaseUser {
  bio?: string;
}

// Type for the auth context
export interface AuthUser extends UserProfile {
  isAnonymous?: boolean;
  metadata?: {
    creationTime?: string;
    lastSignInTime?: string;
  };
}

// Auth signup data
export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
} 
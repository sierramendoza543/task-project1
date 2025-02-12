export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
} 
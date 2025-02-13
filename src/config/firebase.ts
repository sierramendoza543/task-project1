import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAV-B9_jdrL6x2kLpTb5-URSypEKEX3Ksc",
  authDomain: "login-app-156f1.firebaseapp.com",
  projectId: "login-app-156f1",
  storageBucket: "login-app-156f1.firebasestorage.app",
  messagingSenderId: "830243439492",
  appId: "1:830243439492:web:8ac5989321f5d10dbb53d1",
  measurementId: "G-Q6M2B7G05V"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider }; 
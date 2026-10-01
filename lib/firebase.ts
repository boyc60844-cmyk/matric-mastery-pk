import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type Auth,
  type User,
  type UserCredential,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC4lBI1F3OUS2c-O67hstiSs-6QAApayyc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "matric-mastery-pk.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "matric-mastery-pk",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "matric-mastery-pk.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "263336490573",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:263336490573:web:3450f62d62a7c01f168e04",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-WFW2NN13E7",
};

if (firebaseConfig.projectId === "concrete-robot-2smzh") {
  throw new Error("FATAL: Still using dead Starter project");
}

const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const googleProvider: GoogleAuthProvider = new GoogleAuthProvider();

export {
  app,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
  type UserCredential,
};

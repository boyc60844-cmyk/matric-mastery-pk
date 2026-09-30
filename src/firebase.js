import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc, increment, collection, query, orderBy, limit, getDocs, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBIDP9JWMXWcU0GtB5HNbjXUtzOFiAyx6o",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "concrete-robot-2smzh.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "concrete-robot-2smzh",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "concrete-robot-2smzh.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "495567507545",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:495567507545:web:6ed3298c35caec46ab2148"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const dbId = import.meta.env.VITE_FIREBASE_DATABASE_ID || "ai-studio-matricmastery-5a0cdc7f-3c90-48ac-9323-7f0f63d51e72";
export const db = dbId && dbId !== "(default)" ? getFirestore(app, dbId) : getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export {
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp
};

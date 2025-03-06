// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ai-logo-generator-21396.firebaseapp.com",
  projectId: "ai-logo-generator-21396",
  storageBucket: "ai-logo-generator-21396.firebasestorage.app",
  messagingSenderId: "352270966275",
  appId: "1:352270966275:web:55e55ccbf698b276293836",
  measurementId: "G-5K2FK86F67",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

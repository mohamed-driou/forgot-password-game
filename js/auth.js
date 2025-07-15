// js/auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  fetchSignInMethodsForEmail
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

// Environment variables (configured in Netlify)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "forgot-password-game.firebaseapp.com", // This can be public
  projectId: "forgot-password-game", // This can be public
  storageBucket: "forgot-password-game.appspot.com", // This can be public
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID || import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Export all authentication methods
export { 
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  fetchSignInMethodsForEmail
};
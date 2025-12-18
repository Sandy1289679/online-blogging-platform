// Import the functions you need from the SDKs you need
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getEnv } from "./getenv";

// Firebase config
const firebaseConfig = {
  apiKey: getEnv("VITE_FIREBASE_API"),
  authDomain: "blogging-mern-fd427.firebaseapp.com",
  projectId: "blogging-mern-fd427",
  storageBucket: "blogging-mern-fd427.firebasestorage.app",
  messagingSenderId: "612081326718",
  appId: "1:612081326718:web:9009714ebe5bad53fb962f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Create provider
const provider = new GoogleAuthProvider();

// ⭐ Force Google to ALWAYS show account selection
provider.setCustomParameters({ prompt: "select_account" });

export { auth, provider };

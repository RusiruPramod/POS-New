import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBiw3-_orAS9Bka3s58ff-k8ClSXDqAhdk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "pos-62afd.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "pos-62afd",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "pos-62afd.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "421960650885",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:421960650885:web:cfea69183e5fdb653559ec",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-CZH021YCZM"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

// Safe analytics initialization for environments that support it (browser)
let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

export { app, auth, db, analytics };


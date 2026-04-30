import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

// Only initialize if config is provided
const hasConfig = firebaseConfig.apiKey && firebaseConfig.projectId;

const app = hasConfig ? initializeApp(firebaseConfig) : null;
export const db = app ? getFirestore(app) : null;
export const auth = app ? getAuth(app) : null;

// Auto sign-in anonymously so we can track user progress
export function initAuth(callback: (uid: string | null) => void) {
  if (!auth) {
    callback(null);
    return;
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      callback(user.uid);
    } else {
      signInAnonymously(auth).catch(() => callback(null));
    }
  });
}

export { hasConfig };

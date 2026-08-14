import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env["VITE_FIREBASE_API_KEY"] || "AIzaSy_demo_key",
  authDomain: import.meta.env["VITE_FIREBASE_AUTH_DOMAIN"] || "sj-s-wedding.firebaseapp.com",
  projectId: import.meta.env["VITE_FIREBASE_PROJECT_ID"] || "sj-s-wedding",
  storageBucket: import.meta.env["VITE_FIREBASE_STORAGE_BUCKET"] || "sj-s-wedding.firebasestorage.app",
  messagingSenderId: import.meta.env["VITE_FIREBASE_MESSAGING_SENDER_ID"] || "345459122264",
  appId: import.meta.env["VITE_FIREBASE_APP_ID"] || "1:345459122264:web:19ca12586ac37f1b416a2d",
  databaseURL:
    import.meta.env["VITE_FIREBASE_DATABASE_URL"] ||
    "https://sj-s-wedding-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Singleton Firebase App Initialization
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
export default app;


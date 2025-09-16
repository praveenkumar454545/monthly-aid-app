import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  "projectId": "studio-6568233246-6f903",
  "appId": "1:1068995439510:web:41f5b4bf4f388c33c00bb7",
  "storageBucket": "studio-6568233246-6f903.firebasestorage.app",
  "apiKey": "AIzaSyCXL3oCYvEE0RS4exzpfPm-ZNJZdYO4mEs",
  "authDomain": "studio-6568233246-6f903.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "1068995439510"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };

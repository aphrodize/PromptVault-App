// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { demoAuth, demoDb, demoStorage } from './demoAuth.js';

// Configuration
const DEMO_MODE = false; // Set to false when using real Firebase

// Your web app's Firebase configuration
// Replace with your actual Firebase config when DEMO_MODE is false
const firebaseConfig = {
  apiKey: "AIzaSyCwWW-xPP4YfzVZrBsOmHk20RPm4EGv_z8",
  authDomain: "promptvault-app.firebaseapp.com",
  projectId: "promptvault-app",
  storageBucket: "promptvault-app.firebasestorage.app",
  messagingSenderId: "1080695199365",
  appId: "1:1080695199365:web:80a92916bbcdd22f5e7bec",
  measurementId: "G-K7Z211Z8NH"
};

let app, auth, db, storage;

if (DEMO_MODE) {
  // Use demo services
  auth = demoAuth;
  db = demoDb;
  storage = demoStorage;
  console.log('🚀 Running in DEMO MODE');
  console.log('Demo credentials:');
  console.log('Admin: admin@demo.com / demo123');
  console.log('User: user@demo.com / demo123');
} else {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  
  // Initialize Firebase Authentication and get a reference to the service
  auth = getAuth(app);
  
  // Initialize Cloud Firestore and get a reference to the service
  db = getFirestore(app);
  
  // Initialize Cloud Storage and get a reference to the service
  storage = getStorage(app);
  
  console.log('🔥 Running with Firebase');
}

export { auth, db, storage };
export default app;


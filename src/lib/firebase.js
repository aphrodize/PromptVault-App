// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { demoAuth, demoDb, demoStorage } from './demoAuth.js';

// Configuration
const DEMO_MODE = true; // Set to false when using real Firebase

// Your web app's Firebase configuration
// Replace with your actual Firebase config when DEMO_MODE is false
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "promptvault-demo.firebaseapp.com",
  projectId: "promptvault-demo",
  storageBucket: "promptvault-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456789",
  measurementId: "G-ABCDEF1234"
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


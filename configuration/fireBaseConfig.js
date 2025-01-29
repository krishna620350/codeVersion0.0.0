// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGTZc4dhi1L7kgN1tsEMpqMkwyyKgBUjY",
  authDomain: "codeversion0-0-0.firebaseapp.com",
  databaseURL: "https://codeversion0-0-0-default-rtdb.firebaseio.com",
  projectId: "codeversion0-0-0",
  storageBucket: "codeversion0-0-0.appspot.com", // Fixed the typo in storageBucket
  messagingSenderId: "421555251278",
  appId: "1:421555251278:web:8efc62f037d71ed089fb1f",
  measurementId: "G-WZLM3VNP10",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Realtime Database
const db = getFirestore(app);
const database = getDatabase(app);

// Exporting Firestore and Database instances
export { db, database };

// Collection constants
export const collections = {
  users: "users",
  apiKeys: "apiKeys",
};

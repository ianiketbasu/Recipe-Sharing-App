import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDrH6jrmqS0v0M_dLvfZB-mxYyMMDBtwlc",
  authDomain: "recipe-app-4d9b7.firebaseapp.com",
  projectId: "recipe-app-4d9b7",
  storageBucket: "recipe-app-4d9b7.appspot.com",
  messagingSenderId: "888561880103",
  appId: "1:888561880103:web:e1c91e2be09424d88ad202",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage(app);

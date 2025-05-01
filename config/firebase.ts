// src/config/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore }             from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA-FsRVYm6EdjAg5Ad4MZtHK4e9aXU8pYk",
  authDomain: "karpool-fyp.firebaseapp.com",
  projectId: "karpool-fyp",
  storageBucket: "karpool-fyp.firebasestorage.app",
  messagingSenderId: "337900858887",
  appId: "1:337900858887:web:43a8ae4fb654fb2bde04a2"
};

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

export const db = getFirestore(app);

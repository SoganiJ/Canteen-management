// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth"; // Import auth functions
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyABt_WiXrq-jtAf3WsGJHltQHuKUP6Qejw",
    authDomain: "ucsd-3e5d0.firebaseapp.com",
    projectId: "ucsd-3e5d0",
    storageBucket: "ucsd-3e5d0.firebasestorage.app",
    messagingSenderId: "531943876171",
    appId: "1:531943876171:web:c5e3813cb787c3cb1e0fce",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut }; // Export the auth functions
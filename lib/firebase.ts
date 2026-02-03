'use client';

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyA8KTDD5WTr35lHxYN7NC_liAGS-NIstAY",
    authDomain: "goldenglass-80e21.firebaseapp.com",
    projectId: "goldenglass-80e21",
    storageBucket: "goldenglass-80e21.firebasestorage.app",
    messagingSenderId: "796282400095",
    appId: "1:796282400095:web:c9baed29d98905bbe01aea",
    measurementId: "G-VC5YFH2EP4"
};

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

// Only initialize Firebase on the client side
if (typeof window !== 'undefined') {
    try {
        app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
        db = getFirestore(app);
        auth = getAuth(app);
    } catch (error) {
        console.error('Firebase initialization error:', error);
    }
}

export { db, auth };

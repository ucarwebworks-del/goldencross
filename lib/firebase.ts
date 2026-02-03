'use client';

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyA8KTDD5WTr35lHxYN7NC_liAGS-NIstAY",
    authDomain: "goldenglass-80e21.firebaseapp.com",
    projectId: "goldenglass-80e21",
    storageBucket: "goldenglass-80e21.firebasestorage.app",
    messagingSenderId: "796282400095",
    appId: "1:796282400095:web:c9baed29d98905bbe01aea",
    measurementId: "G-VC5YFH2EP4"
};

// Initialize Firebase only if not already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };

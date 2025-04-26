import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'; // Modular imports
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyCt48t4ZE1jFhWR36_f7YQgIagcCtVXli4',
    authDomain: 'my-app-3b0f0.firebaseapp.com',
    projectId: 'my-app-3b0f0',
    storageBucket: 'my-app-3b0f0.appspot.com',
    messagingSenderId: '834771815218',
    appId: '1:834771815218:android:1369eda139835fb367252b',
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db,auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut };
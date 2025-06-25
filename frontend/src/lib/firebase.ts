import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAO7Tblrpm6zl9NQNeejGBUX_SPaihrWzQ",
  authDomain: "jawalingo-dd3e9.firebaseapp.com",
  projectId: "jawalingo-dd3e9",
  storageBucket: "jawalingo-dd3e9.appspot.com",
  messagingSenderId: "8848710918",
  appId: "1:8848710918:web:d6b92a8976de6096aed287",
  measurementId: "G-WJY6BGYG5C"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app); 
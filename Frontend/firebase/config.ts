import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCmHiV-ducK6dI3qq7ioAJuOadlwV4rwyw",
  authDomain: "salon-app-27100.firebaseapp.com",
  projectId: "salon-app-27100",
  storageBucket: "salon-app-27100.firebasestorage.app",
  messagingSenderId: "367493948535",
  appId: "1:367493948535:web:33acc81f836096650a5272"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app); // ✅ ADD THIS
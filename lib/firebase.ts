import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDFCEUJZ_DZylIYO6XDgCK-8Do79zHfyWk",
  authDomain: "pasteis-da-liga.firebaseapp.com",
  projectId: "pasteis-da-liga",
  storageBucket: "pasteis-da-liga.firebasestorage.app",
  messagingSenderId: "373484623857",
  appId: "1:373484623857:web:772b6a9bb18340cb291650",
  measurementId: "G-GZV72Z3YCF"
};

// Evita inicializar o Firebase mais de uma vez
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

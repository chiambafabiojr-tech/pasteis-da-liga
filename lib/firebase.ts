import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getFirestore, type Firestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDFCEUJZ_DZylIYO6XDgCK-8Do79zHfyWk",
  authDomain: "pasteis-da-liga.firebaseapp.com",
  projectId: "pasteis-da-liga",
  storageBucket: "pasteis-da-liga.firebasestorage.app",
  messagingSenderId: "373484623857",
  appId: "1:373484623857:web:772b6a9bb18340cb291650",
}

export const isFirebaseConfigured = true

// Initialize Firebase com singleton pattern
let app: FirebaseApp
let db: Firestore

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
  db = getFirestore(app)
  console.log("[v0] Firebase inicializado com sucesso para pasteis-da-liga")
} catch (error) {
  console.error("[v0] Erro ao inicializar Firebase:", error)
  throw error
}

export { db, app }

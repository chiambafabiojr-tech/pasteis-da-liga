import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getFirestore, type Firestore } from "firebase/firestore"

console.log("[v0] Iniciando configuração do Firebase...")

const firebaseConfig = {
  apiKey: "AIzaSyDFCEUJZ_DZylIYO6XDgCK-8Do79zHfyWk",
  authDomain: "pasteis-da-liga.firebaseapp.com",
  projectId: "pasteis-da-liga",
  storageBucket: "pasteis-da-liga.firebasestorage.app",
  messagingSenderId: "373484623857",
  appId: "1:373484623857:web:772b6a9bb18340cb291650",
}

console.log("[v0] Firebase config criado:", {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
})

export const isFirebaseConfigured = true

// Initialize Firebase com singleton pattern
let app: FirebaseApp
let db: Firestore

try {
  console.log("[v0] Verificando apps existentes...")
  const existingApps = getApps()
  console.log("[v0] Apps encontrados:", existingApps.length)

  if (existingApps.length === 0) {
    console.log("[v0] Inicializando novo app Firebase...")
    app = initializeApp(firebaseConfig)
    console.log("[v0] App Firebase criado com sucesso")
  } else {
    console.log("[v0] Usando app Firebase existente")
    app = existingApps[0]
  }

  console.log("[v0] Criando instância do Firestore...")
  db = getFirestore(app)
  console.log("[v0] Firestore criado com sucesso")
  console.log("[v0] Firebase inicializado completamente para pasteis-da-liga")
} catch (error) {
  console.error("[v0] ERRO CRÍTICO ao inicializar Firebase:", error)
  console.error("[v0] Tipo do erro:", typeof error)
  console.error("[v0] Detalhes:", JSON.stringify(error, null, 2))
  throw error
}

export { db, app }

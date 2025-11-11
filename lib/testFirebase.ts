// lib/testFirebase.ts
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

export async function testFirebaseConnection() {
  try {
    console.log("🔍 Testando conexão com Firestore...");
    const snapshot = await getDocs(collection(db, "orders"));
    console.log(`✅ Conexão bem-sucedida! ${snapshot.size} pedidos encontrados.`);
  } catch (error) {
    console.error("❌ Erro ao conectar com o Firestore:", error);
  }
}

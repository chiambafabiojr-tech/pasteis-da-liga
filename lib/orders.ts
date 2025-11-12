// lib/orders.ts
import { db, isFirebaseConfigured } from "./firebaseConfig"
import { collection, getDocs, addDoc, doc, getDoc } from "firebase/firestore"

export interface Order {
  id: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  total: number
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  status: string
  createdAt: Date
}

export const getOrders = async (): Promise<Order[]> => {
  if (!isFirebaseConfigured || !db) {
    console.error("[v0] Firebase não configurado")
    throw new Error("Firebase não está configurado. Adicione as variáveis de ambiente necessárias.")
  }

  try {
    console.log("[v0] Buscando pedidos...")
    const ordersCollection = collection(db, "orders")
    const ordersSnapshot = await getDocs(ordersCollection)
    const ordersList = ordersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Order[]
    console.log("[v0] Pedidos encontrados:", ordersList.length)
    return ordersList
  } catch (error) {
    console.error("[v0] Erro ao buscar pedidos:", error)
    throw error
  }
}

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  if (!isFirebaseConfigured || !db) {
    console.error("[v0] Firebase não configurado")
    throw new Error("Firebase não está configurado. Adicione as variáveis de ambiente necessárias.")
  }

  try {
    console.log("[v0] Buscando pedido:", orderId)
    const orderDoc = doc(db, "orders", orderId)
    const orderSnapshot = await getDoc(orderDoc)

    if (orderSnapshot.exists()) {
      console.log("[v0] Pedido encontrado")
      return {
        id: orderSnapshot.id,
        ...orderSnapshot.data(),
        createdAt: orderSnapshot.data().createdAt?.toDate() || new Date(),
      } as Order
    }
    console.log("[v0] Pedido não encontrado")
    return null
  } catch (error) {
    console.error("[v0] Erro ao buscar pedido:", error)
    throw error
  }
}

export const createOrder = async (orderData: Omit<Order, "id" | "createdAt">): Promise<string | null> => {
  return new Promise(async (resolve, reject) => {
    // Timeout de 5 segundos
    const timeout = setTimeout(() => {
      reject(
        new Error(
          "Tempo limite excedido. O Firebase pode não estar configurado corretamente ou as regras de segurança estão bloqueando.",
        ),
      )
    }, 5000)

    try {
      const ordersCollection = collection(db, "orders")
      const docRef = await addDoc(ordersCollection, {
        ...orderData,
        createdAt: new Date(),
      })
      clearTimeout(timeout)
      resolve(docRef.id)
    } catch (error) {
      clearTimeout(timeout)
      console.error("Erro ao criar pedido:", error)
      reject(error)
    }
  })
}

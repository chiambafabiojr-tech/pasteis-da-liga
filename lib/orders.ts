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
  console.log("[v0] ==== INÍCIO DA CRIAÇÃO DO PEDIDO ====")
  console.log("[v0] Dados do pedido recebidos:", JSON.stringify(orderData, null, 2))

  try {
    console.log("[v0] Verificando se Firebase está configurado...")
    console.log("[v0] isFirebaseConfigured:", isFirebaseConfigured)
    console.log("[v0] db existe:", !!db)

    if (!db) {
      throw new Error("Firestore database não está disponível")
    }

    console.log("[v0] Criando referência para collection 'orders'...")
    const ordersCollection = collection(db, "orders")
    console.log("[v0] Collection 'orders' referenciada com sucesso")

    console.log("[v0] Preparando documento para adicionar...")
    const docData = {
      ...orderData,
      createdAt: new Date(),
    }
    console.log("[v0] Documento preparado:", JSON.stringify(docData, null, 2))

    console.log("[v0] Chamando addDoc...")
    const docRef = await addDoc(ordersCollection, docData)
    console.log("[v0] addDoc retornou com sucesso!")
    console.log("[v0] ID do documento criado:", docRef.id)

    console.log("[v0] ==== PEDIDO CRIADO COM SUCESSO ====")
    return docRef.id
  } catch (error) {
    console.error("[v0] ==== ERRO NA CRIAÇÃO DO PEDIDO ====")
    console.error("[v0] Tipo do erro:", typeof error)
    console.error("[v0] Erro completo:", error)
    console.error("[v0] Stack trace:", (error as Error).stack)
    throw error
  }
}

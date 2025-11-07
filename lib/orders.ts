import type { CartItem } from "./cart"
import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, query, orderBy } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAjrSX4Argng0h5NScPGfJc_Mt14OtUA-E",
  authDomain: "pasteis-da-liga-9159e.firebaseapp.com",
  projectId: "pasteis-da-liga-9159e",
  storageBucket: "pasteis-da-liga-9159e.firebasestorage.app",
  messagingSenderId: "948055380099",
  appId: "1:948055380099:web:64da2c9b22c94a84998bb6",
  measurementId: "G-WHTMEPPF1P"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Tipo de pedido
export interface Order {
  id: string
  customerName: string
  customerPhone: string
  customerEmail: string
  deliveryAddress: string
  items: CartItem[]
  total: number
  status: "pending" | "confirmed" | "preparing" | "delivered"
  createdAt: string
  paymentMethod: "pix" | "card" | "cash"
  paymentProof?: string
}

// 🔹 Salvar pedido no Firestore
export async function saveOrder(order: Omit<Order, "id" | "createdAt" | "status">): Promise<Order> {
  const newOrder = {
    ...order,
    status: "pending",
    createdAt: new Date(),
  }

  const docRef = await addDoc(collection(db, "pedidos"), newOrder)

  return {
    id: docRef.id,
    ...newOrder,
    createdAt: newOrder.createdAt.toISOString(),
  } as Order
}

// 🔹 Buscar pedidos do Firestore
export async function getOrders(): Promise<Order[]> {
  const pedidosRef = collection(db, "pedidos")
  const q = query(pedidosRef, orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data()
    return {
      id: docSnap.id,
      customerName: data.customerName || "Sem nome",
      customerPhone: data.customerPhone || "",
      customerEmail: data.customerEmail || "",
      deliveryAddress: data.deliveryAddress || "",
      items: data.items || [],
      total: data.total || 0,
      status: data.status || "pending",
      createdAt: data.createdAt?.toDate?.()?.toISOString?.() || new Date().toISOString(),
      paymentMethod: data.paymentMethod || "cash",
      paymentProof: data.paymentProof || "",
    } as Order
  })
}

// 🔹 Buscar pedido específico
export async function getOrderById(id: string): Promise<Order | undefined> {
  const pedidos = await getOrders()
  return pedidos.find((order) => order.id === id)
}

// 🔹 Atualizar status do pedido
export async function updateOrderStatus(id: string, status: Order["status"]): Promise<Order | undefined> {
  const pedidoRef = doc(db, "pedidos", id)
  await updateDoc(pedidoRef, { status })

  const pedidos = await getOrders()
  return pedidos.find((order) => order.id === id)
}

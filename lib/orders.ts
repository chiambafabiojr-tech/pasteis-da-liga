  // lib/orders.ts
  import { db } from "./firebase";
  import { collection, getDocs, doc, getDoc, addDoc } from "firebase/firestore";

  // Tipo (estrutura) de um pedido
  export type Order = {
    id: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    paymentMethod: "pix" | "cash";
    paymentProof?: string;
    items: {
      product: {
        id: string;
        name: string;
        price: number;
      };
      quantity: number;
    }[];
    total: number;
    status: string;
    createdAt: string;
  };

  // 🔹 Buscar todos os pedidos
  export const getOrders = async (): Promise<Order[]> => {
    const snapshot = await getDocs(collection(db, "orders"));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];
  };

  // 🔹 Buscar um pedido específico pelo ID
  export const getOrderById = async (id: string): Promise<Order | null> => {
    const docRef = doc(db, "orders", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() } as Order;
    return null;
  };

  // 🔹 Salvar novo pedido no Firestore
  export const saveOrder = async (order: Omit<Order, "id" | "status" | "createdAt">) => {
    const newOrder = {
      ...order,
      status: "Pendente",
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, "orders"), newOrder);
    return { id: docRef.id, ...newOrder };
  };

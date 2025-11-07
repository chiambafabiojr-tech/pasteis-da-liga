// lib/orders.ts
import { db } from "./firebaseConfig"; // ajuste se o arquivo de config for diferente
import { collection, getDocs, addDoc } from "firebase/firestore"; 

export const getOrders = async () => {
  try {
    const q = collection(db, "orders");
    const querySnapshot = await getDocs(q);
    const ordersArray = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return ordersArray || [];
  } catch (error) {
    console.error("Erro ao obter pedidos:", error);
    return [];
  }
};

// Função para salvar pedido
export const saveOrder = async (order: any) => {
  try {
    const docRef = await addDoc(collection(db, "orders"), order);
    return { id: docRef.id, ...order };
  } catch (error) {
    console.error("Erro ao salvar pedido:", error);
    return null;
  }
};

// lib/orders.ts
import { db } from './firebaseConfig'; // ajuste se seu arquivo de config tiver outro nome
import { collection, getDocs, addDoc, query } from 'firebase/firestore';

// Função para obter os pedidos
export const getOrders = async () => {
  try {
    const q = query(collection(db, "orders"));
    const querySnapshot = await getDocs(q);

    const ordersArray = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return Array.isArray(ordersArray) ? ordersArray : [];
  } catch (error) {
    console.error("Erro ao obter pedidos:", error);
    return [];
  }
};

// Função para salvar um novo pedido
export const saveOrder = async (order: any) => {
  try {
    const docRef = await addDoc(collection(db, "orders"), order);
    return { id: docRef.id, ...order };
  } catch (error) {
    console.error("Erro ao salvar pedido:", error);
    return null;
  }
};

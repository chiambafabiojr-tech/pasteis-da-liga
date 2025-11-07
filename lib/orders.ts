// lib/firebase/getOrders.ts
import { db } from './firebaseConfig'; // ajuste se seu arquivo de config tiver outro nome
import { collection, getDocs, query } from 'firebase/firestore';

export const getOrders = async () => {
  try {
    const q = query(collection(db, "orders")); // nome da coleção no Firestore
    const querySnapshot = await getDocs(q);

    const ordersArray = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return Array.isArray(ordersArray) ? ordersArray : [];
  } catch (error) {
    console.error("Erro ao obter pedidos:", error);
    return []; // garante que SEMPRE retorne um array
  }
};

import { db } from "./firebase";
import { collection, getDocs, doc, getDoc, addDoc } from "firebase/firestore";

export type Order = {
  id: string;
  name?: string;
  value?: number;
  status?: string;
  createdAt?: string;
};

export const getOrders = async (): Promise<Order[]> => {
  const snapshot = await getDocs(collection(db, "orders"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];
};

export const getOrderById = async (id: string): Promise<Order | null> => {
  const docRef = doc(db, "orders", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() } as Order;
  return null;
};

export const addOrder = async (order: Omit<Order, "id">) => {
  const docRef = await addDoc(collection(db, "orders"), order);
  return docRef.id;
};

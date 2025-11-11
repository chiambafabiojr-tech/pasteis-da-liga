"use client";

import { useEffect, useState } from "react";
import { getOrders } from "@/lib/orders";
import { testFirebaseConnection } from "@/lib/testFirebase";

type Order = {
  id: string;
  name?: string;
  value?: number;
  status?: string;
};

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    testFirebaseConnection();

    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        if (!data || !Array.isArray(data)) {
          setError(true);
          setOrders([]);
          setLoading(false);
          return;
        }
        setOrders(data);
      } catch (err) {
        console.error("Erro ao buscar pedidos:", err);
        setError(true);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="p-6"><p>Carregando pedidos...</p></div>;
  if (error) return <div className="p-6"><p className="text-red-500">Erro ao carregar pedidos.</p></div>;
  if (!orders || orders.length === 0) return <div className="p-6"><p>Nenhum pedido encontrado.</p></div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Pedidos</h1>
      <div className="grid gap-4">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg p-4">
            <h3 className="font-semibold">{order.name || "Sem nome"}</h3>
            <p className="text-sm text-gray-600">ID: {order.id}</p>
            <p className="text-sm">Status: {order.status || "Desconhecido"}</p>
            <p className="font-bold">R$ {order.value?.toFixed(2) || "0.00"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

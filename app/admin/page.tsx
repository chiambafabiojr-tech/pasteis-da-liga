"use client";

import { useEffect, useState } from "react";
import { getOrders, Order } from "@/lib/orders";

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        console.log("📦 Pedidos recebidos do Firebase:", data);

        if (!data || !Array.isArray(data)) throw new Error("Dados inválidos");

        setOrders(data);
      } catch (err) {
        console.error("❌ Erro ao buscar pedidos:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="p-6">
        <p>Carregando pedidos...</p>
      </div>
    );

  if (error)
    return (
      <div className="p-6">
        <p className="text-red-500">Erro ao carregar pedidos.</p>
      </div>
    );

  if (!orders.length)
    return (
      <div className="p-6">
        <p>Nenhum pedido encontrado.</p>
      </div>
    );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Pedidos</h1>
      <div className="grid gap-4">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg p-4 shadow bg-white">
            <h3 className="font-semibold text-lg">
              {order.customerName || "Cliente não informado"}
            </h3>
            <p className="text-sm text-gray-600">📱 {order.customerPhone}</p>
            {order.customerEmail && (
              <p className="text-sm text-gray-600">✉️ {order.customerEmail}</p>
            )}
            <p className="text-sm text-gray-600 mt-2">
              💰 Total: R$ {order.total.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">
              💳 Pagamento: {order.paymentMethod.toUpperCase()}
            </p>
            <p className="text-sm mt-2 font-semibold">
              Status: {order.status || "Pendente"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Criado em: {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

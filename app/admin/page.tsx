"use client";

import { useEffect, useState } from "react";
import { getOrders } from "@/lib/firebase"; // ajuste se o caminho do seu getOrders for diferente

interface Order {
  id: string;
  cliente: string;
  total: number;
  status: string;
  // adicione outros campos do pedido que você usa
}

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await getOrders(); // espera a Promise resolver
        // garante que sempre seja um array
        const ordersArray = Array.isArray(result) ? result : Object.values(result || {});
        setOrders(ordersArray);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        setOrders([]); // evita que quebre
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Carregando pedidos...</p>;
  if (orders.length === 0) return <p>Nenhum pedido encontrado.</p>;

  return (
    <div>
      <h1>Painel de Admin</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.cliente}</td>
              <td>R$ {order.total.toFixed(2)}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { getOrders } from "@/lib/firebase"; // ajuste se o caminho do seu getOrders for diferente

interface Order {
  id: string;
  cliente: string;
  total: number;
  status: string;
  // adicione outros campos que você usa
}

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await getOrders(); // pega os pedidos
        setOrders(Array.isArray(ordersData) ? ordersData : []); // garante que seja sempre um array
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        setOrders([]); // se der erro, mostra lista vazia
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

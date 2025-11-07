"use client";

import { useEffect, useState } from "react";
import { getOrders } from "@/lib/firebase";

interface Order {
  id?: string;
  cliente?: string;
  total?: number;
  status?: string;
  [key: string]: any;
}

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();

        console.log("📦 Dados recebidos de getOrders:", data);

        // Garante que o resultado sempre seja um array
        let ordersArray: Order[] = [];

        if (Array.isArray(data)) {
          ordersArray = data;
        } else if (data && typeof data === "object") {
          ordersArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
        } else {
          console.warn("⚠️ getOrders retornou um formato inesperado:", data);
          ordersArray = [];
        }

        setOrders(ordersArray);
      } catch (err) {
        console.error("❌ Erro ao buscar pedidos:", err);
        setErro("Erro ao carregar pedidos.");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>⏳ Carregando pedidos...</p>;
  if (erro) return <p>❌ {erro}</p>;
  if (!orders || orders.length === 0) return <p>Nenhum pedido encontrado.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Painel de Administração</h1>
      <table border={1} cellPadding={8} style={{ width: "100%", marginTop: 20 }}>
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
            <tr key={order.id || Math.random()}>
              <td>{order.id}</td>
              <td>{order.cliente || "—"}</td>
              <td>
                {order.total ? `R$ ${order.total.toFixed(2)}` : "—"}
              </td>
              <td>{order.status || "Pendente"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

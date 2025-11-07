import { useEffect, useState } from "react";
import { getOrders } from "@/lib/firebase/getOrders";

type Order = {
  id: string;
  // Adicione aqui os outros campos do pedido que você usa
  name?: string;
  value?: number;
  status?: string;
};

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();

        // Garantir que seja sempre um array
        if (!Array.isArray(data)) {
          console.error("getOrders não retornou um array:", data);
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

  if (loading) return <p>Carregando pedidos...</p>;
  if (error) return <p>Erro ao carregar pedidos.</p>;
  if (!orders || orders.length === 0) return <p>Nenhum pedido encontrado.</p>;

  return (
    <div>
      <h1>Pedidos</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            <p>Nome: {order.name || "Não informado"}</p>
            <p>Valor: {order.value || 0}</p>
            <p>Status: {order.status || "Desconhecido"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

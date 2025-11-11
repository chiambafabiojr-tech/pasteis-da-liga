"use client";

import { useEffect, useState } from "react";
import { getOrders } from "@/lib/orders";
import { Card } from "@/components/ui/card";

type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  paymentMethod: "pix" | "cash";
  paymentProof?: string;
  items: {
    product: { id: string; name: string; price: number };
    quantity: number;
  }[];
  total: number;
  status: string;
  createdAt: string;
};

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        console.log("📦 Pedidos recebidos do Firebase:", data);
        setOrders(data);
      } catch (err) {
        console.error("❌ Erro ao buscar pedidos:", err);
        setError("Erro ao carregar pedidos.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="p-6 text-center text-muted-foreground">
        Carregando pedidos...
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-center text-red-500">
        {error}
      </div>
    );

  if (orders.length === 0)
    return (
      <div className="p-6 text-center text-muted-foreground">
        Nenhum pedido encontrado.
      </div>
    );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-foreground">📋 Pedidos Recebidos</h1>

      <div className="grid gap-6">
        {orders.map((order) => (
          <Card key={order.id} className="p-6 border-2 border-border shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  {order.customerName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {order.customerPhone}
                </p>
                {order.customerEmail && (
                  <p className="text-sm text-muted-foreground">
                    {order.customerEmail}
                  </p>
                )}
              </div>
              <div className="text-right">
                <span
                  className={`text-sm font-bold px-3 py-1 rounded-full ${
                    order.status === "Pendente"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-green-200 text-green-800"
                  }`}
                >
                  {order.status}
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(order.createdAt).toLocaleString("pt-BR")}
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>
                    {item.quantity}x {item.product.name}
                  </span>
                  <span className="font-semibold">
                    R$ {(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 mt-4 flex justify-between items-center">
              <span className="font-semibold text-muted-foreground">
                Forma de pagamento:{" "}
                <strong>{order.paymentMethod === "pix" ? "PIX" : "Dinheiro"}</strong>
              </span>
              <span className="text-lg font-bold text-primary">
                Total: R$ {order.total.toFixed(2)}
              </span>
            </div>

            {order.paymentProof && (
              <p className="text-sm text-muted-foreground mt-2">
                Comprovante: {order.paymentProof}
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

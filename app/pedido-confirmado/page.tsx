"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getOrderById, type Order } from "@/lib/orders";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

function OrderConfirmedContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false);
        setError("ID do pedido não encontrado.");
        return;
      }

      try {
        const foundOrder = await getOrderById(orderId);
        setOrder(foundOrder || null);

        if (!foundOrder) {
          setError("Pedido não encontrado ou ID inválido.");
        }
      } catch (e) {
        console.error("Erro ao buscar pedido:", e);
        setError("Falha ao carregar detalhes do pedido.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando detalhes do pedido...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Erro ao Carregar Pedido</h2>
          <p className="text-muted-foreground">{error}</p>
          <Link href="/">
            <Button className="mt-6">Voltar ao Início</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 flex flex-col lg:flex-row gap-6">
      {/* Resumo do Pedido */}
      <div className="flex-1 space-y-6 max-w-md">
        <Card className="p-6 shadow-md rounded-lg space-y-4">
          <h2 className="text-xl font-semibold">Pedido Confirmado!</h2>
          <p>Obrigado pelo seu pedido, {order?.customerName}.</p>
          <p>Forma de pagamento: <strong>{order?.paymentMethod === "pix" ? "PIX" : "Dinheiro"}</strong></p>

          {order?.paymentMethod === "pix" && (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-700">Comprovante enviado:</p>
              {order.paymentProof ? (
                <img
                  src={order.paymentProof}
                  alt="Comprovante de Pagamento"
                  className="w-48 h-48 object-contain border rounded-md"
                />
              ) : (
                <p className="text-sm text-red-500">Comprovante não enviado.</p>
              )}
            </div>
          )}

          <Link href="/">
            <Button className="mt-4">Voltar ao Início</Button>
          </Link>
        </Card>
      </div>

      {/* Itens do Pedido */}
      <div className="w-full lg:w-1/3">
        <Card className="p-6 shadow-md rounded-lg space-y-3 sticky top-6">
          <h2 className="text-xl font-semibold">Resumo do Pedido</h2>
          {order?.items.map((item) => (
            <div key={item.product.id} className="flex justify-between py-2 border-b">
              <span>{item.product.name} x {item.quantity}</span>
              <span>R$ {(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold pt-2">
            <span>Total:</span>
            <span>R$ {order?.total.toFixed(2)}</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function PedidoConfirmadoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      }
    >
      <OrderConfirmedContent />
    </Suspense>
  );
}

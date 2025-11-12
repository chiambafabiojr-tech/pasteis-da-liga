"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCart, clearCart } from "@/lib/cart";
import { saveOrder } from "@/lib/orders";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState(getCart().items);
  const [total, setTotal] = useState(getCart().total);
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "cash">("pix");
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cart = getCart();
    setCartItems(cart.items);
    setTotal(cart.total);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formattedItems = cartItems.map((item) => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
        },
        quantity: item.quantity,
      }));

      const savedOrder = await saveOrder({
        items: formattedItems,
        total,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail || "",
        customerPhone: formData.customerPhone,
        paymentMethod,
        paymentProof,
      });

      if (!savedOrder.id) throw new Error("O ID do pedido não foi retornado.");

      clearCart();
      router.push(`/pedido-confirmado?orderId=${savedOrder.id}`);
    } catch (err: any) {
      console.error("[CartPage] Erro ao finalizar pedido:", err);
      setError(err.message || "Erro desconhecido. Consulte o console.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1>Carrinho Vazio</h1>
      </div>
    );

  return (
    <div className="min-h-screen p-4 flex flex-col lg:flex-row gap-6">
      {/* Formulário do Cliente + Pagamento */}
      <div className="flex-1 space-y-6 max-w-md">
        <Card className="p-6 shadow-md rounded-lg space-y-4">
          <h2 className="text-xl font-semibold">Informações do Cliente</h2>
          <Input
            placeholder="Nome"
            name="customerName"
            value={formData.customerName}
            onChange={handleInputChange}
            required
          />
          <Input
            placeholder="Telefone"
            name="customerPhone"
            value={formData.customerPhone}
            onChange={handleInputChange}
            required
          />
          <Input
            placeholder="Email"
            name="customerEmail"
            value={formData.customerEmail}
            onChange={handleInputChange}
          />
        </Card>

        <Card className="p-6 shadow-md rounded-lg space-y-4">
          <h2 className="text-xl font-semibold">Forma de Pagamento</h2>
          <div className="flex gap-4">
            <Button
              variant={paymentMethod === "pix" ? "default" : "outline"}
              onClick={() => setPaymentMethod("pix")}
            >
              PIX
            </Button>
            <Button
              variant={paymentMethod === "cash" ? "default" : "outline"}
              onClick={() => setPaymentMethod("cash")}
            >
              Dinheiro
            </Button>
          </div>

          {paymentMethod === "pix" && (
            <div className="mt-4 space-y-3">
              <p className="text-sm text-gray-700">
                Escaneie o QR Code abaixo e envie o comprovante:
              </p>
              <div className="border rounded-md p-4 flex justify-center items-center bg-gray-50">
                {/* Substitua pelo QR Code real */}
                <div className="bg-gray-200 w-48 h-48 flex items-center justify-center text-sm font-medium">
                  QR Code: R$ {total.toFixed(2)}
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setPaymentProof(e.target.files ? e.target.files[0] : null)
                }
                className="mt-2"
              />
            </div>
          )}
        </Card>

        {error && <p className="text-red-500">{error}</p>}

        <Button type="button" onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? "Processando..." : `Finalizar Pedido (R$ ${total.toFixed(2)})`}
        </Button>
      </div>

      {/* Resumo do Pedido */}
      <div className="w-full lg:w-1/3">
        <Card className="p-6 shadow-md rounded-lg space-y-3 sticky top-6">
          <h2 className="text-xl font-semibold">Resumo do Pedido</h2>
          {cartItems.map((item) => (
            <div key={item.product.id} className="flex justify-between py-2 border-b">
              <span>
                {item.product.name} x {item.quantity}
              </span>
              <span>R$ {(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold pt-2">
            <span>Total:</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

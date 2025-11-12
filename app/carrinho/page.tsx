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
        paymentMethod: "cash", // somente dinheiro
        paymentProof: "",      // não existe comprovante
      });

      if (!savedOrder.id) throw new Error("O ID do pedido não foi retornado.");

      clearCart();
      router.push(`/pedido-confirmado?orderId=${savedOrder.id}`);
    } catch (err: any) {
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
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Seu Carrinho</h1>

      <div className="space-y-4 mb-8">
        {cartItems.map((item) => (
          <Card key={item.product.id} className="p-4 flex justify-between items-center">
            <div>
              <p>{item.product.name}</p>
              <p>
                {item.quantity} x R$ {item.product.price.toFixed(2)}
              </p>
            </div>
            <p className="font-bold">R$ {(item.product.price * item.quantity).toFixed(2)}</p>
          </Card>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
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

        {error && <p className="text-red-500">{error}</p>}

        <Button type="submit" disabled={loading}>
          {loading ? "Processando..." : `Finalizar Pedido (R$ ${total.toFixed(2)})`}
        </Button>
      </form>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCart, clearCart } from "@/lib/cart";
import { saveOrder } from "@/lib/orders";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import PixQRCode from "@/components/PixQRCode";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "cash">("pix");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedCart = getCart();
    setCart(storedCart);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await saveOrder({
        customerName: name,
        customerEmail: email,
        paymentMethod,
        items: cart,
        total,
      });

      clearCart();
      router.push("/success");
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardContent className="space-y-4">
            <h2 className="text-lg font-semibold">Informações do Cliente</h2>
            <Input
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <h2 className="text-lg font-semibold mt-4">Pagamento</h2>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as "pix" | "cash")}
              className="flex space-x-4 mt-2"
            >
              <label className="flex items-center space-x-2">
                <RadioGroupItem value="pix" />
                <span>PIX</span>
              </label>
              <label className="flex items-center space-x-2">
                <RadioGroupItem value="cash" />
                <span>Dinheiro</span>
              </label>
            </RadioGroup>

            {paymentMethod === "pix" && (
              <div className="mt-4">
                <PixQRCode amount={total} />
              </div>
            )}

            <Button type="submit" disabled={isSubmitting} className="mt-4">
              {isSubmitting ? "Processando..." : "Finalizar Pedido"}
            </Button>
          </CardContent>
        </Card>
      </form>

      {/* Resumo do Pedido */}
      <Card>
        <CardContent className="space-y-2">
          <h2 className="text-lg font-semibold">Resumo do Pedido</h2>
          {cart.length === 0 ? (
            <p>Seu carrinho está vazio.</p>
          ) : (
            <ul className="space-y-2">
              {cart.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
          <hr className="my-2" />
          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
        </CardContent>
      <

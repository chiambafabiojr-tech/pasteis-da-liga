"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCart, clearCart } from "@/lib/cart";
import { saveOrder } from "@/lib/orders";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "cash">("pix");
  const [pixPaid, setPixPaid] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    const items = getCart();
    setCart(items);
  }, []);

  const handleSubmit = async () => {
    if (!name || !email || !phone) {
      alert("Preencha todos os campos!");
      return;
    }

    if (paymentMethod === "pix" && !pixPaid) {
      alert("Envie o comprovante de pagamento PIX!");
      return;
    }

    setLoading(true);
    try {
      await saveOrder({
        customer: { name, email, phone },
        items: cart,
        total,
        paymentMethod,
        pixPaid,
      });
      clearCart();
      router.push("/success");
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar pedido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      {/* Formulário do Cliente e Pagamento */}
      <div className="flex-1 space-y-6">
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Informações do Cliente</h2>
          <Input
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Telefone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Forma de Pagamento</h2>
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
            <div className="mt-4 space-y-2">
              <p>Escaneie o QR Code abaixo e envie o comprovante:</p>
              <div className="border p-4 flex justify-center items-center">
                {/* Aqui você pode gerar o QR Code real */}
                <div className="bg-gray-200 w-48 h-48 flex items-center justify-center">
                  QR Code: R$ {total.toFixed(2)}
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setPixPaid(e.target.files ? e.target.files[0] : null)
                }
              />
            </div>
          )}
        </Card>

        <Button
          className="w-full mt-4"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Processando..." : "Finalizar Pedido"}
        </Button>
      </div>

      {/* Resumo do Pedido */}
      <div className="w-full md:w-1/3">
        <Card className="p-6 space-y-2">
          <h2 className="text-lg font-semibold">Resumo do Pedido</h2>
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between border-b py-2 text-sm"
            >
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between font-semibold pt-2">
            <span>Total:</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

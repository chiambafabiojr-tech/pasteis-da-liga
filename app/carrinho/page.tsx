"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCart, removeFromCart, clearCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CartPage() {
  const [cart, setCart] = useState(getCart());

  useEffect(() => {
    setCart(getCart());
  }, []);

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
    setCart(getCart());
  };

  const handleClear = () => {
    clearCart();
    setCart(getCart());
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center">
        <h1 className="text-3xl font-bold mb-4">Carrinho Vazio</h1>
        <p className="text-muted-foreground mb-8">
          Adicione alguns heróis do sabor antes de finalizar seu pedido.
        </p>
        <Link href="/">
          <Button className="bg-primary hover:bg-primary/90 text-white font-bold">
            Voltar ao cardápio
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b-4 border-primary bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Seu Carrinho</h1>
          <Button variant="outline" className="border-2" onClick={handleClear}>
            Limpar Carrinho
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Lista de Itens */}
          <div className="md:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <Card key={item.product.id} className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{item.product.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.quantity}x R$ {item.product.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold text-lg">
                    R$ {(item.product.price * item.quantity).toFixed(2)}
                  </p>
                  <Button
                    variant="destructive"
                    onClick={() => handleRemove(item.product.id)}
                  >
                    Remover
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Resumo */}
          <div>
            <Card className="p-6 border-2 border-primary sticky top-4">
              <h2 className="text-xl font-bold mb-4">Resumo do Pedido</h2>
              <p className="flex justify-between text-lg mb-2">
                <span>Subtotal:</span>
                <span>R$ {cart.total.toFixed(2)}</span>
              </p>
              <p className="flex justify-between text-muted-foreground mb-6">
                <span>Taxa de entrega:</span>
                <span>Grátis</span>
              </p>
              <Link href="/checkout">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-lg py-6">
                  Finalizar Pedido
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCart, removeFromCart, clearCart } from "@/lib/cart"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Trash2 } from "lucide-react"

export default function CarrinhoPage() {
  const router = useRouter()
  const [cart, setCart] = useState(getCart())

  useEffect(() => {
    setCart(getCart())
  }, [])

  const handleRemove = (productId: string) => {
    removeFromCart(productId)
    setCart(getCart())
  }

  const handleClear = () => {
    clearCart()
    setCart(getCart())
  }

  if (cart.items.length === 0)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-2xl font-bold mb-4">Seu carrinho está vazio 🛒</h1>
        <Link href="/">
          <Button>Voltar para o cardápio</Button>
        </Link>
      </div>
    )

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b-4 border-primary bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Seu Carrinho</h1>
          <div className="flex gap-2">
            <Button variant="destructive" onClick={handleClear}>
              Limpar tudo
            </Button>
            <Link href="/checkout">
              <Button className="bg-primary hover:bg-primary/90">Finalizar Pedido</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 grid gap-6">
        {cart.items.map((item) => (
          <Card key={item.product.id} className="p-4 flex justify-between items-center">
            <div>
              <h2 className="font-bold text-lg">{item.product.name}</h2>
              <p className="text-muted-foreground">
                {item.quantity}x — R$ {(item.product.price * item.quantity).toFixed(2)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemove(item.product.id)}
              aria-label="Remover"
            >
              <Trash2 className="h-5 w-5 text-red-500" />
            </Button>
          </Card>
        ))}

        <div className="text-right mt-6">
          <p className="text-xl font-bold">
            Total: R$ {cart.total.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
}

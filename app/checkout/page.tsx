"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCart, clearCart } from "@/lib/cart"
import { saveOrder } from "@/lib/orders"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState(getCart())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
  })

  useEffect(() => {
    setCart(getCart())
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    console.log("[Checkout] Iniciando finalização do pedido...")

    try {
      // Evita pedido vazio
      if (!cart.items || cart.items.length === 0) {
        throw new Error("Carrinho vazio. Adicione produtos antes de finalizar.")
      }

      console.log("[Checkout] Dados do cliente:", formData)
      console.log("[Checkout] Itens do carrinho:", cart.items)

      const order = await saveOrder({
        items: cart.items,
        total: cart.total,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        paymentMethod: "cash", // ou "pix"
      })

      console.log("[Checkout] Pedido salvo com sucesso:", order)

      if (!order?.id) throw new Error("Erro ao salvar pedido: ID não retornado.")

      clearCart()
      router.push(`/pedido-confirmado?id=${order.id}`)
    } catch (err: any) {
      console.error("[Checkout] ERRO AO FINALIZAR PEDIDO:", err)
      setError(err.message || "Erro desconhecido. Verifique o console.")
    } finally {
      setLoading(false)
      console.log("[Checkout] Finalização encerrada.")
    }
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold mb-4">Carrinho Vazio</h1>
        <p className="text-muted-foreground mb-4">
          Adicione produtos antes de finalizar seu pedido.
        </p>
        <Button onClick={() => router.push("/")}>Voltar ao Cardápio</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Finalizar Pedido</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Itens do Pedido</h2>
        {cart.items.map((item) => (
          <div
            key={item.product.id}
            className="flex justify-between border-b py-2 text-lg"
          >
            <span>
              {item.quantity}x {item.product.name}
            </span>
            <span>R$ {(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between mt-4 text-xl font-bold">
          <span>Total</span>
          <span>R$ {cart.total.toFixed(2)}</span>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Dados do Cliente</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-medium mb-1">
              Nome Completo
            </label>
            <Input
              id="name"
              required
              value={formData.customerName}
              onChange={(e) =>
                setFormData({ ...formData, customerName: e.target.value })
              }
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="phone" className="block font-medium mb-1">
              Telefone
            </label>
            <Input
              id="phone"
              type="tel"
              required
              value={formData.customerPhone}
              onChange={(e) =>
                setFormData({ ...formData, customerPhone: e.target.value })
              }
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-medium mb-1">
              E-mail
            </label>
            <Input
              id="email"
              type="email"
              required
              value={formData.customerEmail}
              onChange={(e) =>
                setFormData({ ...formData, customerEmail: e.target.value })
              }
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            className="w-full font-bold text-lg py-6"
            disabled={loading}
          >
            {loading ? "Processando..." : "Finalizar Pedido"}
          </Button>
        </form>
      </Card>
    </div>
  )
}

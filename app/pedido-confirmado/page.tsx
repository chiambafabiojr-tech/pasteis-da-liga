"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { getOrderById, type Order } from "@/lib/orders"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Package } from "lucide-react"
import Link from "next/link"

function OrderConfirmedContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (orderId) {
      const foundOrder = getOrderById(orderId)
      setOrder(foundOrder || null)
    }
  }, [orderId])

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-4 border-primary bg-card">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">PASTÉIS DA LIGA</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8">
            <CheckCircle2 className="h-24 w-24 text-secondary mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-foreground mb-3">Pedido Confirmado!</h2>
            <p className="text-lg text-muted-foreground">Seu pedido foi recebido com sucesso e está sendo preparado.</p>
          </div>

          {/* Order Details */}
          <Card className="p-8 border-2 border-primary mb-6">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b-2 border-border">
              <Package className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Número do Pedido</p>
                <p className="text-xl font-bold text-foreground">{order.id}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Cliente</p>
                <p className="font-bold text-foreground">{order.customerName}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Telefone</p>
                <p className="font-bold text-foreground">{order.customerPhone}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Endereço de Entrega</p>
                <p className="font-bold text-foreground">{order.deliveryAddress}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Forma de Pagamento</p>
                <p className="font-bold text-foreground capitalize">
                  {order.paymentMethod === "pix" && "PIX"}
                  {order.paymentMethod === "card" && "Cartão"}
                  {order.paymentMethod === "cash" && "Dinheiro"}
                </p>
              </div>
            </div>

            <div className="border-t-2 border-border pt-4">
              <p className="text-sm text-muted-foreground mb-3">Itens do Pedido</p>
              <div className="space-y-2 mb-4">
                {order.items.map((item) => (
                  <div key={item.product.id} className="flex justify-between">
                    <span className="text-foreground">
                      {item.quantity}x {item.product.name}
                    </span>
                    <span className="font-bold text-foreground">
                      R$ {(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-3 border-t-2 border-border">
                <span className="text-lg font-bold text-foreground">Total</span>
                <span className="text-2xl font-bold text-primary">R$ {order.total.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full border-2 font-bold bg-transparent">
                Fazer Novo Pedido
              </Button>
            </Link>
            <Link href="/admin" className="flex-1">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                Ver Painel Admin
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PedidoConfirmadoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      }
    >
      <OrderConfirmedContent />
    </Suspense>
  )
}

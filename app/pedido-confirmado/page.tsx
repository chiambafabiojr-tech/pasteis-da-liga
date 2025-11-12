"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { getOrderById, type Order } from "@/lib/orders"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Package } from "lucide-react"
import Link from "next/link"
import { Spinner } from "@/components/ui/spinner"

function PedidoConfirmadoContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("id")
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      if (orderId) {
        const orderData = await getOrderById(orderId)
        setOrder(orderData)
      }
      setLoading(false)
    }
    fetchOrder()
  }, [orderId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-2xl mx-auto p-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>

          <h1 className="text-3xl font-bold">Pedido Confirmado!</h1>

          {order ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Package className="h-5 w-5" />
                <span>Pedido #{order.id}</span>
              </div>

              <div className="border-t pt-4">
                <h2 className="font-semibold mb-2">Itens do Pedido:</h2>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span>R$ {item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-4 pt-4 flex justify-between font-bold">
                  <span>Total:</span>
                  <span>R$ {order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Obrigado pelo seu pedido! Você receberá uma confirmação em breve.</p>
          )}

          <div className="pt-6">
            <Button asChild>
              <Link href="/">Voltar para o início</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default function PedidoConfirmadoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Spinner className="h-8 w-8" />
        </div>
      }
    >
      <PedidoConfirmadoContent />
    </Suspense>
  )
}

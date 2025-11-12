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
  const [loading, setLoading] = useState(true) // Adicionado estado de loading
  const [error, setError] = useState<string | null>(null) // Adicionado estado de erro

  useEffect(() => {
    const fetchOrder = async () => { // Função assíncrona criada
      if (!orderId) {
          setLoading(false)
          setError("ID do pedido não encontrado.")
          return
      }

      try {
          // CORREÇÃO AQUI: Chamar getOrderById com 'await'
          const foundOrder = await getOrderById(orderId) 
          setOrder(foundOrder || null)

          if (!foundOrder) {
              setError("Pedido não encontrado ou ID inválido.")
          }
      } catch (e) {
          console.error("Erro ao buscar pedido:", e)
          setError("Falha ao carregar detalhes do pedido.")
      } finally {
          setLoading(false)
      }
    }

    fetchOrder() // Chamada da função assíncrona
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando detalhes do pedido...</p>
      </div>
    )
  }

  if (error) { // Exibir mensagem de erro
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Erro ao Carregar Pedido</h2>
            <p className="text-muted-foreground">{error}</p>
            <Link href="/">
              <Button className="mt-6">Voltar ao Início</Button>
            </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* O restante do seu HTML de sucesso (Header, Card, etc.) permanece inalterado */}
        {/* ... */}
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
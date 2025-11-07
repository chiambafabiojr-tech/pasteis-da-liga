"use client"

import { useEffect, useState } from "react"
import { getOrders } from "@/lib/firebase/getOrders"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"

type Order = {
  id: string
  name?: string
  value?: number
  status?: string
  createdAt?: string
}

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("[v0] Iniciando busca de pedidos")
        const data = await getOrders()
        console.log("[v0] Dados recebidos:", data)

        if (data === undefined || data === null) {
          console.error("[v0] getOrders retornou null ou undefined")
          setOrders([])
          setError("Não foi possível carregar os pedidos")
          return
        }

        if (!Array.isArray(data)) {
          console.error("[v0] getOrders não retornou um array:", typeof data, data)
          setOrders([])
          setError("Formato de dados inválido")
          return
        }

        console.log("[v0] Setando orders com", data.length, "items")
        setOrders(data)
      } catch (err) {
        console.error("[v0] Erro ao buscar pedidos:", err)
        setOrders([])
        setError(err instanceof Error ? err.message : "Erro ao carregar pedidos")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8" />
          <p className="text-muted-foreground">Carregando pedidos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        <p className="text-muted-foreground">Gerencie todos os pedidos</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-[300px] items-center justify-center">
            <p className="text-muted-foreground">Nenhum pedido encontrado</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {Array.isArray(orders) &&
            orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <CardTitle>Pedido #{order.id}</CardTitle>
                  <CardDescription>
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString("pt-BR") : "Data não informada"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Nome:</span>
                      <span>{order.name || "Não informado"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Valor:</span>
                      <span>
                        {order.value
                          ? new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(order.value)
                          : "R$ 0,00"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <span
                        className={
                          order.status === "completed"
                            ? "text-green-600"
                            : order.status === "pending"
                              ? "text-yellow-600"
                              : order.status === "cancelled"
                                ? "text-red-600"
                                : ""
                        }
                      >
                        {order.status || "Desconhecido"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  )
}

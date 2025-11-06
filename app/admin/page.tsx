"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { getOrders, updateOrderStatus, type Order } from "@/lib/orders"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Package, Clock, CheckCircle2, Truck, ShoppingBag, DollarSign, Lock } from "lucide-react"
import Link from "next/link"

const ADMIN_PASSWORD = "pasteis2025" // Você pode mudar essa senha

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    preparing: 0,
    delivered: 0,
    revenue: 0,
  })

  useEffect(() => {
    const auth = sessionStorage.getItem("admin_authenticated")
    if (auth === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders()
    }
  }, [isAuthenticated])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem("admin_authenticated", "true")
      setError("")
    } else {
      setError("Senha incorreta!")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem("admin_authenticated")
    setPassword("")
  }

  const loadOrders = () => {
    const allOrders = getOrders()
    setOrders(allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))

    const stats = {
      total: allOrders.length,
      pending: allOrders.filter((o) => o.status === "pending").length,
      confirmed: allOrders.filter((o) => o.status === "confirmed").length,
      preparing: allOrders.filter((o) => o.status === "preparing").length,
      delivered: allOrders.filter((o) => o.status === "delivered").length,
      revenue: allOrders.reduce((sum, o) => sum + o.total, 0),
    }
    setStats(stats)
  }

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    updateOrderStatus(orderId, newStatus)
    loadOrders()
  }

  const getStatusBadge = (status: Order["status"]) => {
    const statusConfig = {
      pending: { label: "Pendente", variant: "outline" as const, icon: Clock },
      confirmed: { label: "Confirmado", variant: "secondary" as const, icon: CheckCircle2 },
      preparing: { label: "Preparando", variant: "default" as const, icon: Package },
      delivered: { label: "Entregue", variant: "secondary" as const, icon: Truck },
    }

    const config = statusConfig[status]
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const filterOrdersByStatus = (status?: Order["status"]) => {
    if (!status) return orders
    return orders.filter((o) => o.status === status)
  }

  const OrderCard = ({ order }: { order: Order }) => (
    <Card className="p-6 border-2 border-border hover:border-primary transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-muted-foreground">Pedido</p>
          <p className="text-lg font-bold text-foreground">{order.id}</p>
        </div>
        {getStatusBadge(order.status)}
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <p className="text-sm text-muted-foreground">Cliente</p>
          <p className="font-bold text-foreground">{order.customerName}</p>
          <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Itens</p>
          <div className="space-y-1 mt-1">
            {order.items.map((item, index) => (
              <div key={index}>
                <p className="text-sm text-foreground font-medium">
                  {item.quantity}x {item.product.name}
                </p>
                {item.comboSelection && (
                  <div className="ml-4 mt-1 space-y-0.5">
                    <p className="text-xs text-muted-foreground">Pastéis:</p>
                    {item.comboSelection.pasteis.map((pastel, i) => (
                      <p key={i} className="text-xs text-muted-foreground">
                        • {pastel.name}
                      </p>
                    ))}
                    <p className="text-xs text-muted-foreground mt-1">Drinks:</p>
                    {item.comboSelection.drinks.map((drink, i) => (
                      <p key={i} className="text-xs text-muted-foreground">
                        • {drink.name}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Pagamento</p>
          <p className="text-sm font-bold text-foreground capitalize">
            {order.paymentMethod === "pix" && "PIX"}
            {order.paymentMethod === "card" && "Cartão"}
            {order.paymentMethod === "cash" && "Dinheiro"}
          </p>
          {order.paymentProof && (
            <div className="mt-2 p-2 bg-secondary/10 rounded border border-secondary">
              <p className="text-xs text-muted-foreground">Comprovante:</p>
              <p className="text-xs font-mono text-foreground break-all">{order.paymentProof}</p>
            </div>
          )}
        </div>

        <div className="pt-3 border-t-2 border-border">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-xl font-bold text-primary">R$ {order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {order.status === "pending" && (
          <Button
            onClick={() => handleStatusChange(order.id, "confirmed")}
            className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold"
          >
            Confirmar
          </Button>
        )}
        {order.status === "confirmed" && (
          <Button
            onClick={() => handleStatusChange(order.id, "preparing")}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
          >
            Preparar
          </Button>
        )}
        {order.status === "preparing" && (
          <Button
            onClick={() => handleStatusChange(order.id, "delivered")}
            className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
          >
            Entregar
          </Button>
        )}
        {order.status === "delivered" && (
          <Badge variant="secondary" className="flex-1 justify-center py-2">
            Pedido Concluído
          </Badge>
        )}
      </div>
    </Card>
  )

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 border-4 border-primary">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">PASTÉIS DA LIGA</h1>
            <p className="text-muted-foreground">Painel Administrativo</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-bold">
                Senha de Acesso
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha"
                className="border-2"
              />
              {error && <p className="text-sm text-destructive font-medium">{error}</p>}
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 font-bold text-lg py-6">
              Entrar
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/">
              <Button variant="ghost" className="text-muted-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Site
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b-4 border-primary bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">PASTÉIS DA LIGA</h1>
              <p className="text-sm text-muted-foreground">Painel Administrativo</p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleLogout} variant="outline" className="border-2 font-bold bg-transparent">
                Sair
              </Button>
              <Link href="/">
                <Button variant="outline" className="border-2 font-bold bg-transparent">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar ao Site
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 border-2 border-border">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Pedidos</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-2 border-border">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <Clock className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-2 border-border">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Package className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Em Preparo</p>
                <p className="text-2xl font-bold text-foreground">{stats.preparing}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-2 border-border">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Faturamento</p>
                <p className="text-2xl font-bold text-foreground">R$ {stats.revenue.toFixed(2)}</p>
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="all" className="font-bold">
              Todos ({stats.total})
            </TabsTrigger>
            <TabsTrigger value="pending" className="font-bold">
              Pendentes ({stats.pending})
            </TabsTrigger>
            <TabsTrigger value="confirmed" className="font-bold">
              Confirmados ({stats.confirmed})
            </TabsTrigger>
            <TabsTrigger value="preparing" className="font-bold">
              Preparando ({stats.preparing})
            </TabsTrigger>
            <TabsTrigger value="delivered" className="font-bold">
              Entregues ({stats.delivered})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {orders.length === 0 ? (
              <Card className="p-12 text-center border-2 border-dashed">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">Nenhum pedido ainda</p>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterOrdersByStatus("pending").map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="confirmed">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterOrdersByStatus("confirmed").map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="preparing">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterOrdersByStatus("preparing").map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="delivered">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterOrdersByStatus("delivered").map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

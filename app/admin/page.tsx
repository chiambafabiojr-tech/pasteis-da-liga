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

const ADMIN_PASSWORD = "pasteis2025" // senha para acessar o painel admin

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

  // mantém sessão logada
  useEffect(() => {
    if (sessionStorage.getItem("admin_authenticated") === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) loadOrders()
  }, [isAuthenticated])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem("admin_authenticated", "true")
      setError("")
    } else setError("Senha incorreta!")
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem("admin_authenticated")
    setPassword("")
  }

  const loadOrders = () => {
    const allOrders = getOrders() || []
    setOrders(allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))

    const stats = {
      total: allOrders.length,
      pending: allOrders.filter(o => o.status === "pending").length,
      confirmed: allOrders.filter(o => o.status === "confirmed").length,
      preparing: allOrders.filter(o => o.status === "preparing").length,
      delivered: allOrders.filter(o => o.status === "delivered").length,
      revenue: allOrders.reduce((sum, o) => sum + (o.total || 0), 0),
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

    const Icon = statusConfig[status].icon
    return (
      <Badge variant={statusConfig[status].variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" /> {statusConfig[status].label}
      </Badge>
    )
  }

  const filterOrders = (status?: Order["status"]) => {
    if (!status) return orders
    return orders.filter(o => o.status === status)
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
            {(order.items || []).map((item, index) => (
              <div key={index}>
                <p className="text-sm font-medium">
                  {item.quantity}x {item.product?.name}
                </p>
                {item.comboSelection && (
                  <div className="ml-4 mt-1 space-y-0.5">
                    <p className="text-xs text-muted-foreground">Pastéis:</p>
                    {(item.comboSelection.pasteis || []).map((p, i) => (
                      <p key={i} className="text-xs text-muted-foreground">• {p.name}</p>
                    ))}
                    <p className="text-xs text-muted-foreground mt-1">Drinks:</p>
                    {(item.comboSelection.drinks || []).map((d, i) => (
                      <p key={i} className="text-xs text-muted-foreground">• {d.name}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Pagamento</p>
          <p className="text-sm font-bold capitalize">
            {order.paymentMethod === "pix" && "PIX"}
            {order.paymentMethod === "card" && "Cartão"}
            {order.paymentMethod === "cash" && "Dinheiro"}
          </p>
          {order.paymentProof && (
            <div className="mt-2 p-2 bg-secondary/10 rounded border border-secondary">
              <p className="text-xs text-muted-foreground">Comprovante:</p>
              <p className="text-xs font-mono break-all">{order.paymentProof}</p>
            </div>
          )}
        </div>

        <div className="pt-3 border-t-2 border-border flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-xl font-bold text-primary">R$ {order.total?.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-2">
        {order.status === "pending" && (
          <Button onClick={() => handleStatusChange(order.id, "confirmed")} className="flex-1 bg-secondary">
            Confirmar
          </Button>
        )}
        {order.status === "confirmed" && (
          <Button onClick={() => handleStatusChange(order.id, "preparing")} className="flex-1 bg-primary">
            Preparar
          </Button>
        )}
        {order.status === "preparing" && (
          <Button onClick={() => handleStatusChange(order.id, "delivered")} className="flex-1 bg-accent">
            Entregar
          </Button>
        )}
        {order.status === "delivered" && (
          <Badge variant="secondary" className="flex-1 justify-center py-2">Pedido Concluído</Badge>
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
            <h1 className="text-3xl font-bold">PASTÉIS DA LIGA</h1>
            <p className="text-muted-foreground">Painel Administrativo</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Senha de Acesso</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Digite a senha"
              />
              {error && <p className="text-sm text-destructive font-medium">{error}</p>}
            </div>

            <Button type="submit" className="w-full font-bold text-lg py-6">
              Entrar
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/">
              <Button variant="ghost" className="text-muted-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Site
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
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">PASTÉIS DA LIGA</h1>
            <p className="text-sm text-muted-foreground">Painel Administrativo</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleLogout} variant="outline">Sair</Button>
            <Link href="/"><Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Button></Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 border-2"><p>Total de Pedidos: <b>{stats.total}</b></p></Card>
          <Card className="p-6 border-2"><p>Pendentes: <b>{stats.pending}</b></p></Card>
          <Card className="p-6 border-2"><p>Preparando: <b>{stats.preparing}</b></p></Card>
          <Card className="p-6 border-2"><p>Faturamento: <b>R$ {stats.revenue.toFixed(2)}</b></p></Card>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="all">Todos ({stats.total})</TabsTrigger>
            <TabsTrigger value="pending">Pendentes ({stats.pending})</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmados ({stats.confirmed})</TabsTrigger>
            <TabsTrigger value="preparing">Preparando ({stats.preparing})</TabsTrigger>
            <TabsTrigger value="delivered">Entregues ({stats.delivered})</TabsTrigger>
          </TabsList>

          {["all", "pending", "confirmed", "preparing", "delivered"].map(status => (
            <TabsContent key={status} value={status}>
              {filterOrders(status === "all" ? undefined : (status as Order["status"])).length === 0 ? (
                <Card className="p-12 text-center border-2 border-dashed">
                  <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">Nenhum pedido</p>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filterOrders(status === "all" ? undefined : (status as Order["status"])).map(o => (
                    <OrderCard key={o.id} order={o} />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  )
}

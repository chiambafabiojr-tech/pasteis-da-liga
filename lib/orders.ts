import type { CartItem } from "./cart"

export interface Order {
  id: string
  customerName: string
  customerPhone: string
  customerEmail: string
  deliveryAddress: string
  items: CartItem[]
  total: number
  status: "pending" | "confirmed" | "preparing" | "delivered"
  createdAt: string
  paymentMethod: "pix" | "card" | "cash"
  paymentProof?: string
}

export function saveOrder(order: Omit<Order, "id" | "createdAt" | "status">): Order {
  const orders = getOrders()

  const newOrder: Order = {
    ...order,
    id: `ORDER-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "pending",
  }

  orders.push(newOrder)
  localStorage.setItem("pasteis-liga-orders", JSON.stringify(orders))

  return newOrder
}

export function getOrders(): Order[] {
  if (typeof window === "undefined") return []

  const ordersData = localStorage.getItem("pasteis-liga-orders")
  if (!ordersData) return []

  return JSON.parse(ordersData)
}

export function getOrderById(id: string): Order | undefined {
  const orders = getOrders()
  return orders.find((order) => order.id === id)
}

export function updateOrderStatus(id: string, status: Order["status"]): Order | undefined {
  const orders = getOrders()
  const order = orders.find((o) => o.id === id)

  if (order) {
    order.status = status
    localStorage.setItem("pasteis-liga-orders", JSON.stringify(orders))
  }

  return order
}

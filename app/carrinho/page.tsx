"use client"

import { useState, useEffect } from "react"
import { getCart, updateQuantity, removeFromCart, type Cart } from "@/lib/cart"
import { getProductById } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function CarrinhoPage() {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setCart(getCart())
    setIsLoading(false)
  }, [])

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    const updatedCart = updateQuantity(productId, newQuantity)
    setCart(updatedCart)
  }

  const handleRemove = (productId: string) => {
    const updatedCart = removeFromCart(productId)
    setCart(updatedCart)
  }

  if (isLoading) {
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">PASTÉIS DA LIGA</h1>
              <p className="text-sm text-muted-foreground">Seu Carrinho</p>
            </div>

            <Link href="/">
              <Button variant="outline" className="border-2 font-bold bg-transparent">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {cart.items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-foreground mb-4">Seu carrinho está vazio</h2>
            <p className="text-muted-foreground mb-8 text-lg">Adicione alguns pastéis heroicos para começar!</p>
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-8 py-6">
                Ver Cardápio
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-2xl font-bold text-foreground mb-6">Itens do Pedido</h2>

              {cart.items.map((item, index) => (
                <Card key={`${item.product.id}-${index}`} className="p-6 border-2 border-border">
                  <div className="flex gap-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-muted to-card rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                      {item.product.image ? (
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      ) : (
                        <span className="text-3xl font-bold text-muted-foreground/30">
                          {item.product.hero.charAt(0)}
                        </span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-foreground">{item.product.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.product.description}</p>

                          {item.comboSelection && (
                            <div className="mt-3 p-3 bg-muted/50 rounded-lg border border-border">
                              <p className="text-xs font-bold text-foreground mb-2">Itens do Combo:</p>
                              <div className="space-y-1">
                                <div>
                                  <p className="text-xs text-muted-foreground font-semibold">Pastéis:</p>
                                  <ul className="text-xs text-foreground ml-2">
                                    {item.comboSelection.pasteis.map((pastelId) => {
                                      const pastel = getProductById(pastelId)
                                      return <li key={pastelId}>• {pastel?.name}</li>
                                    })}
                                  </ul>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground font-semibold">Drinks:</p>
                                  <ul className="text-xs text-foreground ml-2">
                                    {item.comboSelection.drinks.map((drinkId) => {
                                      const drink = getProductById(drinkId)
                                      return <li key={drinkId}>• {drink?.name}</li>
                                    })}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemove(item.product.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="h-8 w-8 border-2"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="text-lg font-bold w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="h-8 w-8 border-2"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">R$ {item.product.price.toFixed(2)} cada</p>
                          <p className="text-xl font-bold text-foreground">
                            R$ {(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 border-2 border-primary sticky top-4">
                <h3 className="text-2xl font-bold text-foreground mb-6">Resumo do Pedido</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>R$ {cart.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Taxa de entrega</span>
                    <span className="text-secondary font-bold">Grátis</span>
                  </div>
                  <div className="border-t-2 border-border pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-foreground">Total</span>
                      <span className="text-2xl font-bold text-primary">R$ {cart.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Link href="/checkout">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-6">
                    Finalizar Pedido
                  </Button>
                </Link>

                <Link href="/">
                  <Button variant="outline" className="w-full mt-3 border-2 font-bold bg-transparent">
                    Adicionar Mais Itens
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

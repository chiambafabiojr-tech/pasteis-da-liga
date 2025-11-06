"use client"

import { useState, useEffect } from "react"
import { getProductsByCategory } from "@/lib/products"
import { addToCart, getCart } from "@/lib/cart"
import { ProductCard } from "@/components/product-card"
import { CartButton } from "@/components/cart-button"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Zap, Shield, Users } from "lucide-react"

export default function Home() {
  const [cartItemCount, setCartItemCount] = useState(0)

  useEffect(() => {
    const cart = getCart()
    setCartItemCount(cart.items.reduce((sum, item) => sum + item.quantity, 0))
  }, [])

  const handleAddToCart = (product: any, comboSelection?: any) => {
    const cart = addToCart(product, 1, comboSelection)
    setCartItemCount(cart.items.reduce((sum, item) => sum + item.quantity, 0))
  }

  const pasteis = getProductsByCategory("pastel")
  const drinks = getProductsByCategory("drink")
  const combos = getProductsByCategory("combo")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b-4 border-primary bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">PASTÉIS DA LIGA</h1>
              <p className="text-sm text-muted-foreground">Sabores Heroicos</p>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="outline" className="border-2 font-bold bg-transparent">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin
                </Button>
              </Link>
              <CartButton itemCount={cartItemCount} />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/liga-bg.jpg')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">Bem-vindo à Liga!</h2>
          <p className="text-2xl md:text-3xl font-semibold text-yellow-300 mb-6 tracking-wide">
            Monte sua própria Liga do Sabor: heróis em forma de pastéis e drinks lendários
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-white">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6" />
              <span className="font-bold">Sabor Poderoso</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6" />
              <span className="font-bold">Qualidade Heroica</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              <span className="font-bold">Para Todos</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pastéis Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-foreground mb-3 tracking-tight">PASTÉIS DA LIGA</h2>
            <div className="h-1 w-24 bg-primary mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pasteis.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* Drinks Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-foreground mb-3 tracking-tight">DRINKS PODEROSOS</h2>
            <div className="h-1 w-24 bg-accent mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {drinks.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* Combos Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-foreground mb-3 tracking-tight">COMBOS DOS VILÕES</h2>
            <div className="h-1 w-24 bg-secondary mx-auto"></div>
            <p className="text-muted-foreground mt-4 text-lg">Ofertas irresistíveis para os mais famintos</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {combos.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t-4 border-primary py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">© 2025 Pastéis da Liga - Todos os direitos reservados</p>
          <p className="text-sm text-muted-foreground mt-2">Feira Gastronômica • Sabores Heroicos</p>
        </div>
      </footer>
    </div>
  )
}

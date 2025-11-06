"use client"

import { useState } from "react"
import Image from "next/image"
import type { Product } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ShoppingCart } from "lucide-react"
import { ComboSelectorDialog } from "./combo-selector-dialog"
import type { ComboSelection } from "@/lib/cart"

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product, comboSelection?: ComboSelection) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [showComboDialog, setShowComboDialog] = useState(false)

  const handleAddToCart = () => {
    if (product.category === "combo") {
      setShowComboDialog(true)
    } else {
      onAddToCart(product)
    }
  }

  const handleComboConfirm = (selection: ComboSelection) => {
    onAddToCart(product, selection)
  }

  return (
    <>
      <Card className="overflow-hidden border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
        <div className="relative h-48 bg-gradient-to-br from-muted to-card flex items-center justify-center overflow-hidden">
          {product.image ? (
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-6xl font-bold text-muted-foreground/20">{product.hero.charAt(0)}</div>
            </div>
          )}
          <div className="absolute top-2 right-2 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            R$ {product.price.toFixed(2)}
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-1">{product.name}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          <Button
            onClick={handleAddToCart}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {product.category === "combo" ? "Montar Combo" : "Adicionar ao Carrinho"}
          </Button>
        </div>
      </Card>

      {product.category === "combo" && (
        <ComboSelectorDialog
          combo={product}
          open={showComboDialog}
          onOpenChange={setShowComboDialog}
          onConfirm={handleComboConfirm}
        />
      )}
    </>
  )
}

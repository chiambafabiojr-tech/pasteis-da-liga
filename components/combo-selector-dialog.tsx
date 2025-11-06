"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Minus, Plus } from "lucide-react"
import type { Product } from "@/lib/products"
import { getProductsByCategory } from "@/lib/products"
import type { ComboSelection } from "@/lib/cart"

interface ComboSelectorDialogProps {
  combo: Product
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (selection: ComboSelection) => void
}

export function ComboSelectorDialog({ combo, open, onOpenChange, onConfirm }: ComboSelectorDialogProps) {
  const [pastelQuantities, setPastelQuantities] = useState<Record<string, number>>({})
  const [drinkQuantities, setDrinkQuantities] = useState<Record<string, number>>({})

  const pasteis = getProductsByCategory("pastel")
  const drinks = getProductsByCategory("drink")

  const maxPasteis = combo.comboConfig?.pasteis || 0
  const maxDrinks = combo.comboConfig?.drinks || 0

  const totalPasteis = Object.values(pastelQuantities).reduce((sum, qty) => sum + qty, 0)
  const totalDrinks = Object.values(drinkQuantities).reduce((sum, qty) => sum + qty, 0)

  const addPastel = (id: string) => {
    if (totalPasteis < maxPasteis) {
      setPastelQuantities((prev) => ({
        ...prev,
        [id]: (prev[id] || 0) + 1,
      }))
    }
  }

  const removePastel = (id: string) => {
    setPastelQuantities((prev) => {
      const newQty = (prev[id] || 0) - 1
      if (newQty <= 0) {
        const { [id]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [id]: newQty }
    })
  }

  const addDrink = (id: string) => {
    if (totalDrinks < maxDrinks) {
      setDrinkQuantities((prev) => ({
        ...prev,
        [id]: (prev[id] || 0) + 1,
      }))
    }
  }

  const removeDrink = (id: string) => {
    setDrinkQuantities((prev) => {
      const newQty = (prev[id] || 0) - 1
      if (newQty <= 0) {
        const { [id]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [id]: newQty }
    })
  }

  const handleConfirm = () => {
    if (totalPasteis === maxPasteis && totalDrinks === maxDrinks) {
      const selectedPasteis: string[] = []
      const selectedDrinks: string[] = []

      Object.entries(pastelQuantities).forEach(([id, qty]) => {
        for (let i = 0; i < qty; i++) {
          selectedPasteis.push(id)
        }
      })

      Object.entries(drinkQuantities).forEach(([id, qty]) => {
        for (let i = 0; i < qty; i++) {
          selectedDrinks.push(id)
        }
      })

      onConfirm({ pasteis: selectedPasteis, drinks: selectedDrinks })
      setPastelQuantities({})
      setDrinkQuantities({})
      onOpenChange(false)
    }
  }

  const isComplete = totalPasteis === maxPasteis && totalDrinks === maxDrinks

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{combo.name}</DialogTitle>
          <DialogDescription className="text-base">
            Escolha {maxPasteis} {maxPasteis === 1 ? "pastel" : "pastéis"} e {maxDrinks}{" "}
            {maxDrinks === 1 ? "drink" : "drinks"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Pastéis Selection */}
          <div>
            <h3 className="text-lg font-bold mb-3">
              Escolha {maxPasteis} {maxPasteis === 1 ? "Pastel" : "Pastéis"} ({totalPasteis}/{maxPasteis})
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {pasteis.map((pastel) => {
                const quantity = pastelQuantities[pastel.id] || 0
                const canAdd = totalPasteis < maxPasteis

                return (
                  <Card
                    key={pastel.id}
                    className={`p-4 border-2 transition-all ${
                      quantity > 0 ? "border-primary bg-primary/10" : "border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground">{pastel.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{pastel.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removePastel(pastel.id)}
                          disabled={quantity === 0}
                          className="h-8 w-8 border-2"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-lg font-bold w-8 text-center">{quantity}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => addPastel(pastel.id)}
                          disabled={!canAdd}
                          className="h-8 w-8 border-2 bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Drinks Selection */}
          <div>
            <h3 className="text-lg font-bold mb-3">
              Escolha {maxDrinks} {maxDrinks === 1 ? "Drink" : "Drinks"} ({totalDrinks}/{maxDrinks})
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {drinks.map((drink) => {
                const quantity = drinkQuantities[drink.id] || 0
                const canAdd = totalDrinks < maxDrinks

                return (
                  <Card
                    key={drink.id}
                    className={`p-4 border-2 transition-all ${
                      quantity > 0 ? "border-secondary bg-secondary/10" : "border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground">{drink.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{drink.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeDrink(drink.id)}
                          disabled={quantity === 0}
                          className="h-8 w-8 border-2"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-lg font-bold w-8 text-center">{quantity}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => addDrink(drink.id)}
                          disabled={!canAdd}
                          className="h-8 w-8 border-2 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>

          <Button
            onClick={handleConfirm}
            disabled={!isComplete}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-6"
          >
            {isComplete ? "Adicionar ao Carrinho" : "Selecione todos os itens"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

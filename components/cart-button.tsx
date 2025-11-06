"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"

interface CartButtonProps {
  itemCount: number
}

export function CartButton({ itemCount }: CartButtonProps) {
  return (
    <Link href="/carrinho">
      <Button
        variant="outline"
        className="relative border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-bold bg-transparent"
      >
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            {itemCount}
          </span>
        )}
      </Button>
    </Link>
  )
}

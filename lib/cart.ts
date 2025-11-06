import type { Product } from "./products"

export interface ComboSelection {
  pasteis: string[] // Array of pastel IDs
  drinks: string[] // Array of drink IDs
}

export interface CartItem {
  product: Product
  quantity: number
  comboSelection?: ComboSelection // Added optional combo selection
}

export interface Cart {
  items: CartItem[]
  total: number
}

export function getCart(): Cart {
  if (typeof window === "undefined") {
    return { items: [], total: 0 }
  }

  const cartData = localStorage.getItem("pasteis-liga-cart")
  if (!cartData) {
    return { items: [], total: 0 }
  }

  return JSON.parse(cartData)
}

export function saveCart(cart: Cart): void {
  if (typeof window === "undefined") return
  localStorage.setItem("pasteis-liga-cart", JSON.stringify(cart))
}

export function addToCart(product: Product, quantity = 1, comboSelection?: ComboSelection): Cart {
  const cart = getCart()

  // For combos with selections, always add as new item (don't merge)
  if (product.category === "combo" && comboSelection) {
    cart.items.push({ product, quantity, comboSelection })
  } else {
    const existingItem = cart.items.find((item) => item.product.id === product.id && !item.comboSelection)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.items.push({ product, quantity })
    }
  }

  cart.total = calculateTotal(cart.items)
  saveCart(cart)

  return cart
}

export function removeFromCart(productId: string): Cart {
  const cart = getCart()
  cart.items = cart.items.filter((item) => item.product.id !== productId)
  cart.total = calculateTotal(cart.items)
  saveCart(cart)

  return cart
}

export function updateQuantity(productId: string, quantity: number): Cart {
  const cart = getCart()
  const item = cart.items.find((item) => item.product.id === productId)

  if (item) {
    item.quantity = quantity
    if (item.quantity <= 0) {
      return removeFromCart(productId)
    }
  }

  cart.total = calculateTotal(cart.items)
  saveCart(cart)

  return cart
}

export function clearCart(): Cart {
  const emptyCart = { items: [], total: 0 }
  saveCart(emptyCart)
  return emptyCart
}

function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
}

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCart, clearCart } from "@/lib/cart"
import { saveOrder } from "@/lib/orders"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Banknote, Wallet, AlertCircle } from "lucide-react"
import Link from "next/link"
import { PixQRCode } from "@/components/pix-qrcode"

const PIX_CONFIG = {
  pixKey: "54870892804",
  merchantName: "Mariane Ferreira de Laia",
  merchantCity: "Itatiba",
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState(getCart())
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    paymentMethod: "pix" as "pix" | "cash",
    paymentProof: "",
  })

  useEffect(() => {
    const currentCart = getCart()
    setCart(currentCart)

    if (currentCart.items.length === 0) {
      router.push("/")
    }
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    console.log("✅ handleSubmit iniciado")
    console.log("🛒 Cart:", cart)
    console.log("📝 FormData:", formData)

    try {
      const order = await saveOrder({
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail || "",
        paymentMethod: formData.paymentMethod,
        paymentProof: formData.paymentProof || "",
        items: cart.items.map((item) => ({
          product: {
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
          },
          quantity: item.quantity,
        })),
        total: cart.total,
      })

      console.log("✅ Pedido salvo:", order)

      clearCart()
      router.push(`/pedido-confirmado?orderId=${order.id}`)
    } catch (error) {
      console.error("❌ Erro ao salvar pedido:", error)
      alert("Erro ao processar pedido. Tente novamente.")
      setIsSubmitting(false)
    }
  }

  if (cart.items.length === 0) return null

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b-4 border-primary bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Mariane Ferreira de Laia</h1>
            <p className="text-sm text-muted-foreground">Finalizar Pedido</p>
          </div>

          <Link href="/carrinho">
            <Button variant="outline" className="border-2 font-bold bg-transparent flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="p-8 border-2 border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6">Informações de Entrega</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customerName" className="text-base font-bold">Nome Completo *</Label>
                  <Input
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                    className="mt-2 border-2"
                    placeholder="Seu nome"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customerPhone" className="text-base font-bold">Telefone *</Label>
                    <Input
                      id="customerPhone"
                      name="customerPhone"
                      type="tel"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      required
                      className="mt-2 border-2"
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="customerEmail" className="text-base font-bold">Email</Label>
                    <Input
                      id="customerEmail"
                      name="customerEmail"
                      type="email"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      className="mt-2 border-2"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t-2 border-border">
                <Label className="text-base font-bold mb-4 block">Forma de Pagamento *</Label>

                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value) => setFormData({ ...formData, paymentMethod: value as any })}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 border-2 border-border rounded-lg p-4 hover:border-primary transition-colors">
                    <RadioGroupItem value="pix" id="pix" />
                    <Label htmlFor="pix" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Wallet className="h-5 w-5 text-secondary" />
                      <div>
                        <p className="font-bold">PIX</p>
                        <p className="text-sm text-muted-foreground">Pagamento instantâneo</p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 border-2 border-border rounded-lg p-4 hover:border-primary transition-colors">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Banknote className="h-5 w-5 text-secondary" />
                      <div>
                        <p className="font-bold">Dinheiro</p>
                        <p className="text-sm text-muted-foreground">Pagamento na entrega</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {formData.paymentMethod === "pix" && (
                  <div className="mt-6 space-y-4">
                    <Card className="p-6 bg-primary/5 border-2 border-primary">
                      <div className="flex items-start gap-3 mb-4">
                        <AlertCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-bold text-foreground text-lg mb-2">Como Pagar com PIX</p>
                        </div>
                      </div>
                    </Card>

                    <PixQRCode
                      pixData={{
                        pixKey: PIX_CONFIG.pixKey,
                        merchantName: PIX_CONFIG.merchantName,
                        merchantCity: PIX_CONFIG.merchantCity,
                        amount: cart.total,
                        description: "Pasteis da Liga",
                        txid: `PEDIDO${Date.now()}`,
                      }}
                    />

                    <div>
                      <Label htmlFor="paymentProof" className="text-base font-bold">Comprovante de Pagamento *</Label>
                      <Input
                        id="paymentProof"
                        name="paymentProof"
                        value={formData.paymentProof}
                        onChange={handleInputChange}
                        required
                        className="mt-2 border-2"
                        placeholder="Cole o código da transação ou últimos 6 dígitos"
                      />
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-6 mt-8"
              >
                {isSubmitting ? "Processando..." : "Confirmar Pedido"}
              </Button>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="p-6 border-2 border-primary sticky top-4">
            <h3 className="text-xl font-bold text-foreground mb-4">Resumo do Pedido</h3>
            <div className="space-y-3 mb-6">
              {cart.items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-foreground">
                    {item.quantity}x {item.product.name}
                  </span>
                  <span className="font-bold text-foreground">
                    R$ {(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-border pt-4 space-y-2">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>R$ {cart.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Taxa de entrega</span>
                <span className="text-secondary font-bold">Grátis</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t-2 border-border">
                <span className="text-lg font-bold text-foreground">Total</span>
                <span className="text-2xl font-bold text-primary">R$ {cart.total.toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

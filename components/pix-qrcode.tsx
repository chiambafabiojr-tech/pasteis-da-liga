"use client"

import { useEffect, useRef, useState } from "react"
import QRCode from "qrcode"
import { generatePixPayload, type PixData } from "@/lib/pix"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

interface PixQRCodeProps {
  pixData: PixData
}

export function PixQRCode({ pixData }: PixQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [pixPayload, setPixPayload] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const payload = generatePixPayload(pixData)
    setPixPayload(payload)

    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        payload,
        {
          width: 280,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        },
        (error) => {
          if (error) console.error("[v0] Error generating QR Code:", error)
        },
      )
    }
  }, [pixData])

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixPayload)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="p-6 bg-background border-2 border-primary">
      <div className="space-y-4">
        <div className="text-center">
          <p className="font-bold text-foreground text-lg mb-2">Escaneie o QR Code</p>
          <p className="text-sm text-muted-foreground mb-4">Abra o app do seu banco e escaneie o código abaixo</p>
        </div>

        <div className="flex justify-center bg-white p-4 rounded-lg">
          <canvas ref={canvasRef} />
        </div>

        <div className="bg-primary/5 rounded-lg p-4 border-2 border-primary/20">
          <p className="text-sm text-muted-foreground mb-1 text-center">Valor a pagar:</p>
          <p className="text-3xl font-bold text-primary text-center">R$ {pixData.amount.toFixed(2)}</p>
        </div>

        <div className="pt-4 border-t-2 border-border">
          <p className="text-sm font-bold text-foreground mb-2 text-center">Ou copie o código PIX Copia e Cola:</p>
          <Button
            type="button"
            onClick={copyPixCode}
            variant="outline"
            className="w-full border-2 border-primary hover:bg-primary hover:text-primary-foreground bg-transparent font-bold"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Código Copiado!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copiar Código PIX
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  )
}

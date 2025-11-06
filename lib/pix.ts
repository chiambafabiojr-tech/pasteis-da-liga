// Gerador de payload PIX seguindo o padrão EMV
export interface PixData {
  pixKey: string
  description: string
  merchantName: string
  merchantCity: string
  amount: number
  txid?: string
}

function normalizeString(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
}

function crc16(str: string): string {
  let crc = 0xffff
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021
      } else {
        crc = crc << 1
      }
    }
  }
  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, "0")
}

function generateEMVField(id: string, value: string): string {
  const length = value.length.toString().padStart(2, "0")
  return `${id}${length}${value}`
}

export function generatePixPayload(data: PixData): string {
  const merchantName = normalizeString(data.merchantName).substring(0, 25)
  const merchantCity = normalizeString(data.merchantCity).substring(0, 15)

  console.log("[v0] Generating PIX payload with:", {
    pixKey: data.pixKey,
    merchantName,
    merchantCity,
    amount: data.amount.toFixed(2),
  })

  const payload = [
    generateEMVField("00", "01"), // Payload Format Indicator
    generateEMVField("26", generatePixKey(data.pixKey)), // Merchant Account Information
    generateEMVField("52", "0000"), // Merchant Category Code
    generateEMVField("53", "986"), // Transaction Currency (986 = BRL)
    generateEMVField("54", data.amount.toFixed(2)), // Transaction Amount
    generateEMVField("58", "BR"), // Country Code
    generateEMVField("59", merchantName), // Merchant Name
    generateEMVField("60", merchantCity), // Merchant City
    data.txid ? generateEMVField("62", generateEMVField("05", data.txid.substring(0, 25))) : "", // Additional Data
  ].join("")

  const payloadWithCRC = payload + "6304"
  const crc = crc16(payloadWithCRC)
  const finalPayload = payloadWithCRC + crc

  console.log("[v0] Final PIX payload:", finalPayload)

  return finalPayload
}

function generatePixKey(pixKey: string): string {
  const gui = "br.gov.bcb.pix" // GUI do arranjo de pagamento PIX
  const key = generateEMVField("00", gui) + generateEMVField("01", pixKey)
  return key
}

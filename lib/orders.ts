// lib/orders.ts (Substitua a sua função createOrder existente)

// ... (Mantenha o resto do arquivo inalterado)

export const createOrder = async (orderData: Omit<Order, "id" | "createdAt">): Promise<string> => {
  if (!isFirebaseConfigured || !db) {
    console.error("[v0] Firebase não configurado (createOrder)")
    throw new Error("Firebase não está configurado. Verifique as variáveis de ambiente.")
  }

  try {
    console.log("[v0] Tentando criar pedido no Firestore...")

    const ordersCollection = collection(db, "orders")
    
    // CORREÇÃO: Usamos o addDoc diretamente e retornamos seu ID
    const docRef = await addDoc(ordersCollection, {
      ...orderData,
      createdAt: new Date(),
    })
    
    console.log("[v0] Pedido criado com ID:", docRef.id)
    return docRef.id
    
  } catch (error) {
    console.error("[v0] FALHA CRÍTICA ao criar pedido no Firestore:", error)
    
    // Relança o erro com uma mensagem mais útil para o desenvolvedor
    throw new Error(
      "Falha ao salvar o pedido no banco de dados. Verifique as Regras de Segurança do Firestore e o console do servidor."
    )
  }
}
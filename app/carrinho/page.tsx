// CarrinhoPage.tsx (FUNÇÃO handleSubmit CORRIGIDA)

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    console.log("[v0] Iniciando processo de finalização do pedido")

    try {
      // 1. Tente gerar o PIX (Esta lógica deve estar ANTES de createOrder,
      // mas como não a temos, assumimos que ela está ok e o problema é o save.)

      const orderId = await createOrder({
        items: cartItems,
        total,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        status: "pending",
      })

      if (orderId) {
        console.log("[v0] Pedido finalizado com sucesso:", orderId)
        // CORREÇÃO: Redireciona para o ID correto.
        router.push(`/pedido-confirmado?orderId=${orderId}`) 
      } else {
        // Se orderId for null por algum motivo, lance um erro.
        throw new Error("O ID do pedido não foi retornado.")
      }
      
    } catch (err: any) {
      console.error("[v0] Erro CRÍTICO ao finalizar pedido:", err)
      // CORREÇÃO: Exibe a mensagem de erro do Firebase no frontend
      setError(err.message || "Erro desconhecido. Consulte o console.")
    } finally {
      setLoading(false)
    }
  }
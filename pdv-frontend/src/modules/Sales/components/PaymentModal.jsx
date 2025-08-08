import React, { useState } from 'react'

/**
 * Modal de Pagamento
 * Permite selecionar forma de pagamento e finalizar venda
 */
const PaymentModal = ({ isOpen, onClose, total, items, onFinishSale }) => {
  const [paymentMethod, setPaymentMethod] = useState('dinheiro')
  const [receivedAmount, setReceivedAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const calculateChange = () => {
    const received = parseFloat(receivedAmount) || 0
    return Math.max(0, received - total)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      const paymentData = {
        method: paymentMethod,
        total,
        received: parseFloat(receivedAmount) || total,
        change: calculateChange(),
        items: items.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.preco,
          total: item.preco * item.quantity
        }))
      }

      await onFinishSale(paymentData)
    } catch (error) {
      console.error('Erro ao finalizar venda:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    if (!isProcessing) {
      setPaymentMethod('dinheiro')
      setReceivedAmount('')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text">Finalizar Venda</h2>
            <button
              onClick={handleClose}
              disabled={isProcessing}
              className="text-text-secondary hover:text-text transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Resumo da venda */}
          <div className="bg-accent/10 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-text-secondary">Total da Venda:</span>
              <span className="text-2xl font-bold text-primary">{formatCurrency(total)}</span>
            </div>
            <div className="text-sm text-text-secondary">
              {items.length} {items.length === 1 ? 'item' : 'itens'}
            </div>
          </div>

          {/* Forma de pagamento */}
          <div>
            <label className="block text-sm font-medium text-text mb-3">
              Forma de Pagamento
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'dinheiro', label: 'Dinheiro', icon: '💵' },
                { value: 'cartao_credito', label: 'Cartão Crédito', icon: '💳' },
                { value: 'cartao_debito', label: 'Cartão Débito', icon: '💳' },
                { value: 'pix', label: 'PIX', icon: '📱' }
              ].map((method) => (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => setPaymentMethod(method.value)}
                  className={`p-3 rounded-lg border transition-colors ${
                    paymentMethod === method.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{method.icon}</div>
                    <div className="text-sm font-medium">{method.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Valor recebido (apenas para dinheiro) */}
          {paymentMethod === 'dinheiro' && (
            <div>
              <label htmlFor="receivedAmount" className="block text-sm font-medium text-text mb-2">
                Valor Recebido
              </label>
              <input
                id="receivedAmount"
                type="number"
                step="0.01"
                min={total}
                value={receivedAmount}
                onChange={(e) => setReceivedAmount(e.target.value)}
                className="input w-full"
                placeholder={formatCurrency(total)}
                required
              />
              {receivedAmount && parseFloat(receivedAmount) > total && (
                <div className="mt-2 text-sm text-success">
                  Troco: {formatCurrency(calculateChange())}
                </div>
              )}
            </div>
          )}

          {/* Botões */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isProcessing}
              className="btn btn-outline flex-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isProcessing || (paymentMethod === 'dinheiro' && (!receivedAmount || parseFloat(receivedAmount) < total))}
              className="btn btn-primary flex-1"
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processando...</span>
                </div>
              ) : (
                'Finalizar Venda'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PaymentModal 
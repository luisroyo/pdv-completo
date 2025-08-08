import React, { useState } from 'react'
import { useCashRegisterStore } from '../../../store/cashRegisterStore'
import { useAuthStore } from '../../../store/authStore'

/**
 * Modal de Fechamento de Caixa
 * Permite fechar o caixa com valor final e observações
 */
const CloseCashModal = ({ isOpen, onClose, cashStatus, totalCash, onSuccess }) => {
  const [closingAmount, setClosingAmount] = useState('')
  const [observations, setObservations] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  
  const { closeCash } = useCashRegisterStore()
  const { user } = useAuthStore()

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const calculateDifference = () => {
    const expected = totalCash
    const actual = parseFloat(closingAmount) || 0
    return actual - expected
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)
    setError('')

    try {
      const amount = parseFloat(closingAmount) || 0
      
      if (amount < 0) {
        throw new Error('O valor final não pode ser negativo')
      }

      await closeCash({
        closingAmount: amount,
        closedBy: user?.nome || 'Usuário',
        observations
      })

      onSuccess()
    } catch (err) {
      setError(err.message || 'Erro ao fechar caixa')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    if (!isProcessing) {
      setClosingAmount('')
      setObservations('')
      setError('')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-lg mx-4">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text">Fechar Caixa</h2>
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
          {/* Resumo do caixa */}
          <div className="bg-accent/10 rounded-lg p-4">
            <h3 className="font-medium text-text mb-3">Resumo do Caixa</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-text-secondary">Saldo Inicial:</span>
                <div className="font-medium text-text">
                  {formatCurrency(cashStatus?.openingAmount || 0)}
                </div>
              </div>
              <div>
                <span className="text-text-secondary">Saldo Esperado:</span>
                <div className="font-medium text-primary">
                  {formatCurrency(totalCash)}
                </div>
              </div>
            </div>
          </div>

          {/* Campo valor final */}
          <div>
            <label htmlFor="closingAmount" className="block text-sm font-medium text-text mb-2">
              Valor Final em Caixa (R$)
            </label>
            <input
              id="closingAmount"
              type="number"
              step="0.01"
              min="0"
              value={closingAmount}
              onChange={(e) => setClosingAmount(e.target.value)}
              className="input w-full"
              placeholder={formatCurrency(totalCash)}
              required
              autoFocus
            />
            <p className="text-xs text-text-secondary mt-1">
              Valor real encontrado no caixa
            </p>
          </div>

          {/* Diferença */}
          {closingAmount && (
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary">Diferença:</span>
                <span className={`font-bold text-lg ${
                  calculateDifference() >= 0 ? 'text-success' : 'text-error'
                }`}>
                  {formatCurrency(calculateDifference())}
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-1">
                {calculateDifference() >= 0 ? 'Sobra' : 'Falta'} no caixa
              </p>
            </div>
          )}

          {/* Observações */}
          <div>
            <label htmlFor="observations" className="block text-sm font-medium text-text mb-2">
              Observações (opcional)
            </label>
            <textarea
              id="observations"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className="input w-full resize-none"
              rows="3"
              placeholder="Observações sobre o fechamento do caixa..."
            />
          </div>

          {/* Responsável */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Responsável
            </label>
            <div className="p-3 bg-accent/10 rounded-lg">
              <span className="text-text font-medium">
                {user?.nome || 'Usuário'}
              </span>
            </div>
          </div>

          {/* Mensagem de erro */}
          {error && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-3">
              <p className="text-error text-sm">{error}</p>
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
              disabled={isProcessing}
              className="btn btn-error flex-1"
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Fechando...</span>
                </div>
              ) : (
                'Fechar Caixa'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CloseCashModal 
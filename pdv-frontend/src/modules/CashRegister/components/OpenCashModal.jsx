import React, { useState } from 'react'
import { useCashRegisterStore } from '../../../store/cashRegisterStore'
import { useAuthStore } from '../../../store/authStore'

/**
 * Modal de Abertura de Caixa
 * Permite abrir o caixa com valor inicial
 */
const OpenCashModal = ({ isOpen, onClose, onSuccess }) => {
  const [openingAmount, setOpeningAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  
  const { openCash } = useCashRegisterStore()
  const { user } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)
    setError('')

    try {
      const amount = parseFloat(openingAmount) || 0
      
      if (amount < 0) {
        throw new Error('O valor inicial não pode ser negativo')
      }

      await openCash({
        openingAmount: amount,
        openedBy: user?.nome || 'Usuário'
      })

      onSuccess()
    } catch (err) {
      setError(err.message || 'Erro ao abrir caixa')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    if (!isProcessing) {
      setOpeningAmount('')
      setError('')
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
            <h2 className="text-xl font-semibold text-text">Abrir Caixa</h2>
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
          {/* Informações */}
          <div className="bg-accent/10 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-text">Abertura de Caixa</h3>
                <p className="text-sm text-text-secondary">
                  Defina o valor inicial para abrir o caixa
                </p>
              </div>
            </div>
          </div>

          {/* Campo valor inicial */}
          <div>
            <label htmlFor="openingAmount" className="block text-sm font-medium text-text mb-2">
              Valor Inicial (R$)
            </label>
            <input
              id="openingAmount"
              type="number"
              step="0.01"
              min="0"
              value={openingAmount}
              onChange={(e) => setOpeningAmount(e.target.value)}
              className="input w-full"
              placeholder="0,00"
              required
              autoFocus
            />
            <p className="text-xs text-text-secondary mt-1">
              Valor em dinheiro disponível no caixa
            </p>
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
              className="btn btn-primary flex-1"
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Abrindo...</span>
                </div>
              ) : (
                'Abrir Caixa'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default OpenCashModal 
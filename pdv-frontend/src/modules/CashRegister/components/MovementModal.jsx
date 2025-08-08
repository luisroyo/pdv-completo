import React, { useState } from 'react'
import { useCashRegisterStore } from '../../../store/cashRegisterStore'
import { useAuthStore } from '../../../store/authStore'

/**
 * Modal de Movimentação de Caixa
 * Permite adicionar entradas ou saídas no caixa
 */
const MovementModal = ({ isOpen, onClose, onSuccess }) => {
  const [movementType, setMovementType] = useState('entrada')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  
  const { addMovement } = useCashRegisterStore()
  const { user } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)
    setError('')

    try {
      const movementAmount = parseFloat(amount) || 0
      
      if (movementAmount <= 0) {
        throw new Error('O valor deve ser maior que zero')
      }

      if (!description.trim()) {
        throw new Error('A descrição é obrigatória')
      }

      await addMovement({
        type: movementType,
        amount: movementAmount,
        description: description.trim(),
        createdBy: user?.nome || 'Usuário'
      })

      onSuccess()
    } catch (err) {
      setError(err.message || 'Erro ao adicionar movimentação')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    if (!isProcessing) {
      setMovementType('entrada')
      setAmount('')
      setDescription('')
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
            <h2 className="text-xl font-semibold text-text">Nova Movimentação</h2>
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
          {/* Tipo de movimentação */}
          <div>
            <label className="block text-sm font-medium text-text mb-3">
              Tipo de Movimentação
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'entrada', label: 'Entrada', icon: '📥', color: 'success' },
                { value: 'saida', label: 'Saída', icon: '📤', color: 'error' }
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setMovementType(type.value)}
                  className={`p-4 rounded-lg border transition-colors ${
                    movementType === type.value
                      ? `border-${type.color} bg-${type.color}/10 text-${type.color}`
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <div className="text-sm font-medium">{type.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Valor */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-text mb-2">
              Valor (R$)
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input w-full"
              placeholder="0,00"
              required
              autoFocus
            />
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-text mb-2">
              Descrição
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input w-full resize-none"
              rows="3"
              placeholder={`Descrição da ${movementType === 'entrada' ? 'entrada' : 'saída'}...`}
              required
            />
            <p className="text-xs text-text-secondary mt-1">
              Ex: Compra de material, Pagamento de fornecedor, etc.
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
              className={`btn flex-1 ${
                movementType === 'entrada' ? 'btn-success' : 'btn-error'
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Adicionando...</span>
                </div>
              ) : (
                `Adicionar ${movementType === 'entrada' ? 'Entrada' : 'Saída'}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MovementModal 
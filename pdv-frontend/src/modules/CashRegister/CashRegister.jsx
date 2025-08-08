import React, { useState, useEffect } from 'react'
import { useCashRegisterStore } from '../../store/cashRegisterStore'
import OpenCashModal from './components/OpenCashModal'
import CloseCashModal from './components/CloseCashModal'
import MovementModal from './components/MovementModal'

/**
 * Tela de Gerenciamento de Caixa
 * Permite abrir, fechar e gerenciar movimentações do caixa
 */
const CashRegister = () => {
  const [isOpenModalVisible, setIsOpenModalVisible] = useState(false)
  const [isCloseModalVisible, setIsCloseModalVisible] = useState(false)
  const [isMovementModalVisible, setIsMovementModalVisible] = useState(false)
  
  const { 
    cashStatus, 
    movements, 
    totalCash, 
    totalSales, 
    totalWithdrawals,
    loadCashStatus,
    loadMovements 
  } = useCashRegisterStore()

  useEffect(() => {
    loadCashStatus()
    loadMovements()
  }, [loadCashStatus, loadMovements])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Gerenciamento de Caixa</h1>
          <p className="text-text-secondary">Controle de abertura, fechamento e movimentações</p>
        </div>
        
        {/* Status do caixa */}
        <div className="flex items-center space-x-4">
          <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
            cashStatus?.isOpen 
              ? 'bg-success/10 text-success border border-success/20' 
              : 'bg-error/10 text-error border border-error/20'
          }`}>
            {cashStatus?.isOpen ? 'Caixa Aberto' : 'Caixa Fechado'}
          </div>
          
          {cashStatus?.isOpen && (
            <div className="text-right">
              <div className="text-sm text-text-secondary">Saldo Atual</div>
              <div className="text-xl font-bold text-primary">
                {formatCurrency(totalCash)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ações principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {!cashStatus?.isOpen ? (
          <button
            onClick={() => setIsOpenModalVisible(true)}
            className="btn btn-primary btn-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Abrir Caixa
          </button>
        ) : (
          <>
            <button
              onClick={() => setIsMovementModalVisible(true)}
              className="btn btn-secondary btn-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nova Movimentação
            </button>
            
            <button
              onClick={() => setIsCloseModalVisible(true)}
              className="btn btn-error btn-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Fechar Caixa
            </button>
          </>
        )}
      </div>

      {/* Resumo financeiro */}
      {cashStatus?.isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="text-sm text-text-secondary">Vendas do Dia</div>
            <div className="text-2xl font-bold text-success">
              {formatCurrency(totalSales)}
            </div>
          </div>
          
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="text-sm text-text-secondary">Saídas do Dia</div>
            <div className="text-2xl font-bold text-error">
              {formatCurrency(totalWithdrawals)}
            </div>
          </div>
          
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="text-sm text-text-secondary">Saldo Inicial</div>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(cashStatus.openingAmount || 0)}
            </div>
          </div>
          
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="text-sm text-text-secondary">Diferença</div>
            <div className={`text-2xl font-bold ${
              (totalCash - (cashStatus.openingAmount || 0)) >= 0 
                ? 'text-success' 
                : 'text-error'
            }`}>
              {formatCurrency(totalCash - (cashStatus.openingAmount || 0))}
            </div>
          </div>
        </div>
      )}

      {/* Informações do caixa */}
      {cashStatus?.isOpen && (
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text mb-4">Informações do Caixa</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-text-secondary">Aberto por</div>
              <div className="font-medium text-text">{cashStatus.openedBy}</div>
            </div>
            <div>
              <div className="text-sm text-text-secondary">Data/Hora de Abertura</div>
              <div className="font-medium text-text">
                {formatDate(cashStatus.openedAt)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Movimentações */}
      <div className="bg-surface border border-border rounded-lg">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-text">Movimentações</h3>
        </div>
        
        <div className="overflow-auto">
          {movements.length === 0 ? (
            <div className="p-8 text-center text-text-secondary">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p>Nenhuma movimentação registrada</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-accent/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Data/Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Responsável
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {movements.map((movement) => (
                  <tr key={movement.id} className="hover:bg-accent/5">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                      {formatDate(movement.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        movement.type === 'entrada'
                          ? 'bg-success/10 text-success'
                          : 'bg-error/10 text-error'
                      }`}>
                        {movement.type === 'entrada' ? 'Entrada' : 'Saída'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-text">
                      {movement.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text">
                      {formatCurrency(movement.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                      {movement.createdBy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modais */}
      <OpenCashModal
        isOpen={isOpenModalVisible}
        onClose={() => setIsOpenModalVisible(false)}
        onSuccess={() => {
          setIsOpenModalVisible(false)
          loadCashStatus()
          loadMovements()
        }}
      />

      <CloseCashModal
        isOpen={isCloseModalVisible}
        onClose={() => setIsCloseModalVisible(false)}
        cashStatus={cashStatus}
        totalCash={totalCash}
        onSuccess={() => {
          setIsCloseModalVisible(false)
          loadCashStatus()
          loadMovements()
        }}
      />

      <MovementModal
        isOpen={isMovementModalVisible}
        onClose={() => setIsMovementModalVisible(false)}
        onSuccess={() => {
          setIsMovementModalVisible(false)
          loadMovements()
        }}
      />
    </div>
  )
}

export default CashRegister 
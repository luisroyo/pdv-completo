import React, { useState, useEffect } from 'react'
import { useSalesHistoryStore } from '../../store/salesHistoryStore'
import SaleDetailsModal from './components/SaleDetailsModal'
import FilterModal from './components/FilterModal'

/**
 * Tela de Histórico de Vendas
 * Permite visualizar e filtrar vendas realizadas
 */
const SalesHistory = () => {
  const [selectedSale, setSelectedSale] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    paymentMethod: '',
    minAmount: '',
    maxAmount: '',
    status: ''
  })

  const { 
    sales, 
    isLoading, 
    error, 
    totalSales, 
    totalAmount,
    loadSales,
    applyFilters 
  } = useSalesHistoryStore()

  useEffect(() => {
    loadSales()
  }, [loadSales])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'finalizada':
        return 'bg-success/10 text-success'
      case 'cancelada':
        return 'bg-error/10 text-error'
      case 'pendente':
        return 'bg-warning/10 text-warning'
      default:
        return 'bg-secondary/10 text-secondary'
    }
  }

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'dinheiro':
        return '💵'
      case 'cartao_credito':
      case 'cartao_debito':
        return '💳'
      case 'pix':
        return '📱'
      default:
        return '💰'
    }
  }

  const handleSaleClick = (sale) => {
    setSelectedSale(sale)
    setIsDetailsModalOpen(true)
  }

  const handleFilterApply = (newFilters) => {
    setFilters(newFilters)
    applyFilters(newFilters)
    setIsFilterModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Histórico de Vendas</h1>
          <p className="text-text-secondary">Visualize todas as vendas realizadas</p>
        </div>
        
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="btn btn-outline"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          Filtros
        </button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="text-sm text-text-secondary">Total de Vendas</div>
          <div className="text-2xl font-bold text-primary">
            {totalSales}
          </div>
        </div>
        
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="text-sm text-text-secondary">Valor Total</div>
          <div className="text-2xl font-bold text-success">
            {formatCurrency(totalAmount)}
          </div>
        </div>
        
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="text-sm text-text-secondary">Ticket Médio</div>
          <div className="text-2xl font-bold text-accent">
            {totalSales > 0 ? formatCurrency(totalAmount / totalSales) : 'R$ 0,00'}
          </div>
        </div>
      </div>

      {/* Lista de vendas */}
      <div className="bg-surface border border-border rounded-lg">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-text">Vendas Realizadas</h3>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text-secondary">Carregando vendas...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="bg-error/10 border border-error/20 rounded-lg p-4">
              <p className="text-error">{error}</p>
            </div>
          </div>
        ) : sales.length === 0 ? (
          <div className="p-8 text-center text-text-secondary">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p>Nenhuma venda encontrada</p>
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full">
              <thead className="bg-accent/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Data/Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Número
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Itens
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Pagamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Operador
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sales.map((sale) => (
                  <tr 
                    key={sale.id} 
                    className="hover:bg-accent/5 cursor-pointer"
                    onClick={() => handleSaleClick(sale)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                      {formatDate(sale.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text">
                      #{sale.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                      {sale.items?.length || 0} itens
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text">
                      {formatCurrency(sale.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getPaymentMethodIcon(sale.paymentMethod)}</span>
                        <span className="text-sm text-text">
                          {sale.paymentMethod === 'dinheiro' && 'Dinheiro'}
                          {sale.paymentMethod === 'cartao_credito' && 'Cartão Crédito'}
                          {sale.paymentMethod === 'cartao_debito' && 'Cartão Débito'}
                          {sale.paymentMethod === 'pix' && 'PIX'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(sale.status)}`}>
                        {sale.status === 'finalizada' && 'Finalizada'}
                        {sale.status === 'cancelada' && 'Cancelada'}
                        {sale.status === 'pendente' && 'Pendente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                      {sale.operator}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modais */}
      <SaleDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        sale={selectedSale}
      />

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onApply={handleFilterApply}
      />
    </div>
  )
}

export default SalesHistory 
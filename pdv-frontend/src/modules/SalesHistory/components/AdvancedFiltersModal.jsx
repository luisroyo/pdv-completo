import React, { useState } from 'react'

/**
 * Modal de Filtros Avançados
 * Permite filtrar vendas com critérios específicos
 */
const AdvancedFiltersModal = ({ isOpen, onClose, onApplyFilters, currentFilters }) => {
    const [filters, setFilters] = useState(currentFilters || {
        dataInicio: '',
        dataFim: '',
        valorMin: '',
        valorMax: '',
        metodoPagamento: '',
        status: '',
        operador: '',
        cliente: '',
        nfce: ''
    })

    if (!isOpen) return null

    const handleInputChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleApply = () => {
        onApplyFilters(filters)
        onClose()
    }

    const handleClear = () => {
        const clearedFilters = {
            dataInicio: '',
            dataFim: '',
            valorMin: '',
            valorMax: '',
            metodoPagamento: '',
            status: '',
            operador: '',
            cliente: '',
            nfce: ''
        }
        setFilters(clearedFilters)
        onApplyFilters(clearedFilters)
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-surface rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-primary text-white p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Filtros Avançados</h2>
                            <p className="text-primary-100">Configure filtros específicos para as vendas</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-primary-100 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Conteúdo */}
                <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
                    <div className="space-y-6">
                        {/* Período */}
                        <div className="bg-background border border-border rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-text mb-4">Período</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text mb-2">Data Início</label>
                                    <input
                                        type="date"
                                        value={filters.dataInicio}
                                        onChange={(e) => handleInputChange('dataInicio', e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text mb-2">Data Fim</label>
                                    <input
                                        type="date"
                                        value={filters.dataFim}
                                        onChange={(e) => handleInputChange('dataFim', e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Valor */}
                        <div className="bg-background border border-border rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-text mb-4">Valor da Venda</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text mb-2">Valor Mínimo</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="0,00"
                                        value={filters.valorMin}
                                        onChange={(e) => handleInputChange('valorMin', e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text mb-2">Valor Máximo</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="0,00"
                                        value={filters.valorMax}
                                        onChange={(e) => handleInputChange('valorMax', e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Método de pagamento e status */}
                        <div className="bg-background border border-border rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-text mb-4">Pagamento e Status</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text mb-2">Método de Pagamento</label>
                                    <select
                                        value={filters.metodoPagamento}
                                        onChange={(e) => handleInputChange('metodoPagamento', e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text"
                                    >
                                        <option value="">Todos</option>
                                        <option value="dinheiro">Dinheiro</option>
                                        <option value="cartao_credito">Cartão de Crédito</option>
                                        <option value="cartao_debito">Cartão de Débito</option>
                                        <option value="pix">PIX</option>
                                        <option value="transferencia">Transferência</option>
                                        <option value="boleto">Boleto</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text mb-2">Status</label>
                                    <select
                                        value={filters.status}
                                        onChange={(e) => handleInputChange('status', e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text"
                                    >
                                        <option value="">Todos</option>
                                        <option value="finalizada">Finalizada</option>
                                        <option value="cancelada">Cancelada</option>
                                        <option value="pendente">Pendente</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Operador e cliente */}
                        <div className="bg-background border border-border rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-text mb-4">Operador e Cliente</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text mb-2">Operador</label>
                                    <select
                                        value={filters.operador}
                                        onChange={(e) => handleInputChange('operador', e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text"
                                    >
                                        <option value="">Todos</option>
                                        <option value="admin">Administrador</option>
                                        <option value="joao">João Silva</option>
                                        <option value="maria">Maria Santos</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text mb-2">Cliente</label>
                                    <input
                                        type="text"
                                        placeholder="Nome do cliente"
                                        value={filters.cliente}
                                        onChange={(e) => handleInputChange('cliente', e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* NFC-e */}
                        <div className="bg-background border border-border rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-text mb-4">Informações Fiscais</h3>
                            <div>
                                <label className="block text-sm font-medium text-text mb-2">NFC-e</label>
                                <select
                                    value={filters.nfce}
                                    onChange={(e) => handleInputChange('nfce', e.target.value)}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text"
                                >
                                    <option value="">Todas</option>
                                    <option value="com_nfce">Com NFC-e</option>
                                    <option value="sem_nfce">Sem NFC-e</option>
                                </select>
                            </div>
                        </div>

                        {/* Filtros rápidos */}
                        <div className="bg-background border border-border rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-text mb-4">Filtros Rápidos</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <button
                                    onClick={() => {
                                        const hoje = new Date().toISOString().split('T')[0]
                                        setFilters(prev => ({
                                            ...prev,
                                            dataInicio: hoje,
                                            dataFim: hoje
                                        }))
                                    }}
                                    className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                                >
                                    Hoje
                                </button>
                                <button
                                    onClick={() => {
                                        const ontem = new Date()
                                        ontem.setDate(ontem.getDate() - 1)
                                        const ontemStr = ontem.toISOString().split('T')[0]
                                        setFilters(prev => ({
                                            ...prev,
                                            dataInicio: ontemStr,
                                            dataFim: ontemStr
                                        }))
                                    }}
                                    className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                                >
                                    Ontem
                                </button>
                                <button
                                    onClick={() => {
                                        const inicioSemana = new Date()
                                        inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay())
                                        const fimSemana = new Date()
                                        fimSemana.setDate(inicioSemana.getDate() + 6)
                                        
                                        setFilters(prev => ({
                                            ...prev,
                                            dataInicio: inicioSemana.toISOString().split('T')[0],
                                            dataFim: fimSemana.toISOString().split('T')[0]
                                        }))
                                    }}
                                    className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                                >
                                    Esta Semana
                                </button>
                                <button
                                    onClick={() => {
                                        const inicioMes = new Date()
                                        inicioMes.setDate(1)
                                        const fimMes = new Date()
                                        fimMes.setMonth(fimMes.getMonth() + 1, 0)
                                        
                                        setFilters(prev => ({
                                            ...prev,
                                            dataInicio: inicioMes.toISOString().split('T')[0],
                                            dataFim: fimMes.toISOString().split('T')[0]
                                        }))
                                    }}
                                    className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                                >
                                    Este Mês
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Ações */}
                    <div className="mt-6 flex justify-end space-x-4">
                        <button
                            onClick={handleClear}
                            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            Limpar Filtros
                        </button>
                        <button
                            onClick={handleApply}
                            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Aplicar Filtros
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdvancedFiltersModal 
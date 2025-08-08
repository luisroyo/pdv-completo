import React from 'react'
import { useAuthStore } from '../../../store/authStore'

/**
 * Modal de Detalhes da Venda
 * Exibe informações completas de uma venda específica
 */
const SaleDetailsModal = ({ isOpen, onClose, sale }) => {
    const { user } = useAuthStore()

    if (!isOpen || !sale) return null

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value)
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleString('pt-BR')
    }

    const getPaymentMethodIcon = (method) => {
        const icons = {
            dinheiro: '💵',
            cartao_credito: '💳',
            cartao_debito: '💳',
            pix: '📱',
            transferencia: '🏦',
            boleto: '📄'
        }
        return icons[method] || '💰'
    }

    const getStatusColor = (status) => {
        const colors = {
            finalizada: 'bg-green-100 text-green-800',
            cancelada: 'bg-red-100 text-red-800',
            pendente: 'bg-yellow-100 text-yellow-800'
        }
        return colors[status] || 'bg-gray-100 text-gray-800'
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-surface rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-primary text-white p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Detalhes da Venda</h2>
                            <p className="text-primary-100">Venda #{sale.id}</p>
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Informações da venda */}
                        <div className="space-y-6">
                            <div className="bg-background border border-border rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-text mb-4">Informações da Venda</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-text-secondary">Data/Hora:</span>
                                        <span className="text-text font-medium">{formatDate(sale.data)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-text-secondary">Status:</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sale.status)}`}>
                                            {sale.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-text-secondary">Operador:</span>
                                        <span className="text-text font-medium">{sale.operador}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-text-secondary">Cliente:</span>
                                        <span className="text-text font-medium">{sale.cliente || 'Consumidor Final'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Resumo financeiro */}
                            <div className="bg-background border border-border rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-text mb-4">Resumo Financeiro</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-text-secondary">Subtotal:</span>
                                        <span className="text-text font-medium">{formatCurrency(sale.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-text-secondary">Desconto:</span>
                                        <span className="text-text font-medium">{formatCurrency(sale.desconto || 0)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-text-secondary">Total:</span>
                                        <span className="text-text font-bold text-lg">{formatCurrency(sale.total)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Formas de pagamento */}
                        <div className="space-y-6">
                            <div className="bg-background border border-border rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-text mb-4">Formas de Pagamento</h3>
                                <div className="space-y-3">
                                    {sale.pagamentos?.map((pagamento, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-surface rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-xl">{getPaymentMethodIcon(pagamento.metodo)}</span>
                                                <div>
                                                    <span className="font-medium text-text capitalize">
                                                        {pagamento.metodo.replace('_', ' ')}
                                                    </span>
                                                    {pagamento.parcelas > 1 && (
                                                        <p className="text-sm text-text-secondary">
                                                            {pagamento.parcelas}x
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="font-bold text-text">
                                                {formatCurrency(pagamento.valor)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Informações fiscais */}
                            <div className="bg-background border border-border rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-text mb-4">Informações Fiscais</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-text-secondary">NFC-e:</span>
                                        <span className="text-text font-medium">
                                            {sale.nfce ? `Nº ${sale.nfce}` : 'Não emitida'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-text-secondary">Protocolo:</span>
                                        <span className="text-text font-medium">
                                            {sale.protocolo || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-text-secondary">Chave de Acesso:</span>
                                        <span className="text-text font-medium text-xs">
                                            {sale.chaveAcesso || 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Itens da venda */}
                    <div className="mt-6">
                        <div className="bg-background border border-border rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-text mb-4">Itens da Venda</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="text-left py-3 px-4 font-medium text-text">Produto</th>
                                            <th className="text-left py-3 px-4 font-medium text-text">Código</th>
                                            <th className="text-right py-3 px-4 font-medium text-text">Qtd</th>
                                            <th className="text-right py-3 px-4 font-medium text-text">Preço Unit.</th>
                                            <th className="text-right py-3 px-4 font-medium text-text">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sale.itens?.map((item, index) => (
                                            <tr key={index} className="border-b border-border">
                                                <td className="py-3 px-4 text-text">
                                                    <div>
                                                        <span className="font-medium">{item.produto}</span>
                                                        {item.observacao && (
                                                            <p className="text-sm text-text-secondary">
                                                                {item.observacao}
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-text-secondary">{item.codigo}</td>
                                                <td className="py-3 px-4 text-text text-right">{item.quantidade}</td>
                                                <td className="py-3 px-4 text-text text-right">{formatCurrency(item.precoUnitario)}</td>
                                                <td className="py-3 px-4 text-text text-right font-medium">
                                                    {formatCurrency(item.total)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Observações */}
                    {sale.observacoes && (
                        <div className="mt-6">
                            <div className="bg-background border border-border rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-text mb-4">Observações</h3>
                                <p className="text-text">{sale.observacoes}</p>
                            </div>
                        </div>
                    )}

                    {/* Ações */}
                    <div className="mt-6 flex justify-end space-x-4">
                        {sale.status === 'finalizada' && (
                            <button className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                                Cancelar Venda
                            </button>
                        )}
                        <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                            Imprimir Comprovante
                        </button>
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SaleDetailsModal 
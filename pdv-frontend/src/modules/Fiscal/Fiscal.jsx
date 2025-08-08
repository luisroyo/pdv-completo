import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'
import { fiscalService } from '../../services/api'

/**
 * Módulo Fiscal - Gestão de Documentos Fiscais
 * Permite emissão e gestão de NFC-e e SAT
 */
const Fiscal = () => {
    const [loading, setLoading] = useState(false)
    const [satStatus, setSatStatus] = useState(null)
    const [selectedVenda, setSelectedVenda] = useState(null)
    const [showEmitirModal, setShowEmitirModal] = useState(false)
    const [showCancelarModal, setShowCancelarModal] = useState(false)
    const [showDocumentosModal, setShowDocumentosModal] = useState(false)
    const [documentos, setDocumentos] = useState(null)
    const [relatorio, setRelatorio] = useState(null)
    
    const { user } = useAuthStore()

    useEffect(() => {
        verificarStatusSAT()
        carregarRelatorioFiscal()
    }, [])

    const verificarStatusSAT = async () => {
        try {
            const response = await fiscalService.verificarStatusSAT()
            setSatStatus(response.data)
        } catch (error) {
            console.error('Erro ao verificar status do SAT:', error)
        }
    }

    const carregarRelatorioFiscal = async () => {
        try {
            const response = await fiscalService.relatorioFiscal()
            setRelatorio(response.data)
        } catch (error) {
            console.error('Erro ao carregar relatório fiscal:', error)
        }
    }

    const handleEmitirNFCe = async (vendaId) => {
        setLoading(true)
        try {
            const response = await fiscalService.emitirNFCe({ vendaId })
            if (response.data.sucesso) {
                alert('NFC-e emitida com sucesso!')
                carregarRelatorioFiscal()
            }
        } catch (error) {
            console.error('Erro ao emitir NFC-e:', error)
            alert('Erro ao emitir NFC-e: ' + (error.response?.data?.error || error.message))
        } finally {
            setLoading(false)
            setShowEmitirModal(false)
        }
    }

    const handleEmitirSAT = async (vendaId) => {
        setLoading(true)
        try {
            const response = await fiscalService.emitirSAT({ vendaId })
            if (response.data.sucesso) {
                alert('CFe-SAT emitido com sucesso!')
                carregarRelatorioFiscal()
            }
        } catch (error) {
            console.error('Erro ao emitir CFe-SAT:', error)
            alert('Erro ao emitir CFe-SAT: ' + (error.response?.data?.error || error.message))
        } finally {
            setLoading(false)
            setShowEmitirModal(false)
        }
    }

    const handleCancelarDocumento = async (vendaId, justificativa, tipo) => {
        setLoading(true)
        try {
            let response
            if (tipo === 'nfce') {
                response = await fiscalService.cancelarNFCe({ vendaId, justificativa })
            } else {
                response = await fiscalService.cancelarSAT({ vendaId, justificativa })
            }
            
            if (response.data.sucesso) {
                alert('Documento cancelado com sucesso!')
                carregarRelatorioFiscal()
            }
        } catch (error) {
            console.error('Erro ao cancelar documento:', error)
            alert('Erro ao cancelar documento: ' + (error.response?.data?.error || error.message))
        } finally {
            setLoading(false)
            setShowCancelarModal(false)
        }
    }

    const handleConsultarDocumentos = async (vendaId) => {
        try {
            const response = await fiscalService.obterDocumentosFiscais(vendaId)
            setDocumentos(response.data)
            setShowDocumentosModal(true)
        } catch (error) {
            console.error('Erro ao consultar documentos:', error)
            alert('Erro ao consultar documentos: ' + (error.response?.data?.error || error.message))
        }
    }

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value)
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleString('pt-BR')
    }

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-surface border-b border-border p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-text">Gestão Fiscal</h1>
                        <p className="text-text-secondary">Emissão e gestão de documentos fiscais</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={verificarStatusSAT}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Verificar SAT
                        </button>
                        <button
                            onClick={carregarRelatorioFiscal}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                            Atualizar Relatório
                        </button>
                    </div>
                </div>
            </div>

            {/* Status do SAT */}
            {satStatus && (
                <div className="bg-surface border-b border-border p-4">
                    <div className="flex items-center space-x-4">
                        <div className={`w-4 h-4 rounded-full ${
                            satStatus.disponivel ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <div>
                            <h3 className="font-semibold text-text">Status do SAT</h3>
                            <p className="text-text-secondary">{satStatus.mensagem}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Conteúdo */}
            <div className="flex-1 p-6 overflow-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Relatório Fiscal */}
                    <div className="bg-surface border border-border rounded-lg p-6">
                        <h2 className="text-xl font-bold text-text mb-4">Relatório Fiscal</h2>
                        
                        {relatorio ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-background p-4 rounded-lg">
                                        <h3 className="font-semibold text-text">NFC-e</h3>
                                        <p className="text-2xl font-bold text-blue-600">{relatorio.resumo.vendasComNFCe}</p>
                                        <p className="text-sm text-text-secondary">Documentos emitidos</p>
                                        <p className="text-lg font-semibold text-text">
                                            {formatCurrency(relatorio.resumo.valorTotalNFCe)}
                                        </p>
                                    </div>
                                    <div className="bg-background p-4 rounded-lg">
                                        <h3 className="font-semibold text-text">SAT</h3>
                                        <p className="text-2xl font-bold text-green-600">{relatorio.resumo.vendasComSAT}</p>
                                        <p className="text-sm text-text-secondary">Documentos emitidos</p>
                                        <p className="text-lg font-semibold text-text">
                                            {formatCurrency(relatorio.resumo.valorTotalSAT)}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="bg-background p-4 rounded-lg">
                                    <h3 className="font-semibold text-text mb-2">Período</h3>
                                    <p className="text-text-secondary">
                                        {relatorio.periodo.inicio} a {relatorio.periodo.fim}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                                <p className="text-text-secondary mt-2">Carregando relatório...</p>
                            </div>
                        )}
                    </div>

                    {/* Ações Fiscais */}
                    <div className="bg-surface border border-border rounded-lg p-6">
                        <h2 className="text-xl font-bold text-text mb-4">Ações Fiscais</h2>
                        
                        <div className="space-y-4">
                            <div className="bg-background p-4 rounded-lg">
                                <h3 className="font-semibold text-text mb-2">Emissão de Documentos</h3>
                                <p className="text-sm text-text-secondary mb-3">
                                    Emita NFC-e ou CFe-SAT para vendas finalizadas
                                </p>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setShowEmitirModal(true)}
                                        className="flex-1 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                                    >
                                        Emitir NFC-e
                                    </button>
                                    <button
                                        onClick={() => setShowEmitirModal(true)}
                                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                    >
                                        Emitir SAT
                                    </button>
                                </div>
                            </div>

                            <div className="bg-background p-4 rounded-lg">
                                <h3 className="font-semibold text-text mb-2">Cancelamento</h3>
                                <p className="text-sm text-text-secondary mb-3">
                                    Cancele documentos fiscais quando necessário
                                </p>
                                <button
                                    onClick={() => setShowCancelarModal(true)}
                                    className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                >
                                    Cancelar Documento
                                </button>
                            </div>

                            <div className="bg-background p-4 rounded-lg">
                                <h3 className="font-semibold text-text mb-2">Consulta</h3>
                                <p className="text-sm text-text-secondary mb-3">
                                    Consulte documentos fiscais por venda
                                </p>
                                <button
                                    onClick={() => setShowDocumentosModal(true)}
                                    className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                >
                                    Consultar Documentos
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detalhamento */}
                {relatorio && (
                    <div className="mt-6 bg-surface border border-border rounded-lg p-6">
                        <h2 className="text-xl font-bold text-text mb-4">Detalhamento</h2>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* NFC-e */}
                            <div>
                                <h3 className="font-semibold text-text mb-3">NFC-e Emitidas</h3>
                                <div className="space-y-2 max-h-64 overflow-auto">
                                    {relatorio.detalhamento.nfce.map((doc, index) => (
                                        <div key={index} className="bg-background p-3 rounded-lg">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium text-text">Venda #{doc.numeroVenda}</p>
                                                    <p className="text-sm text-text-secondary">NFC-e: {doc.numeroNFCe}</p>
                                                    <p className="text-xs text-text-secondary">
                                                        {formatDate(doc.dataEmissao)}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-text">{formatCurrency(doc.valor)}</p>
                                                    <p className="text-xs text-text-secondary">{doc.chaveAcesso}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* SAT */}
                            <div>
                                <h3 className="font-semibold text-text mb-3">CFe-SAT Emitidos</h3>
                                <div className="space-y-2 max-h-64 overflow-auto">
                                    {relatorio.detalhamento.sat.map((doc, index) => (
                                        <div key={index} className="bg-background p-3 rounded-lg">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium text-text">Venda #{doc.numeroVenda}</p>
                                                    <p className="text-sm text-text-secondary">CFe: {doc.numeroCFe}</p>
                                                    <p className="text-xs text-text-secondary">
                                                        {formatDate(doc.dataEmissao)}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-text">{formatCurrency(doc.valor)}</p>
                                                    <p className="text-xs text-text-secondary">{doc.chaveAcesso}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de Emissão */}
            {showEmitirModal && (
                <EmitirDocumentoModal
                    onClose={() => setShowEmitirModal(false)}
                    onEmitirNFCe={handleEmitirNFCe}
                    onEmitirSAT={handleEmitirSAT}
                    loading={loading}
                />
            )}

            {/* Modal de Cancelamento */}
            {showCancelarModal && (
                <CancelarDocumentoModal
                    onClose={() => setShowCancelarModal(false)}
                    onCancelar={handleCancelarDocumento}
                    loading={loading}
                />
            )}

            {/* Modal de Documentos */}
            {showDocumentosModal && documentos && (
                <DocumentosFiscaisModal
                    documentos={documentos}
                    onClose={() => setShowDocumentosModal(false)}
                />
            )}
        </div>
    )
}

// Modal de Emissão
const EmitirDocumentoModal = ({ onClose, onEmitirNFCe, onEmitirSAT, loading }) => {
    const [vendaId, setVendaId] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!vendaId.trim()) {
            alert('Por favor, informe o ID da venda')
            return
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-surface rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="bg-primary text-white p-6 rounded-t-lg">
                    <h2 className="text-xl font-bold">Emitir Documento Fiscal</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-text mb-2">
                            ID da Venda *
                        </label>
                        <input
                            type="text"
                            required
                            value={vendaId}
                            onChange={(e) => setVendaId(e.target.value)}
                            placeholder="Digite o ID da venda"
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                        />
                    </div>

                    <div className="flex space-x-4">
                        <button
                            type="button"
                            onClick={() => onEmitirNFCe(vendaId)}
                            disabled={loading || !vendaId.trim()}
                            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Emitindo...' : 'Emitir NFC-e'}
                        </button>
                        <button
                            type="button"
                            onClick={() => onEmitirSAT(vendaId)}
                            disabled={loading || !vendaId.trim()}
                            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Emitindo...' : 'Emitir SAT'}
                        </button>
                    </div>

                    <div className="mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// Modal de Cancelamento
const CancelarDocumentoModal = ({ onClose, onCancelar, loading }) => {
    const [vendaId, setVendaId] = useState('')
    const [justificativa, setJustificativa] = useState('')
    const [tipo, setTipo] = useState('nfce')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!vendaId.trim() || !justificativa.trim()) {
            alert('Por favor, preencha todos os campos')
            return
        }
        onCancelar(vendaId, justificativa, tipo)
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-surface rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="bg-red-500 text-white p-6 rounded-t-lg">
                    <h2 className="text-xl font-bold">Cancelar Documento Fiscal</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-text mb-2">
                            ID da Venda *
                        </label>
                        <input
                            type="text"
                            required
                            value={vendaId}
                            onChange={(e) => setVendaId(e.target.value)}
                            placeholder="Digite o ID da venda"
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-text mb-2">
                            Tipo de Documento
                        </label>
                        <select
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                        >
                            <option value="nfce">NFC-e</option>
                            <option value="sat">CFe-SAT</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-text mb-2">
                            Justificativa *
                        </label>
                        <textarea
                            required
                            value={justificativa}
                            onChange={(e) => setJustificativa(e.target.value)}
                            placeholder="Digite a justificativa do cancelamento"
                            rows="3"
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                        />
                    </div>

                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            disabled={loading || !vendaId.trim() || !justificativa.trim()}
                            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Cancelando...' : 'Cancelar Documento'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
                        >
                            Fechar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// Modal de Documentos Fiscais
const DocumentosFiscaisModal = ({ documentos, onClose }) => {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value)
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleString('pt-BR')
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-surface rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
                <div className="bg-primary text-white p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">Documentos Fiscais</h2>
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

                <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Informações da Venda */}
                        <div className="bg-background p-4 rounded-lg">
                            <h3 className="font-semibold text-text mb-3">Informações da Venda</h3>
                            <div className="space-y-2">
                                <p><strong>ID:</strong> {documentos.venda.id}</p>
                                <p><strong>Número:</strong> {documentos.venda.numeroVenda}</p>
                                <p><strong>Data:</strong> {formatDate(documentos.venda.dataVenda)}</p>
                                <p><strong>Total:</strong> {formatCurrency(documentos.venda.total)}</p>
                            </div>
                        </div>

                        {/* NFC-e */}
                        <div className="bg-background p-4 rounded-lg">
                            <h3 className="font-semibold text-text mb-3">NFC-e</h3>
                            <div className="space-y-2">
                                <p><strong>Status:</strong> {documentos.nfce.status || 'Não emitida'}</p>
                                <p><strong>Número:</strong> {documentos.nfce.numero || 'N/A'}</p>
                                <p><strong>Chave:</strong> {documentos.nfce.chaveAcesso || 'N/A'}</p>
                                <p><strong>Protocolo:</strong> {documentos.nfce.protocolo || 'N/A'}</p>
                                <p><strong>Emissão:</strong> {formatDate(documentos.nfce.dataEmissao)}</p>
                            </div>
                        </div>

                        {/* SAT */}
                        <div className="bg-background p-4 rounded-lg">
                            <h3 className="font-semibold text-text mb-3">CFe-SAT</h3>
                            <div className="space-y-2">
                                <p><strong>Status:</strong> {documentos.sat.status || 'Não emitido'}</p>
                                <p><strong>Número:</strong> {documentos.sat.numero || 'N/A'}</p>
                                <p><strong>Chave:</strong> {documentos.sat.chaveAcesso || 'N/A'}</p>
                                <p><strong>Protocolo:</strong> {documentos.sat.protocolo || 'N/A'}</p>
                                <p><strong>Emissão:</strong> {formatDate(documentos.sat.dataEmissao)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={onClose}
                            className="w-full px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Fiscal 
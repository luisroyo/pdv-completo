import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'
import { customersService } from '../../services/api'

/**
 * Tela de Gestão de Clientes
 * Permite cadastrar, editar e gerenciar clientes do sistema
 */
const Customers = () => {
    const [customers, setCustomers] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [showActiveOnly, setShowActiveOnly] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingCustomer, setEditingCustomer] = useState(null)
    const [showHistoryModal, setShowHistoryModal] = useState(false)
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    
    const { user } = useAuthStore()

    useEffect(() => {
        loadCustomers()
    }, [])

    const loadCustomers = async () => {
        setLoading(true)
        try {
            const response = await customersService.list({ 
                busca: searchTerm, 
                ativo: showActiveOnly ? true : undefined 
            })
            setCustomers(response.data || [])
        } catch (error) {
            console.error('Erro ao carregar clientes:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = () => {
        loadCustomers()
    }

    const handleCreateCustomer = () => {
        setEditingCustomer(null)
        setShowModal(true)
    }

    const handleEditCustomer = (customer) => {
        setEditingCustomer(customer)
        setShowModal(true)
    }

    const handleDeleteCustomer = async (id) => {
        if (!confirm('Tem certeza que deseja excluir este cliente?')) return

        try {
            await customersService.delete(id)
            loadCustomers()
        } catch (error) {
            console.error('Erro ao excluir cliente:', error)
        }
    }

    const handleViewHistory = async (customer) => {
        setSelectedCustomer(customer)
        setShowHistoryModal(true)
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleDateString('pt-BR')
    }

    const formatCPF = (cpf) => {
        if (!cpf) return 'N/A'
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }

    const getAge = (birthDate) => {
        if (!birthDate) return null
        const today = new Date()
        const birth = new Date(birthDate)
        let age = today.getFullYear() - birth.getFullYear()
        const monthDiff = today.getMonth() - birth.getMonth()
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--
        }
        
        return age
    }

    const isBirthdayThisMonth = (birthDate) => {
        if (!birthDate) return false
        const today = new Date()
        const birth = new Date(birthDate)
        return today.getMonth() === birth.getMonth()
    }

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-surface border-b border-border p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-text">Gestão de Clientes</h1>
                        <p className="text-text-secondary">Cadastre e gerencie os clientes do sistema</p>
                    </div>
                    <button
                        onClick={handleCreateCustomer}
                        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Novo Cliente</span>
                    </button>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-surface border-b border-border p-4">
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-64">
                        <input
                            type="text"
                            placeholder="Buscar clientes por nome, CPF ou email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-text"
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={showActiveOnly}
                                onChange={(e) => setShowActiveOnly(e.target.checked)}
                                className="mr-2"
                            />
                            <span className="text-text">Apenas ativos</span>
                        </label>
                        <button
                            onClick={handleSearch}
                            className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
                        >
                            Buscar
                        </button>
                    </div>
                </div>
            </div>

            {/* Conteúdo */}
            <div className="flex-1 p-6 overflow-auto">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : customers.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 mx-auto text-text-secondary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className="text-text-secondary text-lg">Nenhum cliente encontrado</p>
                        <p className="text-text-secondary">Clique em "Novo Cliente" para começar</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {customers.map((customer) => (
                            <div key={customer.id} className="bg-surface border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                                {/* Header do card */}
                                <div className="p-4 border-b border-border">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                                                {isBirthdayThisMonth(customer.dataNascimento) ? (
                                                    <span className="text-2xl">🎂</span>
                                                ) : (
                                                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-text text-lg truncate">{customer.nome}</h3>
                                                <p className="text-sm text-text-secondary">{formatCPF(customer.cpf)}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            customer.ativo 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {customer.ativo ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </div>
                                </div>

                                {/* Informações do cliente */}
                                <div className="p-4 space-y-3">
                                    <div className="space-y-2 text-sm">
                                        {customer.dataNascimento && (
                                            <div className="flex justify-between">
                                                <span className="text-text-secondary">Nascimento:</span>
                                                <span className="text-text">
                                                    {formatDate(customer.dataNascimento)}
                                                    {getAge(customer.dataNascimento) && (
                                                        <span className="text-text-secondary ml-1">({getAge(customer.dataNascimento)} anos)</span>
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                        
                                        {customer.email && (
                                            <div className="flex justify-between">
                                                <span className="text-text-secondary">Email:</span>
                                                <span className="text-text truncate">{customer.email}</span>
                                            </div>
                                        )}
                                        
                                        {customer.telefone && (
                                            <div className="flex justify-between">
                                                <span className="text-text-secondary">Telefone:</span>
                                                <span className="text-text">{customer.telefone}</span>
                                            </div>
                                        )}
                                        
                                        {customer.celular && (
                                            <div className="flex justify-between">
                                                <span className="text-text-secondary">Celular:</span>
                                                <span className="text-text">{customer.celular}</span>
                                            </div>
                                        )}
                                        
                                        {customer.cidade && customer.estado && (
                                            <div className="flex justify-between">
                                                <span className="text-text-secondary">Cidade:</span>
                                                <span className="text-text">{customer.cidade}/{customer.estado}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Ações */}
                                    <div className="flex space-x-2 pt-3 border-t border-border">
                                        <button
                                            onClick={() => handleViewHistory(customer)}
                                            className="flex-1 px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                                        >
                                            Histórico
                                        </button>
                                        <button
                                            onClick={() => handleEditCustomer(customer)}
                                            className="flex-1 px-3 py-2 bg-primary text-white rounded text-sm hover:bg-primary/90 transition-colors"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCustomer(customer.id)}
                                            className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal de cliente */}
            {showModal && (
                <CustomerModal
                    customer={editingCustomer}
                    onClose={() => setShowModal(false)}
                    onSave={() => {
                        setShowModal(false)
                        loadCustomers()
                    }}
                />
            )}

            {/* Modal de histórico */}
            {showHistoryModal && selectedCustomer && (
                <CustomerHistoryModal
                    customer={selectedCustomer}
                    onClose={() => setShowHistoryModal(false)}
                />
            )}
        </div>
    )
}

// Modal de cliente
const CustomerModal = ({ customer, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        nome: customer?.nome || '',
        cpf: customer?.cpf || '',
        rg: customer?.rg || '',
        dataNascimento: customer?.dataNascimento ? customer.dataNascimento.split('T')[0] : '',
        email: customer?.email || '',
        telefone: customer?.telefone || '',
        celular: customer?.celular || '',
        cep: customer?.cep || '',
        endereco: customer?.endereco || '',
        numero: customer?.numero || '',
        complemento: customer?.complemento || '',
        bairro: customer?.bairro || '',
        cidade: customer?.cidade || '',
        estado: customer?.estado || '',
        observacoes: customer?.observacoes || '',
        ativo: customer?.ativo ?? true
    })

    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (customer) {
                await customersService.update(customer.id, formData)
            } else {
                await customersService.create(formData)
            }
            onSave()
        } catch (error) {
            console.error('Erro ao salvar cliente:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-surface rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-primary text-white p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">
                            {customer ? 'Editar Cliente' : 'Novo Cliente'}
                        </h2>
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

                {/* Formulário */}
                <form onSubmit={handleSubmit} className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Informações pessoais */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-text">Informações Pessoais</h3>
                            
                            <div>
                                <label className="block text-sm font-medium text-text mb-2">Nome Completo *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.nome}
                                    onChange={(e) => handleInputChange('nome', e.target.value)}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text mb-2">CPF *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.cpf}
                                        onChange={(e) => handleInputChange('cpf', e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                        placeholder="000.000.000-00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text mb-2">RG</label>
                                    <input
                                        type="text"
                                        value={formData.rg}
                                        onChange={(e) => handleInputChange('rg', e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text mb-2">Data de Nascimento</label>
                                <input
                                    type="date"
                                    value={formData.dataNascimento}
                                    onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                />
                            </div>
                        </div>

                        {/* Contato */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-text">Contato</h3>
                            
                            <div>
                                <label className="block text-sm font-medium text-text mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text mb-2">Telefone</label>
                                    <input
                                        type="text"
                                        value={formData.telefone}
                                        onChange={(e) => handleInputChange('telefone', e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text mb-2">Celular</label>
                                    <input
                                        type="text"
                                        value={formData.celular}
                                        onChange={(e) => handleInputChange('celular', e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Endereço */}
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-text mb-4">Endereço</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-text mb-2">CEP</label>
                                <input
                                    type="text"
                                    value={formData.cep}
                                    onChange={(e) => handleInputChange('cep', e.target.value)}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text mb-2">Endereço</label>
                                <input
                                    type="text"
                                    value={formData.endereco}
                                    onChange={(e) => handleInputChange('endereco', e.target.value)}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text mb-2">Número</label>
                                <input
                                    type="text"
                                    value={formData.numero}
                                    onChange={(e) => handleInputChange('numero', e.target.value)}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text mb-2">Complemento</label>
                                <input
                                    type="text"
                                    value={formData.complemento}
                                    onChange={(e) => handleInputChange('complemento', e.target.value)}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text mb-2">Bairro</label>
                                <input
                                    type="text"
                                    value={formData.bairro}
                                    onChange={(e) => handleInputChange('bairro', e.target.value)}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text mb-2">Cidade</label>
                                <input
                                    type="text"
                                    value={formData.cidade}
                                    onChange={(e) => handleInputChange('cidade', e.target.value)}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text mb-2">Estado</label>
                                <select
                                    value={formData.estado}
                                    onChange={(e) => handleInputChange('estado', e.target.value)}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                >
                                    <option value="">Selecione...</option>
                                    <option value="AC">Acre</option>
                                    <option value="AL">Alagoas</option>
                                    <option value="AP">Amapá</option>
                                    <option value="AM">Amazonas</option>
                                    <option value="BA">Bahia</option>
                                    <option value="CE">Ceará</option>
                                    <option value="DF">Distrito Federal</option>
                                    <option value="ES">Espírito Santo</option>
                                    <option value="GO">Goiás</option>
                                    <option value="MA">Maranhão</option>
                                    <option value="MT">Mato Grosso</option>
                                    <option value="MS">Mato Grosso do Sul</option>
                                    <option value="MG">Minas Gerais</option>
                                    <option value="PA">Pará</option>
                                    <option value="PB">Paraíba</option>
                                    <option value="PR">Paraná</option>
                                    <option value="PE">Pernambuco</option>
                                    <option value="PI">Piauí</option>
                                    <option value="RJ">Rio de Janeiro</option>
                                    <option value="RN">Rio Grande do Norte</option>
                                    <option value="RS">Rio Grande do Sul</option>
                                    <option value="RO">Rondônia</option>
                                    <option value="RR">Roraima</option>
                                    <option value="SC">Santa Catarina</option>
                                    <option value="SP">São Paulo</option>
                                    <option value="SE">Sergipe</option>
                                    <option value="TO">Tocantins</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Observações */}
                    <div className="mt-6">
                        <label className="block text-sm font-medium text-text mb-2">Observações</label>
                        <textarea
                            value={formData.observacoes}
                            onChange={(e) => handleInputChange('observacoes', e.target.value)}
                            rows="3"
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                        />
                    </div>

                    {/* Status */}
                    <div className="mt-6">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.ativo}
                                onChange={(e) => handleInputChange('ativo', e.target.checked)}
                                className="mr-2"
                            />
                            <span className="text-text">Cliente ativo</span>
                        </label>
                    </div>

                    {/* Ações */}
                    <div className="mt-6 flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Salvando...' : 'Salvar Cliente'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// Modal de histórico
const CustomerHistoryModal = ({ customer, onClose }) => {
    const [sales, setSales] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadCustomerHistory()
    }, [customer.id])

    const loadCustomerHistory = async () => {
        try {
            const response = await customersService.historicoCompras(customer.id)
            setSales(response.data || [])
        } catch (error) {
            console.error('Erro ao carregar histórico:', error)
        } finally {
            setLoading(false)
        }
    }

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-surface rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-primary text-white p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Histórico de Compras</h2>
                            <p className="text-primary-100">{customer.nome}</p>
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
                    {loading ? (
                        <div className="flex items-center justify-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : sales.length === 0 ? (
                        <div className="text-center py-8">
                            <svg className="w-16 h-16 mx-auto text-text-secondary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className="text-text-secondary">Nenhuma compra encontrada</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {sales.map((sale) => (
                                <div key={sale.id} className="bg-background border border-border rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-text">Venda #{sale.id}</h3>
                                            <p className="text-sm text-text-secondary">{formatDate(sale.dataVenda)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-text text-lg">{formatCurrency(sale.total)}</p>
                                            <p className="text-sm text-text-secondary">{sale.itens?.length || 0} itens</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Customers 
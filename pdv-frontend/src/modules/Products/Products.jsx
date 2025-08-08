import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'
import { productsService } from '../../services/api'

/**
 * Tela de Gestão de Produtos
 * Permite cadastrar, editar e gerenciar produtos do sistema
 */
const Products = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [categories] = useState([
        { id: 1, name: 'Alimentos' },
        { id: 2, name: 'Bebidas' },
        { id: 3, name: 'Higiene' },
        { id: 4, name: 'Limpeza' },
        { id: 5, name: 'Outros' }
    ])

    const { user } = useAuthStore()

    useEffect(() => {
        loadProducts()
    }, [])

    const loadProducts = async () => {
        setLoading(true)
        try {
            const response = await productsService.list({ busca: searchTerm, categoriaId: selectedCategory })
            setProducts(response.data || [])
        } catch (error) {
            console.error('Erro ao carregar produtos:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = () => {
        loadProducts()
    }

    const handleCreateProduct = () => {
        setEditingProduct(null)
        setShowModal(true)
    }

    const handleEditProduct = (product) => {
        setEditingProduct(product)
        setShowModal(true)
    }

    const handleDeleteProduct = async (id) => {
        if (!confirm('Tem certeza que deseja excluir este produto?')) return

        try {
            await productsService.delete(id)
            loadProducts()
        } catch (error) {
            console.error('Erro ao excluir produto:', error)
        }
    }

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value)
    }

    const getStockStatus = (current, minimum) => {
        if (current <= 0) return { color: 'text-red-500', text: 'Sem estoque' }
        if (current <= minimum) return { color: 'text-yellow-500', text: 'Estoque baixo' }
        return { color: 'text-green-500', text: 'Em estoque' }
    }

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-surface border-b border-border p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-text">Gestão de Produtos</h1>
                        <p className="text-text-secondary">Cadastre e gerencie os produtos do sistema</p>
                    </div>
                    <button
                        onClick={handleCreateProduct}
                        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Novo Produto</span>
                    </button>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-surface border-b border-border p-4">
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-64">
                        <input
                            type="text"
                            placeholder="Buscar produtos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-text"
                        />
                    </div>
                    <div className="w-48">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-text"
                        >
                            <option value="">Todas as categorias</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={handleSearch}
                        className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
                    >
                        Buscar
                    </button>
                </div>
            </div>

            {/* Conteúdo */}
            <div className="flex-1 p-6 overflow-auto">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 mx-auto text-text-secondary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <p className="text-text-secondary text-lg">Nenhum produto encontrado</p>
                        <p className="text-text-secondary">Clique em "Novo Produto" para começar</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div key={product.id} className="bg-surface border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                                {/* Imagem do produto */}
                                <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                                    <svg className="w-16 h-16 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>

                                {/* Informações do produto */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-text text-lg mb-2 truncate">{product.nome}</h3>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-text-secondary">Código:</span>
                                            <span className="text-text font-mono">{product.codigoBarras}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-text-secondary">Preço:</span>
                                            <span className="text-text font-semibold">{formatCurrency(product.precoVenda)}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-text-secondary">Estoque:</span>
                                            <span className={`font-medium ${getStockStatus(product.estoqueAtual, product.estoqueMinimo).color}`}>
                                                {product.estoqueAtual} {product.unidadeMedida}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-text-secondary">Status:</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.ativo
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {product.ativo ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Ações */}
                                    <div className="flex space-x-2 mt-4 pt-4 border-t border-border">
                                        <button
                                            onClick={() => handleEditProduct(product)}
                                            className="flex-1 px-3 py-2 bg-primary text-white rounded text-sm hover:bg-primary/90 transition-colors"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(product.id)}
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

            {/* Modal de produto */}
            {showModal && (
                <ProductModal
                    product={editingProduct}
                    categories={categories}
                    onClose={() => setShowModal(false)}
                    onSave={() => {
                        setShowModal(false)
                        loadProducts()
                    }}
                />
            )}
        </div>
    )
}

// Modal de produto
const ProductModal = ({ product, categories, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        nome: product?.nome || '',
        descricao: product?.descricao || '',
        codigoBarras: product?.codigoBarras || '',
        precoVenda: product?.precoVenda || 0,
        precoCusto: product?.precoCusto || 0,
        estoqueAtual: product?.estoqueAtual || 0,
        estoqueMinimo: product?.estoqueMinimo || 0,
        categoriaId: product?.categoriaId || '',
        unidadeMedida: product?.unidadeMedida || 'UN',
        ncm: product?.ncm || '',
        cfop: product?.cfop || '',
        cst: product?.cst || '',
        aliquotaICMS: product?.aliquotaICMS || 0,
        ativo: product?.ativo ?? true
    })

    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (product) {
                await productsService.update(product.id, formData)
            } else {
                await productsService.create(formData)
            }
            onSave()
        } catch (error) {
            console.error('Erro ao salvar produto:', error)
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
            <div className="bg-surface rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-primary text-white p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">
                            {product ? 'Editar Produto' : 'Novo Produto'}
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
                        {/* Informações básicas */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-text">Informações Básicas</h3>

                            <div>
                                <label className="block text-sm font-medium text-text mb-2">Nome do Produto *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.nome}
                                    onChange={(e) => handleInputChange('nome', e.target.value)}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text mb-2">Descrição</label>
                                <textarea
                                    value={formData.descricao}
                                    onChange={(e) => handleInputChange('descricao', e.target.value)}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text mb-2">Código de Barras *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.codigoBarras}
                                    onChange={(e) => handleInputChange('codigoBarras', e.target.value)}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text mb-2">Categoria</label>
                                <select
                                    value={formData.categoriaId}
                                    onChange={(e) => handleInputChange('categoriaId', e.target.value)}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                >
                                    <option value="">Selecione uma categoria</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Preços e estoque */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-text">Preços e Estoque</h3>

                            <div>
                                <label className="block text-sm font-medium text-text mb-2">Preço de Venda *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={formData.precoVenda}
                                    onChange={(e) => handleInputChange('precoVenda', parseFloat(e.target.value) || 0)}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text mb-2">Preço de Custo</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.precoCusto}
                                    onChange={(e) => handleInputChange('precoCusto', parseFloat(e.target.value) || 0)}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text mb-2">Estoque Atual</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.estoqueAtual}
                                    onChange={(e) => handleInputChange('estoqueAtual', parseFloat(e.target.value) || 0)}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text mb-2">Estoque Mínimo</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.estoqueMinimo}
                                    onChange={(e) => handleInputChange('estoqueMinimo', parseFloat(e.target.value) || 0)}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text mb-2">Unidade de Medida</label>
                                <select
                                    value={formData.unidadeMedida}
                                    onChange={(e) => handleInputChange('unidadeMedida', e.target.value)}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                >
                                    <option value="UN">Unidade (UN)</option>
                                    <option value="KG">Quilograma (KG)</option>
                                    <option value="L">Litro (L)</option>
                                    <option value="M">Metro (M)</option>
                                    <option value="CX">Caixa (CX)</option>
                                    <option value="PCT">Pacote (PCT)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Informações fiscais */}
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-text mb-4">Informações Fiscais</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-text mb-2">NCM</label>
                                <input
                                    type="text"
                                    value={formData.ncm}
                                    onChange={(e) => handleInputChange('ncm', e.target.value)}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text mb-2">CFOP</label>
                                <input
                                    type="text"
                                    value={formData.cfop}
                                    onChange={(e) => handleInputChange('cfop', e.target.value)}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text mb-2">CST</label>
                                <input
                                    type="text"
                                    value={formData.cst}
                                    onChange={(e) => handleInputChange('cst', e.target.value)}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text mb-2">Alíquota ICMS (%)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.aliquotaICMS}
                                    onChange={(e) => handleInputChange('aliquotaICMS', parseFloat(e.target.value) || 0)}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                />
                            </div>
                        </div>
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
                            <span className="text-text">Produto ativo</span>
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
                            {loading ? 'Salvando...' : 'Salvar Produto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Products 
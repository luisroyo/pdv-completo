import React, { useState, useEffect } from 'react'
import { productsService } from '../../../services/api'

/**
 * Componente de Busca de Produtos
 * Permite buscar produtos por código de barras, nome ou descrição
 */
const ProductSearch = ({ onProductSelect }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Busca produtos quando o termo de busca muda
  useEffect(() => {
    const searchProducts = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([])
        return
      }

      setIsLoading(true)
      setError('')

      try {
        // Simula busca de produtos (substitua pela chamada real da API)
        const mockProducts = [
          {
            id: '1',
            codigo: '123456',
            nome: 'Produto Teste 1',
            descricao: 'Descrição do produto teste 1',
            preco: 10.50,
            estoque: 100,
            categoria: 'Geral'
          },
          {
            id: '2',
            codigo: '789012',
            nome: 'Produto Teste 2',
            descricao: 'Descrição do produto teste 2',
            preco: 25.90,
            estoque: 50,
            categoria: 'Geral'
          }
        ]

        // Filtra produtos baseado no termo de busca
        const filtered = mockProducts.filter(product =>
          product.codigo.includes(searchTerm) ||
          product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.descricao.toLowerCase().includes(searchTerm.toLowerCase())
        )

        setSearchResults(filtered)
      } catch (err) {
        setError('Erro ao buscar produtos')
        console.error('Erro na busca:', err)
      } finally {
        setIsLoading(false)
      }
    }

    // Debounce para evitar muitas requisições
    const timeoutId = setTimeout(searchProducts, 300)
    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  // Busca por código de barras (Enter)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      e.preventDefault()
      
      // Se há apenas um resultado, seleciona automaticamente
      if (searchResults.length === 1) {
        handleProductSelect(searchResults[0])
      }
    }
  }

  // Seleciona um produto
  const handleProductSelect = (product) => {
    onProductSelect(product)
    setSearchTerm('')
    setSearchResults([])
  }

  // Busca por código de barras
  const handleBarcodeSearch = async (barcode) => {
    if (!barcode.trim()) return

    setIsLoading(true)
    setError('')

    try {
      // Aqui você faria a chamada real para a API
      const product = await productsService.getByBarcode(barcode)
      if (product) {
        handleProductSelect(product)
      } else {
        setError('Produto não encontrado')
      }
    } catch (err) {
      setError('Erro ao buscar produto')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Campo de busca */}
      <div className="relative">
        <input
          id="product-search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          className="input w-full pr-10"
          placeholder="Digite código, nome ou descrição do produto..."
          autoFocus
        />
        
        {/* Ícone de busca */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          ) : (
            <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-3">
          <p className="text-error text-sm">{error}</p>
        </div>
      )}

      {/* Resultados da busca */}
      {searchResults.length > 0 && (
        <div className="bg-surface border border-border rounded-lg max-h-64 overflow-auto">
          {searchResults.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductSelect(product)}
              className="p-4 border-b border-border last:border-b-0 cursor-pointer hover:bg-accent transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-text">{product.nome}</h4>
                  <p className="text-sm text-text-secondary">{product.descricao}</p>
                  <p className="text-xs text-text-secondary">Código: {product.codigo}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">
                    R$ {product.preco.toFixed(2)}
                  </div>
                  <div className="text-xs text-text-secondary">
                    Estoque: {product.estoque}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dicas de uso */}
      <div className="text-xs text-text-secondary">
        <p>• Digite o código de barras e pressione Enter</p>
        <p>• Use o nome ou descrição para buscar produtos</p>
        <p>• Pressione Enter para selecionar o primeiro resultado</p>
      </div>
    </div>
  )
}

export default ProductSearch 
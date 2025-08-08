import React, { useState, useEffect } from 'react'
import ProductSearch from './components/ProductSearch'
import Cart from './components/Cart'
import PaymentModal from './components/PaymentModal'
import { useSalesStore } from '../../store/salesStore'

/**
 * Tela Principal de Vendas
 * Interface principal para realização de vendas no PDV
 */
const Sales = () => {
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
    const { cart, total, clearCart, addToCart, removeFromCart, updateQuantity } = useSalesStore()

    // Atalhos de teclado
    useEffect(() => {
        const handleKeyPress = (e) => {
            // F2 - Abrir busca de produtos
            if (e.key === 'F2') {
                e.preventDefault()
                document.getElementById('product-search')?.focus()
            }

            // F4 - Finalizar venda
            if (e.key === 'F4' && cart.length > 0) {
                e.preventDefault()
                setIsPaymentModalOpen(true)
            }

            // F6 - Cancelar venda
            if (e.key === 'F6') {
                e.preventDefault()
                if (confirm('Deseja cancelar esta venda?')) {
                    clearCart()
                }
            }

            // F8 - Abrir caixa
            if (e.key === 'F8') {
                e.preventDefault()
                // Implementar abertura de caixa
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [cart, clearCart])

    return (
        <div className="h-full flex flex-col">
            {/* Header da tela de vendas */}
            <div className="bg-surface border-b border-border p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-text">Nova Venda</h1>
                        <p className="text-text-secondary">Realize vendas de forma rápida e eficiente</p>
                    </div>

                    {/* Atalhos de teclado */}
                    <div className="flex items-center space-x-4 text-sm text-text-secondary">
                        <div className="flex items-center space-x-1">
                            <kbd className="px-2 py-1 bg-accent rounded text-xs">F2</kbd>
                            <span>Buscar Produto</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <kbd className="px-2 py-1 bg-accent rounded text-xs">F4</kbd>
                            <span>Finalizar</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <kbd className="px-2 py-1 bg-accent rounded text-xs">F6</kbd>
                            <span>Cancelar</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <kbd className="px-2 py-1 bg-accent rounded text-xs">F8</kbd>
                            <span>Abrir Caixa</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Conteúdo principal */}
            <div className="flex-1 flex overflow-hidden">
                {/* Área de busca e produtos */}
                <div className="w-1/2 flex flex-col border-r border-border">
                    {/* Busca de produtos */}
                    <div className="p-4 border-b border-border">
                        <ProductSearch onProductSelect={addToCart} />
                    </div>

                    {/* Lista de produtos recentes */}
                    <div className="flex-1 p-4 overflow-auto">
                        <h3 className="text-lg font-semibold text-text mb-4">Produtos Recentes</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Produtos recentes serão carregados aqui */}
                            <div className="bg-surface border border-border rounded-lg p-4 cursor-pointer hover:bg-accent transition-colors">
                                <div className="text-sm font-medium text-text">Produto Exemplo</div>
                                <div className="text-lg font-bold text-primary">R$ 10,00</div>
                                <div className="text-xs text-text-secondary">Código: 123456</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Carrinho de compras */}
                <div className="w-1/2 flex flex-col">
                    <Cart
                        items={cart}
                        total={total}
                        onRemoveItem={removeFromCart}
                        onUpdateQuantity={updateQuantity}
                        onClearCart={clearCart}
                        onFinishSale={() => setIsPaymentModalOpen(true)}
                    />
                </div>
            </div>

            {/* Modal de pagamento */}
            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                total={total}
                items={cart}
                onFinishSale={(paymentData) => {
                    // Implementar finalização da venda
                    console.log('Finalizando venda:', paymentData)
                    clearCart()
                    setIsPaymentModalOpen(false)
                }}
            />
        </div>
    )
}

export default Sales 
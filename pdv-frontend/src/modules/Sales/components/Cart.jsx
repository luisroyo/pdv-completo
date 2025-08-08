import React from 'react'

/**
 * Componente de Carrinho de Compras
 * Exibe itens da venda e permite gerenciar quantidades
 */
const Cart = ({ items, total, onRemoveItem, onUpdateQuantity, onClearCart, onFinishSale }) => {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value)
    }

    return (
        <div className="h-full flex flex-col">
            {/* Header do carrinho */}
            <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-text">Carrinho</h3>
                    <div className="text-sm text-text-secondary">
                        {items.length} {items.length === 1 ? 'item' : 'itens'}
                    </div>
                </div>
            </div>

            {/* Lista de itens */}
            <div className="flex-1 overflow-auto">
                {items.length === 0 ? (
                    <div className="p-8 text-center">
                        <svg
                            className="w-16 h-16 mx-auto text-text-secondary mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                        </svg>
                        <p className="text-text-secondary">Carrinho vazio</p>
                        <p className="text-sm text-text-secondary mt-1">
                            Adicione produtos para começar uma venda
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {items.map((item) => (
                            <div key={item.id} className="p-4">
                                <div className="flex items-start justify-between">
                                    {/* Informações do produto */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-text truncate">{item.nome}</h4>
                                        <p className="text-sm text-text-secondary truncate">{item.descricao}</p>
                                        <p className="text-xs text-text-secondary">Código: {item.codigo}</p>
                                    </div>

                                    {/* Controles de quantidade */}
                                    <div className="flex items-center space-x-2 ml-4">
                                        <button
                                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                            className="w-8 h-8 rounded-full bg-accent hover:bg-accent/80 flex items-center justify-center transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                            </svg>
                                        </button>

                                        <span className="w-12 text-center font-medium text-text">
                                            {item.quantity}
                                        </span>

                                        <button
                                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                            className="w-8 h-8 rounded-full bg-accent hover:bg-accent/80 flex items-center justify-center transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Preços */}
                                <div className="flex items-center justify-between mt-2">
                                    <div className="text-sm text-text-secondary">
                                        {formatCurrency(item.preco)} x {item.quantity}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-bold text-text">
                                            {formatCurrency(item.preco * item.quantity)}
                                        </span>
                                        <button
                                            onClick={() => onRemoveItem(item.id)}
                                            className="text-error hover:text-error/80 transition-colors"
                                            title="Remover item"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Resumo e ações */}
            {items.length > 0 && (
                <div className="border-t border-border p-4 space-y-4">
                    {/* Resumo dos valores */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-text-secondary">Subtotal:</span>
                            <span className="text-text">{formatCurrency(total)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-text-secondary">Desconto:</span>
                            <span className="text-success">R$ 0,00</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t border-border pt-2">
                            <span>Total:</span>
                            <span className="text-primary">{formatCurrency(total)}</span>
                        </div>
                    </div>

                    {/* Botões de ação */}
                    <div className="flex space-x-2">
                        <button
                            onClick={onClearCart}
                            className="btn btn-outline flex-1"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onFinishSale}
                            className="btn btn-primary flex-1"
                        >
                            Finalizar Venda
                        </button>
                    </div>

                    {/* Atalhos */}
                    <div className="text-xs text-text-secondary text-center">
                        <p>Pressione <kbd className="px-1 py-0.5 bg-surface border border-border rounded">F4</kbd> para finalizar</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Cart 
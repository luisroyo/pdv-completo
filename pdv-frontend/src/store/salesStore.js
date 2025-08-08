import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Store de Vendas
 * Gerencia carrinho de compras e operações de venda
 */
export const useSalesStore = create(
  persist(
    (set, get) => ({
      // Estado
      cart: [],
      currentSale: null,
      isLoading: false,
      error: null,

      // Ações
      /**
       * Adiciona produto ao carrinho
       * @param {Object} product - Produto a ser adicionado
       * @param {number} quantity - Quantidade (padrão: 1)
       */
      addToCart: (product, quantity = 1) => {
        const { cart } = get()
        const existingItem = cart.find(item => item.id === product.id)

        if (existingItem) {
          // Atualiza quantidade se produto já existe
          set({
            cart: cart.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          })
        } else {
          // Adiciona novo produto
          set({
            cart: [...cart, { ...product, quantity }]
          })
        }
      },

      /**
       * Remove item do carrinho
       * @param {string} productId - ID do produto
       */
      removeFromCart: (productId) => {
        const { cart } = get()
        set({
          cart: cart.filter(item => item.id !== productId)
        })
      },

      /**
       * Atualiza quantidade de um item
       * @param {string} productId - ID do produto
       * @param {number} quantity - Nova quantidade
       */
      updateQuantity: (productId, quantity) => {
        const { cart } = get()
        if (quantity <= 0) {
          get().removeFromCart(productId)
        } else {
          set({
            cart: cart.map(item =>
              item.id === productId
                ? { ...item, quantity }
                : item
            )
          })
        }
      },

      /**
       * Limpa o carrinho
       */
      clearCart: () => {
        set({ cart: [] })
      },

      /**
       * Calcula o total do carrinho
       */
      get total() {
        const { cart } = get()
        return cart.reduce((total, item) => {
          return total + (item.preco * item.quantity)
        }, 0)
      },

      /**
       * Calcula o total de itens no carrinho
       */
      get itemCount() {
        const { cart } = get()
        return cart.reduce((count, item) => count + item.quantity, 0)
      },

      /**
       * Inicia uma nova venda
       * @param {Object} saleData - Dados da venda
       */
      startSale: (saleData) => {
        set({
          currentSale: {
            id: Date.now().toString(),
            data: new Date().toISOString(),
            status: 'em_andamento',
            ...saleData
          }
        })
      },

      /**
       * Finaliza a venda atual
       * @param {Object} paymentData - Dados do pagamento
       */
      finishSale: async (paymentData) => {
        const { currentSale, cart } = get()
        
        if (!currentSale || cart.length === 0) {
          throw new Error('Nenhuma venda em andamento')
        }

        set({ isLoading: true, error: null })

        try {
          // Aqui você faria a chamada para a API
          const saleData = {
            ...currentSale,
            itens: cart,
            total: get().total,
            pagamento: paymentData,
            status: 'finalizada',
            dataFinalizacao: new Date().toISOString()
          }

          // Simula chamada à API
          await new Promise(resolve => setTimeout(resolve, 1000))

          // Limpa carrinho e venda atual
          set({
            cart: [],
            currentSale: null,
            isLoading: false
          })

          return saleData
        } catch (error) {
          set({
            error: error.message,
            isLoading: false
          })
          throw error
        }
      },

      /**
       * Cancela a venda atual
       */
      cancelSale: () => {
        set({
          cart: [],
          currentSale: null,
          error: null
        })
      },

      /**
       * Aplica desconto ao carrinho
       * @param {number} discountPercent - Percentual de desconto
       */
      applyDiscount: (discountPercent) => {
        const { cart } = get()
        const discount = discountPercent / 100
        
        set({
          cart: cart.map(item => ({
            ...item,
            desconto: discount,
            precoComDesconto: item.preco * (1 - discount)
          }))
        })
      },

      /**
       * Remove desconto do carrinho
       */
      removeDiscount: () => {
        const { cart } = get()
        set({
          cart: cart.map(item => ({
            ...item,
            desconto: 0,
            precoComDesconto: item.preco
          }))
        })
      },

      /**
       * Limpa erros
       */
      clearError: () => {
        set({ error: null })
      }
    }),
    {
      name: 'pdv-sales', // Nome da chave no localStorage
      partialize: (state) => ({
        cart: state.cart,
        currentSale: state.currentSale
      })
    }
  )
) 
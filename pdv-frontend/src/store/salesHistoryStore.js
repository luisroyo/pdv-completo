import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Store de Histórico de Vendas
 * Gerencia listagem, filtros e detalhes de vendas
 */
export const useSalesHistoryStore = create(
  persist(
    (set, get) => ({
      // Estado
      sales: [],
      filteredSales: [],
      isLoading: false,
      error: null,
      filters: {
        startDate: '',
        endDate: '',
        paymentMethod: '',
        minAmount: '',
        maxAmount: '',
        status: ''
      },

      // Ações
      /**
       * Carrega vendas do histórico
       */
      loadSales: async () => {
        set({ isLoading: true, error: null })

        try {
          // Simula vendas (substitua pela chamada real da API)
          const mockSales = [
            {
              id: '1',
              createdAt: new Date().toISOString(),
              total: 125.50,
              paymentMethod: 'dinheiro',
              status: 'finalizada',
              operator: 'João Silva',
              items: [
                { id: '1', name: 'Produto 1', quantity: 2, price: 25.00, total: 50.00 },
                { id: '2', name: 'Produto 2', quantity: 1, price: 75.50, total: 75.50 }
              ],
              customer: null,
              observations: ''
            },
            {
              id: '2',
              createdAt: new Date(Date.now() - 3600000).toISOString(),
              total: 89.90,
              paymentMethod: 'cartao_credito',
              status: 'finalizada',
              operator: 'Maria Santos',
              items: [
                { id: '3', name: 'Produto 3', quantity: 1, price: 89.90, total: 89.90 }
              ],
              customer: { name: 'Cliente Teste', document: '123.456.789-00' },
              observations: 'Cliente VIP'
            },
            {
              id: '3',
              createdAt: new Date(Date.now() - 7200000).toISOString(),
              total: 45.00,
              paymentMethod: 'pix',
              status: 'cancelada',
              operator: 'João Silva',
              items: [
                { id: '4', name: 'Produto 4', quantity: 3, price: 15.00, total: 45.00 }
              ],
              customer: null,
              observations: 'Cancelado pelo cliente'
            }
          ]

          // Verifica se há dados salvos no localStorage
          const savedSales = localStorage.getItem('pdv-sales-history')
          if (savedSales) {
            const parsed = JSON.parse(savedSales)
            set({ 
              sales: parsed, 
              filteredSales: parsed,
              isLoading: false 
            })
          } else {
            set({ 
              sales: mockSales, 
              filteredSales: mockSales,
              isLoading: false 
            })
          }
        } catch (error) {
          set({ 
            error: 'Erro ao carregar vendas', 
            isLoading: false 
          })
        }
      },

      /**
       * Aplica filtros às vendas
       * @param {Object} filters - Filtros a serem aplicados
       */
      applyFilters: (filters) => {
        const { sales } = get()
        let filtered = [...sales]

        // Filtro por data
        if (filters.startDate) {
          filtered = filtered.filter(sale => 
            new Date(sale.createdAt) >= new Date(filters.startDate)
          )
        }

        if (filters.endDate) {
          filtered = filtered.filter(sale => 
            new Date(sale.createdAt) <= new Date(filters.endDate + 'T23:59:59')
          )
        }

        // Filtro por método de pagamento
        if (filters.paymentMethod) {
          filtered = filtered.filter(sale => 
            sale.paymentMethod === filters.paymentMethod
          )
        }

        // Filtro por valor mínimo
        if (filters.minAmount) {
          filtered = filtered.filter(sale => 
            sale.total >= parseFloat(filters.minAmount)
          )
        }

        // Filtro por valor máximo
        if (filters.maxAmount) {
          filtered = filtered.filter(sale => 
            sale.total <= parseFloat(filters.maxAmount)
          )
        }

        // Filtro por status
        if (filters.status) {
          filtered = filtered.filter(sale => 
            sale.status === filters.status
          )
        }

        set({ 
          filteredSales: filtered,
          filters 
        })
      },

      /**
       * Limpa filtros aplicados
       */
      clearFilters: () => {
        const { sales } = get()
        set({ 
          filteredSales: sales,
          filters: {
            startDate: '',
            endDate: '',
            paymentMethod: '',
            minAmount: '',
            maxAmount: '',
            status: ''
          }
        })
      },

      /**
       * Adiciona uma nova venda ao histórico
       * @param {Object} sale - Venda a ser adicionada
       */
      addSale: (sale) => {
        const { sales } = get()
        const newSale = {
          ...sale,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          status: 'finalizada'
        }

        const updatedSales = [newSale, ...sales]
        
        // Salva no localStorage
        localStorage.setItem('pdv-sales-history', JSON.stringify(updatedSales))
        
        set({ 
          sales: updatedSales,
          filteredSales: updatedSales
        })
      },

      /**
       * Cancela uma venda
       * @param {string} saleId - ID da venda
       * @param {string} reason - Motivo do cancelamento
       */
      cancelSale: (saleId, reason) => {
        const { sales } = get()
        const updatedSales = sales.map(sale => 
          sale.id === saleId 
            ? { ...sale, status: 'cancelada', cancelReason: reason }
            : sale
        )

        // Salva no localStorage
        localStorage.setItem('pdv-sales-history', JSON.stringify(updatedSales))
        
        set({ 
          sales: updatedSales,
          filteredSales: updatedSales
        })
      },

      /**
       * Obtém detalhes de uma venda específica
       * @param {string} saleId - ID da venda
       */
      getSaleById: (saleId) => {
        const { sales } = get()
        return sales.find(sale => sale.id === saleId)
      },

      /**
       * Calcula total de vendas
       */
      get totalSales() {
        const { filteredSales } = get()
        return filteredSales.length
      },

      /**
       * Calcula valor total das vendas
       */
      get totalAmount() {
        const { filteredSales } = get()
        return filteredSales.reduce((total, sale) => total + sale.total, 0)
      },

      /**
       * Calcula ticket médio
       */
      get averageTicket() {
        const { totalSales, totalAmount } = get()
        return totalSales > 0 ? totalAmount / totalSales : 0
      },

      /**
       * Obtém vendas por período
       * @param {Date} startDate - Data inicial
       * @param {Date} endDate - Data final
       */
      getSalesByPeriod: (startDate, endDate) => {
        const { sales } = get()
        return sales.filter(sale => {
          const saleDate = new Date(sale.createdAt)
          return saleDate >= startDate && saleDate <= endDate
        })
      },

      /**
       * Obtém vendas por método de pagamento
       * @param {string} paymentMethod - Método de pagamento
       */
      getSalesByPaymentMethod: (paymentMethod) => {
        const { sales } = get()
        return sales.filter(sale => sale.paymentMethod === paymentMethod)
      },

      /**
       * Limpa erros
       */
      clearError: () => {
        set({ error: null })
      },

      /**
       * Reseta dados (para testes)
       */
      resetSales: () => {
        localStorage.removeItem('pdv-sales-history')
        set({
          sales: [],
          filteredSales: [],
          error: null
        })
      }
    }),
    {
      name: 'pdv-sales-history', // Nome da chave no localStorage
      partialize: (state) => ({
        sales: state.sales,
        filters: state.filters
      })
    }
  )
) 
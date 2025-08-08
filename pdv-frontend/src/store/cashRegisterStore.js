import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { cashRegisterService } from '../services/api'

/**
 * Store de Gerenciamento de Caixa
 * Gerencia abertura, fechamento e movimentações do caixa
 */
export const useCashRegisterStore = create(
  persist(
    (set, get) => ({
      // Estado
      cashStatus: null,
      movements: [],
      isLoading: false,
      error: null,

      // Ações
      /**
       * Carrega o status atual do caixa
       */
      loadCashStatus: async () => {
        set({ isLoading: true, error: null })

        try {
          // Simula chamada à API
          const mockStatus = {
            isOpen: false,
            openedAt: null,
            openedBy: null,
            openingAmount: 0,
            closedAt: null,
            closedBy: null,
            closingAmount: 0
          }

          // Verifica se há dados salvos no localStorage
          const savedStatus = localStorage.getItem('pdv-cash-status')
          if (savedStatus) {
            const parsed = JSON.parse(savedStatus)
            set({ cashStatus: parsed, isLoading: false })
          } else {
            set({ cashStatus: mockStatus, isLoading: false })
          }
        } catch (error) {
          set({ 
            error: 'Erro ao carregar status do caixa', 
            isLoading: false 
          })
        }
      },

      /**
       * Carrega movimentações do caixa
       */
      loadMovements: async () => {
        set({ isLoading: true, error: null })

        try {
          // Simula chamada à API
          const mockMovements = [
            {
              id: '1',
              type: 'entrada',
              amount: 100.00,
              description: 'Abertura de caixa',
              createdAt: new Date().toISOString(),
              createdBy: 'João Silva'
            },
            {
              id: '2',
              type: 'saida',
              amount: 25.50,
              description: 'Compra de material',
              createdAt: new Date(Date.now() - 3600000).toISOString(),
              createdBy: 'João Silva'
            }
          ]

          // Verifica se há dados salvos no localStorage
          const savedMovements = localStorage.getItem('pdv-cash-movements')
          if (savedMovements) {
            const parsed = JSON.parse(savedMovements)
            set({ movements: parsed, isLoading: false })
          } else {
            set({ movements: mockMovements, isLoading: false })
          }
        } catch (error) {
          set({ 
            error: 'Erro ao carregar movimentações', 
            isLoading: false 
          })
        }
      },

      /**
       * Abre o caixa
       * @param {Object} data - Dados de abertura
       */
      openCash: async (data) => {
        set({ isLoading: true, error: null })

        try {
          const cashData = {
            isOpen: true,
            openedAt: new Date().toISOString(),
            openedBy: data.openedBy || 'Usuário',
            openingAmount: data.openingAmount || 0,
            closedAt: null,
            closedBy: null,
            closingAmount: 0
          }

          // Salva no localStorage
          localStorage.setItem('pdv-cash-status', JSON.stringify(cashData))

          // Adiciona movimentação de abertura
          const openingMovement = {
            id: Date.now().toString(),
            type: 'entrada',
            amount: data.openingAmount || 0,
            description: 'Abertura de caixa',
            createdAt: new Date().toISOString(),
            createdBy: data.openedBy || 'Usuário'
          }

          const currentMovements = get().movements
          const updatedMovements = [openingMovement, ...currentMovements]
          localStorage.setItem('pdv-cash-movements', JSON.stringify(updatedMovements))

          set({ 
            cashStatus: cashData, 
            movements: updatedMovements,
            isLoading: false 
          })

          return cashData
        } catch (error) {
          set({ 
            error: 'Erro ao abrir caixa', 
            isLoading: false 
          })
          throw error
        }
      },

      /**
       * Fecha o caixa
       * @param {Object} data - Dados de fechamento
       */
      closeCash: async (data) => {
        set({ isLoading: true, error: null })

        try {
          const currentStatus = get().cashStatus
          const cashData = {
            ...currentStatus,
            isOpen: false,
            closedAt: new Date().toISOString(),
            closedBy: data.closedBy || 'Usuário',
            closingAmount: data.closingAmount || 0
          }

          // Salva no localStorage
          localStorage.setItem('pdv-cash-status', JSON.stringify(cashData))

          // Adiciona movimentação de fechamento
          const closingMovement = {
            id: Date.now().toString(),
            type: 'saida',
            amount: data.closingAmount || 0,
            description: 'Fechamento de caixa',
            createdAt: new Date().toISOString(),
            createdBy: data.closedBy || 'Usuário'
          }

          const currentMovements = get().movements
          const updatedMovements = [closingMovement, ...currentMovements]
          localStorage.setItem('pdv-cash-movements', JSON.stringify(updatedMovements))

          set({ 
            cashStatus: cashData, 
            movements: updatedMovements,
            isLoading: false 
          })

          return cashData
        } catch (error) {
          set({ 
            error: 'Erro ao fechar caixa', 
            isLoading: false 
          })
          throw error
        }
      },

      /**
       * Adiciona movimentação ao caixa
       * @param {Object} data - Dados da movimentação
       */
      addMovement: async (data) => {
        set({ isLoading: true, error: null })

        try {
          const movement = {
            id: Date.now().toString(),
            type: data.type,
            amount: data.amount,
            description: data.description,
            createdAt: new Date().toISOString(),
            createdBy: data.createdBy || 'Usuário'
          }

          const currentMovements = get().movements
          const updatedMovements = [movement, ...currentMovements]
          localStorage.setItem('pdv-cash-movements', JSON.stringify(updatedMovements))

          set({ 
            movements: updatedMovements,
            isLoading: false 
          })

          return movement
        } catch (error) {
          set({ 
            error: 'Erro ao adicionar movimentação', 
            isLoading: false 
          })
          throw error
        }
      },

      /**
       * Calcula o total em caixa
       */
      get totalCash() {
        const { movements, cashStatus } = get()
        const openingAmount = cashStatus?.openingAmount || 0
        
        const totalMovements = movements.reduce((total, movement) => {
          if (movement.type === 'entrada') {
            return total + movement.amount
          } else {
            return total - movement.amount
          }
        }, 0)

        return openingAmount + totalMovements
      },

      /**
       * Calcula total de vendas do dia
       */
      get totalSales() {
        const { movements } = get()
        const today = new Date().toDateString()
        
        return movements
          .filter(movement => 
            movement.type === 'entrada' && 
            movement.description.includes('Venda') &&
            new Date(movement.createdAt).toDateString() === today
          )
          .reduce((total, movement) => total + movement.amount, 0)
      },

      /**
       * Calcula total de saídas do dia
       */
      get totalWithdrawals() {
        const { movements } = get()
        const today = new Date().toDateString()
        
        return movements
          .filter(movement => 
            movement.type === 'saida' &&
            new Date(movement.createdAt).toDateString() === today
          )
          .reduce((total, movement) => total + movement.amount, 0)
      },

      /**
       * Limpa erros
       */
      clearError: () => {
        set({ error: null })
      },

      /**
       * Reseta dados do caixa (para testes)
       */
      resetCash: () => {
        localStorage.removeItem('pdv-cash-status')
        localStorage.removeItem('pdv-cash-movements')
        set({
          cashStatus: null,
          movements: [],
          error: null
        })
      }
    }),
    {
      name: 'pdv-cash-register', // Nome da chave no localStorage
      partialize: (state) => ({
        cashStatus: state.cashStatus,
        movements: state.movements
      })
    }
  )
) 
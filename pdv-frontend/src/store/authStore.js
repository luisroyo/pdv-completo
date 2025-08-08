import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'

/**
 * Store de autenticação
 * Gerencia estado de login, usuário logado e permissões
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // Estado
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      permissions: [],

      // Ações
      /**
       * Realiza login do usuário
       * @param {string} username - Nome de usuário
       * @param {string} password - Senha
       */
      login: async (username, password) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await api.post('/auth/login', {
            username,
            password
          })

          const { user, token, permissions } = response.data

          set({
            user,
            token,
            isAuthenticated: true,
            permissions,
            isLoading: false,
            error: null
          })

          // Configura token no header das requisições
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`

          return { success: true }
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Erro ao fazer login'
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false
          })
          return { success: false, error: errorMessage }
        }
      },

      /**
       * Realiza logout do usuário
       */
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          permissions: [],
          error: null
        })

        // Remove token do header
        delete api.defaults.headers.common['Authorization']

        // Limpa dados do localStorage
        localStorage.removeItem('pdv-auth')
      },

      /**
       * Verifica se o token ainda é válido
       */
      checkAuth: async () => {
        const { token } = get()
        
        if (!token) {
          set({ isAuthenticated: false })
          return false
        }

        try {
          const response = await api.get('/auth/me')
          const { user, permissions } = response.data

          set({
            user,
            isAuthenticated: true,
            permissions
          })

          return true
        } catch (error) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            permissions: []
          })
          return false
        }
      },

      /**
       * Verifica se o usuário tem uma permissão específica
       * @param {string} permission - Permissão a ser verificada
       */
      hasPermission: (permission) => {
        const { permissions } = get()
        return permissions.includes(permission)
      },

      /**
       * Verifica se o usuário tem qualquer uma das permissões
       * @param {string[]} permissions - Lista de permissões
       */
      hasAnyPermission: (permissions) => {
        const { permissions: userPermissions } = get()
        return permissions.some(permission => userPermissions.includes(permission))
      },

      /**
       * Verifica se o usuário tem todas as permissões
       * @param {string[]} permissions - Lista de permissões
       */
      hasAllPermissions: (permissions) => {
        const { permissions: userPermissions } = get()
        return permissions.every(permission => userPermissions.includes(permission))
      },

      /**
       * Limpa erros
       */
      clearError: () => {
        set({ error: null })
      },

      /**
       * Define estado de carregamento
       * @param {boolean} loading - Estado de carregamento
       */
      setLoading: (loading) => {
        set({ isLoading: loading })
      }
    }),
    {
      name: 'pdv-auth', // Nome da chave no localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        permissions: state.permissions
      })
    }
  )
) 
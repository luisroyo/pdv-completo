import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import themeManager from '../utils/themeManager'

/**
 * Store de tema
 * Gerencia configurações de tema e aparência da aplicação
 */
export const useThemeStore = create(
  persist(
    (set, get) => ({
      // Estado
      currentTheme: null,
      isDarkMode: false,
      availableThemes: [],
      isLoading: false,

      // Ações
      /**
       * Carrega um tema específico
       * @param {string} themePath - Caminho para o arquivo JSON do tema
       */
      loadTheme: async (themePath) => {
        set({ isLoading: true })
        
        try {
          const theme = await themeManager.loadTheme(themePath)
          set({
            currentTheme: theme,
            isLoading: false
          })
          return { success: true, theme }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: error.message }
        }
      },

      /**
       * Aplica tema padrão
       */
      resetToDefault: () => {
        themeManager.resetToDefault()
        set({
          currentTheme: themeManager.getCurrentTheme(),
          isDarkMode: false
        })
      },

      /**
       * Alterna entre modo claro e escuro
       */
      toggleDarkMode: () => {
        const { isDarkMode } = get()
        themeManager.toggleDarkMode()
        set({ isDarkMode: !isDarkMode })
      },

      /**
       * Define modo escuro
       * @param {boolean} isDark - Se deve ativar modo escuro
       */
      setDarkMode: (isDark) => {
        const { isDarkMode } = get()
        
        if (isDark !== isDarkMode) {
          themeManager.toggleDarkMode()
          set({ isDarkMode: isDark })
        }
      },

      /**
       * Carrega lista de temas disponíveis
       */
      loadAvailableThemes: async () => {
        try {
          // Aqui você carregaria a lista de temas do servidor
          // Por enquanto, vamos usar temas padrão
          const themes = [
            {
              id: 'default',
              name: 'PDV Padrão',
              path: '/themes/default.json',
              preview: '/themes/previews/default.png'
            },
            {
              id: 'padaria',
              name: 'Padaria Central',
              path: '/themes/padaria.json',
              preview: '/themes/previews/padaria.png'
            },
            {
              id: 'farmacia',
              name: 'Farmácia Popular',
              path: '/themes/farmacia.json',
              preview: '/themes/previews/farmacia.png'
            },
            {
              id: 'supermercado',
              name: 'Supermercado Express',
              path: '/themes/supermercado.json',
              preview: '/themes/previews/supermercado.png'
            }
          ]

          set({ availableThemes: themes })
          return themes
        } catch (error) {
          console.error('Erro ao carregar temas:', error)
          return []
        }
      },

      /**
       * Obtém tema atual
       */
      getCurrentTheme: () => {
        return get().currentTheme || themeManager.getCurrentTheme()
      },

      /**
       * Atualiza configuração de tema
       * @param {Object} themeConfig - Configurações do tema
       */
      updateThemeConfig: (themeConfig) => {
        const { currentTheme } = get()
        const updatedTheme = { ...currentTheme, ...themeConfig }
        
        themeManager.applyTheme(updatedTheme)
        set({ currentTheme: updatedTheme })
      },

      /**
       * Inicializa o store de tema
       */
      init: async () => {
        // Carrega tema salvo
        const savedTheme = themeManager.getCurrentTheme()
        set({ currentTheme: savedTheme })

        // Carrega lista de temas disponíveis
        await get().loadAvailableThemes()

        // Verifica modo escuro
        const isDark = document.documentElement.classList.contains('dark')
        set({ isDarkMode: isDark })
      }
    }),
    {
      name: 'pdv-theme', // Nome da chave no localStorage
      partialize: (state) => ({
        currentTheme: state.currentTheme,
        isDarkMode: state.isDarkMode
      })
    }
  )
) 
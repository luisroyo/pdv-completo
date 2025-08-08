import React from 'react'
import { useAuthStore } from '../../store/authStore'
import { useThemeStore } from '../../store/themeStore'
import Sidebar from './Sidebar'
import Header from './Header'

/**
 * Componente de Layout Principal
 * Gerencia a estrutura geral da aplicação PDV
 */
const Layout = ({ children }) => {
  const { user, logout } = useAuthStore()
  const { currentTheme, toggleDarkMode } = useThemeStore()

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header 
          user={user}
          onLogout={logout}
          onToggleDarkMode={toggleDarkMode}
          currentTheme={currentTheme}
        />
        
        {/* Área de conteúdo */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout 
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { useThemeStore } from './store/themeStore'

// Componentes de layout
import Layout from './components/Layout/Layout'
import LoadingScreen from './components/UI/LoadingScreen'

// Páginas do sistema
import Login from './modules/Auth/Login'
import Sales from './modules/Sales/Sales'
import CashRegister from './modules/CashRegister/CashRegister'
import SalesHistory from './modules/SalesHistory/SalesHistory'
import Settings from './modules/Settings/Settings'
import OfflineMode from './modules/OfflineMode/OfflineMode'

/**
 * Componente principal da aplicação PDV
 * Gerencia rotas e estado global da aplicação
 */
function App() {
    const { isAuthenticated, isLoading } = useAuthStore()
    const { currentTheme } = useThemeStore()

    // Mostra tela de carregamento enquanto inicializa
    if (isLoading) {
        return <LoadingScreen />
    }

    // Se não está autenticado, mostra tela de login
    if (!isAuthenticated) {
        return <Login />
    }

    return (
        <div className="App">
            <Layout>
                <Routes>
                    {/* Rota principal - Tela de Vendas */}
                    <Route path="/" element={<Sales />} />

                    {/* Rotas do sistema */}
                    <Route path="/sales" element={<Sales />} />
                    <Route path="/cash-register" element={<CashRegister />} />
                    <Route path="/sales-history" element={<SalesHistory />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/offline" element={<OfflineMode />} />

                    {/* Rota de fallback */}
                    <Route path="*" element={<Sales />} />
                </Routes>
            </Layout>
        </div>
    )
}

export default App 
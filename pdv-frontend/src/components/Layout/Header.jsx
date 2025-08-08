import React from 'react'
import { Link } from 'react-router-dom'

/**
 * Componente de Header
 * Exibe informações do usuário, logo e controles
 */
const Header = ({ user, onLogout, onToggleDarkMode, currentTheme }) => {
    return (
        <header className="bg-surface border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Logo e nome do estabelecimento */}
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-text">
                            {currentTheme?.name || 'PDV Sistema'}
                        </h1>
                        <p className="text-sm text-text-secondary">
                            Ponto de Venda Fiscal
                        </p>
                    </div>
                </div>

                {/* Controles do usuário */}
                <div className="flex items-center space-x-4">
                    {/* Status do sistema */}
                    <div className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span className="text-text-secondary">Online</span>
                    </div>

                    {/* Botão modo escuro */}
                    <button
                        onClick={onToggleDarkMode}
                        className="p-2 rounded-lg hover:bg-accent transition-colors"
                        title="Alternar modo escuro"
                    >
                        <svg
                            className="w-5 h-5 text-text-secondary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                            />
                        </svg>
                    </button>

                    {/* Menu do usuário */}
                    <div className="relative">
                        <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent transition-colors">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                    {user?.nome?.charAt(0) || 'U'}
                                </span>
                            </div>
                            <span className="text-text font-medium">
                                {user?.nome || 'Usuário'}
                            </span>
                            <svg
                                className="w-4 h-4 text-text-secondary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>

                        {/* Dropdown menu */}
                        <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg py-2 z-50">
                            <Link
                                to="/settings"
                                className="block px-4 py-2 text-sm text-text hover:bg-accent transition-colors"
                            >
                                Configurações
                            </Link>
                            <button
                                onClick={onLogout}
                                className="block w-full text-left px-4 py-2 text-sm text-error hover:bg-accent transition-colors"
                            >
                                Sair
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header 
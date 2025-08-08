import React from 'react'

/**
 * Componente de Tela de Carregamento
 * Exibido durante a inicialização da aplicação
 */
const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        {/* Logo animado */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-primary rounded-lg flex items-center justify-center animate-bounce-in">
            <svg 
              className="w-12 h-12 text-white" 
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
        </div>

        {/* Texto de carregamento */}
        <h2 className="text-2xl font-semibold text-text mb-2">
          PDV Sistema
        </h2>
        <p className="text-text-secondary mb-6">
          Inicializando sistema...
        </p>

        {/* Spinner de carregamento */}
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        {/* Informações do sistema */}
        <div className="mt-8 text-sm text-text-secondary">
          <p>Versão 1.0.0</p>
          <p>Carregando configurações...</p>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen 
import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useThemeStore } from '../../store/themeStore'

/**
 * Tela de Login
 * Autenticação de usuários no sistema PDV
 */
const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login, isAuthenticated } = useAuthStore()
  const { currentTheme } = useThemeStore()

  // Redireciona se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/'
    }
  }, [isAuthenticated])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await login(username, password)
      if (!result.success) {
        setError(result.error || 'Erro ao fazer login')
      }
    } catch (err) {
      setError('Erro de conexão. Verifique sua internet.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e título */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-primary rounded-xl flex items-center justify-center mb-4">
            <svg 
              className="w-10 h-10 text-white" 
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
          <h1 className="text-2xl font-bold text-text mb-2">
            {currentTheme?.name || 'PDV Sistema'}
          </h1>
          <p className="text-text-secondary">
            Faça login para acessar o sistema
          </p>
        </div>

        {/* Formulário de login */}
        <div className="bg-surface rounded-lg border border-border p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo usuário */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-text mb-2">
                Usuário
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input w-full"
                placeholder="Digite seu usuário"
                required
                disabled={isLoading}
              />
            </div>

            {/* Campo senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text mb-2">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input w-full"
                placeholder="Digite sua senha"
                required
                disabled={isLoading}
              />
            </div>

            {/* Mensagem de erro */}
            {error && (
              <div className="bg-error/10 border border-error/20 rounded-lg p-3">
                <p className="text-error text-sm">{error}</p>
              </div>
            )}

            {/* Botão de login */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full btn-lg"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Entrando...</span>
                </div>
              ) : (
                'Entrar'
              )}
            </button>
          </form>
        </div>

        {/* Informações adicionais */}
        <div className="text-center mt-6 text-sm text-text-secondary">
          <p>Versão 1.0.0</p>
          <p className="mt-1">Sistema de Ponto de Venda Fiscal</p>
        </div>

        {/* Atalhos de teclado */}
        <div className="text-center mt-4 text-xs text-text-secondary">
          <p>Pressione <kbd className="px-1 py-0.5 bg-surface border border-border rounded text-xs">Enter</kbd> para fazer login</p>
        </div>
      </div>
    </div>
  )
}

export default Login 
import axios from 'axios'

/**
 * Configuração da API para comunicação com o backend C#
 * Configura interceptors para autenticação e tratamento de erros
 */

// Cria instância do axios com configurações base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para requisições
api.interceptors.request.use(
  (config) => {
    // Adiciona token de autenticação se disponível
    const token = localStorage.getItem('pdv-auth')
    if (token) {
      try {
        const authData = JSON.parse(token)
        if (authData.state?.token) {
          config.headers.Authorization = `Bearer ${authData.state.token}`
        }
      } catch (error) {
        console.error('Erro ao parsear token:', error)
      }
    }

    // Adiciona timestamp para evitar cache
    config.params = {
      ...config.params,
      _t: Date.now()
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para respostas
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Se erro 401 (não autorizado) e não é uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Tenta renovar o token
        const refreshToken = localStorage.getItem('pdv-refresh-token')
        if (refreshToken) {
          const response = await api.post('/auth/refresh', {
            refreshToken
          })

          const { token } = response.data

          // Atualiza token no localStorage
          const authData = JSON.parse(localStorage.getItem('pdv-auth') || '{}')
          authData.state.token = token
          localStorage.setItem('pdv-auth', JSON.stringify(authData))

          // Atualiza header da requisição original
          originalRequest.headers.Authorization = `Bearer ${token}`

          // Repete a requisição original
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Se falhar ao renovar, faz logout
        localStorage.removeItem('pdv-auth')
        localStorage.removeItem('pdv-refresh-token')
        window.location.href = '/login'
      }
    }

    // Tratamento específico para erros de rede
    if (!error.response) {
      console.error('Erro de rede:', error.message)
      // Aqui você pode implementar lógica para modo offline
    }

    return Promise.reject(error)
  }
)

/**
 * Serviços específicos da API
 */

// Serviço de autenticação
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken })
}

// Serviço de vendas
export const salesService = {
  create: (saleData) => api.post('/vendas', saleData),
  getById: (id) => api.get(`/vendas/${id}`),
  list: (params) => api.get('/vendas', { params }),
  addItem: (saleId, item) => api.post(`/vendas/${saleId}/itens`, item),
  finalize: (saleId, paymentData) => api.post(`/vendas/${saleId}/finalizar`, paymentData),
  cancel: (saleId, reason) => api.post(`/vendas/${saleId}/cancelar`, { reason }),
  getSummary: (params) => api.get('/vendas/resumo', { params }),
  getByCustomer: (customerId) => api.get(`/vendas/cliente/${customerId}`)
}

// Serviço de produtos
export const productsService = {
  list: (params) => api.get('/produtos', { params }),
  getById: (id) => api.get(`/produtos/${id}`),
  getByBarcode: (barcode) => api.get(`/produtos/barcode/${barcode}`),
  create: (productData) => api.post('/produtos', productData),
  update: (id, productData) => api.put(`/produtos/${id}`, productData),
  delete: (id) => api.delete(`/produtos/${id}`)
}

// Serviço de clientes
export const customersService = {
  list: (params) => api.get('/clientes', { params }),
  getById: (id) => api.get(`/clientes/${id}`),
  getByDocument: (document) => api.get(`/clientes/document/${document}`),
  create: (customerData) => api.post('/clientes', customerData),
  update: (id, customerData) => api.put(`/clientes/${id}`, customerData),
  delete: (id) => api.delete(`/clientes/${id}`)
}

// Serviço de caixa
export const cashRegisterService = {
  open: (data) => api.post('/caixa/abrir', data),
  close: (id, data) => api.post(`/caixa/${id}/fechar`, data),
  getById: (id) => api.get(`/caixa/${id}`),
  getCurrent: () => api.get('/caixa/atual'),
  list: (params) => api.get('/caixa', { params }),
  addMovement: (id, movementData) => api.post(`/caixa/${id}/movimentacoes`, movementData),
  getMovements: (id, params) => api.get(`/caixa/${id}/movimentacoes`, { params }),
  getMovement: (id) => api.get(`/caixa/movimentacoes/${id}`),
  getSummary: (id) => api.get(`/caixa/${id}/resumo`)
}

// Serviço de relatórios
export const reportsService = {
  salesReport: (params) => api.get('/relatorios/vendas', { params }),
  cashReport: (params) => api.get('/relatorios/caixa', { params }),
  fiscalReport: (params) => api.get('/relatorios/fiscal', { params }),
  stockReport: (params) => api.get('/relatorios/estoque', { params })
}

// Serviço de configurações
export const settingsService = {
  get: () => api.get('/configuracoes'),
  update: (settings) => api.put('/configuracoes', settings),
  getThemes: () => api.get('/configuracoes/temas'),
  updateTheme: (theme) => api.put('/configuracoes/tema', theme)
}

// Serviço de sincronização offline
export const syncService = {
  syncOfflineData: (data) => api.post('/sync/offline', data),
  getPendingSync: () => api.get('/sync/pending'),
  markSynced: (ids) => api.post('/sync/mark-synced', { ids })
}

// Exporta instância do axios para uso direto
export default api 
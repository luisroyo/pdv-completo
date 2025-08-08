import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'

/**
 * Tela de Modo Offline
 * Gerencia sincronização e status de conectividade
 */
const OfflineMode = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine)
    const [syncStatus, setSyncStatus] = useState('idle') // idle, syncing, success, error
    const [pendingData, setPendingData] = useState({
        vendas: 5,
        movimentacoes: 3,
        produtos: 12
    })
    const { user } = useAuthStore()

    // Monitorar status de conectividade
    useEffect(() => {
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    // Simular sincronização
    const handleSync = async () => {
        if (!isOnline) return

        setSyncStatus('syncing')

        // Simular processo de sincronização
        setTimeout(() => {
            setSyncStatus('success')
            setPendingData({ vendas: 0, movimentacoes: 0, produtos: 0 })

            // Reset status após 3 segundos
            setTimeout(() => setSyncStatus('idle'), 3000)
        }, 2000)
    }

    const getStatusColor = () => {
        if (!isOnline) return 'text-red-500'
        if (syncStatus === 'syncing') return 'text-yellow-500'
        if (syncStatus === 'success') return 'text-green-500'
        if (syncStatus === 'error') return 'text-red-500'
        return 'text-green-500'
    }

    const getStatusText = () => {
        if (!isOnline) return 'Offline'
        if (syncStatus === 'syncing') return 'Sincronizando...'
        if (syncStatus === 'success') return 'Sincronizado'
        if (syncStatus === 'error') return 'Erro na sincronização'
        return 'Online'
    }

    const getStatusIcon = () => {
        if (!isOnline) return '🔴'
        if (syncStatus === 'syncing') return '🔄'
        if (syncStatus === 'success') return '✅'
        if (syncStatus === 'error') return '❌'
        return '🟢'
    }

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-surface border-b border-border p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-text">Modo Offline</h1>
                        <p className="text-text-secondary">Gerencie a sincronização de dados</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className={`flex items-center space-x-2 ${getStatusColor()}`}>
                            <span className="text-xl">{getStatusIcon()}</span>
                            <span className="font-medium">{getStatusText()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Conteúdo principal */}
            <div className="flex-1 p-6 overflow-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Status de conectividade */}
                    <div className="bg-surface border border-border rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-text mb-4">Status de Conectividade</h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
                                    <span className="font-medium text-text">Conexão com Internet</span>
                                </div>
                                <span className={`font-medium ${isOnline ? 'text-green-500' : 'text-red-500'}`}>
                                    {isOnline ? 'Conectado' : 'Desconectado'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                    <span className="font-medium text-text">Servidor Backend</span>
                                </div>
                                <span className={`font-medium ${isOnline ? 'text-green-500' : 'text-yellow-500'}`}>
                                    {isOnline ? 'Disponível' : 'Indisponível'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                    <span className="font-medium text-text">Armazenamento Local</span>
                                </div>
                                <span className="font-medium text-green-500">Disponível</span>
                            </div>
                        </div>
                    </div>

                    {/* Dados pendentes */}
                    <div className="bg-surface border border-border rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-text mb-4">Dados Pendentes</h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">🛒</span>
                                    <div>
                                        <span className="font-medium text-text">Vendas</span>
                                        <p className="text-sm text-text-secondary">Aguardando sincronização</p>
                                    </div>
                                </div>
                                <span className="text-2xl font-bold text-primary">{pendingData.vendas}</span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">💰</span>
                                    <div>
                                        <span className="font-medium text-text">Movimentações</span>
                                        <p className="text-sm text-text-secondary">Entradas e saídas de caixa</p>
                                    </div>
                                </div>
                                <span className="text-2xl font-bold text-primary">{pendingData.movimentacoes}</span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">📦</span>
                                    <div>
                                        <span className="font-medium text-text">Produtos</span>
                                        <p className="text-sm text-text-secondary">Atualizações de estoque</p>
                                    </div>
                                </div>
                                <span className="text-2xl font-bold text-primary">{pendingData.produtos}</span>
                            </div>
                        </div>

                        {/* Botão de sincronização */}
                        <div className="mt-6">
                            <button
                                onClick={handleSync}
                                disabled={!isOnline || syncStatus === 'syncing'}
                                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${!isOnline || syncStatus === 'syncing'
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-primary text-white hover:bg-primary/90'
                                    }`}
                            >
                                {syncStatus === 'syncing' ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Sincronizando...</span>
                                    </div>
                                ) : (
                                    'Sincronizar Dados'
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Histórico de sincronização */}
                    <div className="bg-surface border border-border rounded-lg p-6 lg:col-span-2">
                        <h2 className="text-xl font-semibold text-text mb-4">Histórico de Sincronização</h2>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left py-3 px-4 font-medium text-text">Data/Hora</th>
                                        <th className="text-left py-3 px-4 font-medium text-text">Status</th>
                                        <th className="text-left py-3 px-4 font-medium text-text">Dados Sincronizados</th>
                                        <th className="text-left py-3 px-4 font-medium text-text">Usuário</th>
                                        <th className="text-left py-3 px-4 font-medium text-text">Detalhes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-border">
                                        <td className="py-3 px-4 text-text">15/01/2024 14:30</td>
                                        <td className="py-3 px-4">
                                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                                Sucesso
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-text">3 vendas, 2 movimentações</td>
                                        <td className="py-3 px-4 text-text">{user?.nome || 'Administrador'}</td>
                                        <td className="py-3 px-4 text-text">Sincronização automática</td>
                                    </tr>
                                    <tr className="border-b border-border">
                                        <td className="py-3 px-4 text-text">15/01/2024 10:15</td>
                                        <td className="py-3 px-4">
                                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                                                Erro
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-text">-</td>
                                        <td className="py-3 px-4 text-text">{user?.nome || 'Administrador'}</td>
                                        <td className="py-3 px-4 text-text">Servidor indisponível</td>
                                    </tr>
                                    <tr className="border-b border-border">
                                        <td className="py-3 px-4 text-text">14/01/2024 18:45</td>
                                        <td className="py-3 px-4">
                                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                                Sucesso
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-text">5 vendas, 1 movimentação</td>
                                        <td className="py-3 px-4 text-text">{user?.nome || 'Administrador'}</td>
                                        <td className="py-3 px-4 text-text">Sincronização manual</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Configurações de sincronização */}
                    <div className="bg-surface border border-border rounded-lg p-6 lg:col-span-2">
                        <h2 className="text-xl font-semibold text-text mb-4">Configurações de Sincronização</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="font-medium text-text">Sincronização automática</label>
                                        <p className="text-sm text-text-secondary">Sincronizar dados automaticamente</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="font-medium text-text">Sincronizar ao conectar</label>
                                        <p className="text-sm text-text-secondary">Sincronizar quando internet voltar</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-text mb-2">Intervalo de sincronização</label>
                                    <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text">
                                        <option value="5">5 minutos</option>
                                        <option value="15">15 minutos</option>
                                        <option value="30">30 minutos</option>
                                        <option value="60">1 hora</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text mb-2">Retenção de dados offline</label>
                                    <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text">
                                        <option value="7">7 dias</option>
                                        <option value="15">15 dias</option>
                                        <option value="30">30 dias</option>
                                        <option value="90">90 dias</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OfflineMode 
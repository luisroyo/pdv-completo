import React, { useState } from 'react'
import { useThemeStore } from '../../store/themeStore'
import { useAuthStore } from '../../store/authStore'

/**
 * Tela de Configurações do Sistema
 * Centraliza todas as configurações do PDV
 */
const Settings = () => {
    const [activeTab, setActiveTab] = useState('geral')
    const { currentTheme, themes, setTheme } = useThemeStore()
    const { user } = useAuthStore()

    const tabs = [
        { id: 'geral', label: 'Geral', icon: '⚙️' },
        { id: 'fiscal', label: 'Fiscal', icon: '📋' },
        { id: 'hardware', label: 'Hardware', icon: '🖥️' },
        { id: 'backup', label: 'Backup', icon: '💾' },
        { id: 'usuarios', label: 'Usuários', icon: '👥' },
        { id: 'empresa', label: 'Empresa', icon: '🏢' }
    ]

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-surface border-b border-border p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-text">Configurações</h1>
                        <p className="text-text-secondary">Gerencie as configurações do sistema</p>
                    </div>
                    <div className="text-sm text-text-secondary">
                        Usuário: {user?.nome || 'Administrador'}
                    </div>
                </div>
            </div>

            {/* Conteúdo */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar com abas */}
                <div className="w-64 bg-surface border-r border-border">
                    <div className="p-4">
                        <nav className="space-y-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === tab.id
                                        ? 'bg-primary text-white'
                                        : 'text-text hover:bg-accent'
                                        }`}
                                >
                                    <span className="text-lg">{tab.icon}</span>
                                    <span className="font-medium">{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Conteúdo da aba ativa */}
                <div className="flex-1 p-6 overflow-auto">
                    {activeTab === 'geral' && <GeralSettings />}
                    {activeTab === 'fiscal' && <FiscalSettings />}
                    {activeTab === 'hardware' && <HardwareSettings />}
                    {activeTab === 'backup' && <BackupSettings />}
                    {activeTab === 'usuarios' && <UsuariosSettings />}
                    {activeTab === 'empresa' && <EmpresaSettings />}
                </div>
            </div>
        </div>
    )
}

// Componente de configurações gerais
const GeralSettings = () => {
    const { currentTheme, themes, setTheme } = useThemeStore()

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-text mb-4">Configurações Gerais</h2>

                {/* Tema */}
                <div className="bg-surface border border-border rounded-lg p-6">
                    <h3 className="text-lg font-medium text-text mb-4">Tema do Sistema</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {Object.entries(themes).map(([key, theme]) => (
                            <button
                                key={key}
                                onClick={() => setTheme(key)}
                                className={`p-4 rounded-lg border-2 transition-all ${currentTheme === key
                                    ? 'border-primary bg-primary/10'
                                    : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: theme.colors.primary }}
                                    />
                                    <span className="font-medium text-text">{theme.name}</span>
                                </div>
                                <p className="text-sm text-text-secondary mt-2">{theme.description}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Configurações de interface */}
                <div className="bg-surface border border-border rounded-lg p-6 mt-6">
                    <h3 className="text-lg font-medium text-text mb-4">Interface</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="font-medium text-text">Modo escuro automático</label>
                                <p className="text-sm text-text-secondary">Alternar automaticamente baseado na hora</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <label className="font-medium text-text">Som de notificações</label>
                                <p className="text-sm text-text-secondary">Tocar som ao finalizar vendas</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Componente de configurações fiscais
const FiscalSettings = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-text mb-4">Configurações Fiscais</h2>

                {/* NFC-e */}
                <div className="bg-surface border border-border rounded-lg p-6">
                    <h3 className="text-lg font-medium text-text mb-4">NFC-e</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text mb-2">Ambiente</label>
                            <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text">
                                <option value="homologacao">Homologação</option>
                                <option value="producao">Produção</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text mb-2">Certificado Digital</label>
                            <input
                                type="file"
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                accept=".pfx,.p12"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text mb-2">Número de Série</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                placeholder="00000000000000000000000000000000000000000000"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text mb-2">CSC</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                placeholder="Código de Segurança do Contribuinte"
                            />
                        </div>
                    </div>
                </div>

                {/* SAT */}
                <div className="bg-surface border border-border rounded-lg p-6 mt-6">
                    <h3 className="text-lg font-medium text-text mb-4">SAT</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text mb-2">Ambiente</label>
                            <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text">
                                <option value="homologacao">Homologação</option>
                                <option value="producao">Produção</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text mb-2">Código de Ativação</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                placeholder="12345678"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Componente de configurações de hardware
const HardwareSettings = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-text mb-4">Configurações de Hardware</h2>

                {/* Impressora */}
                <div className="bg-surface border border-border rounded-lg p-6">
                    <h3 className="text-lg font-medium text-text mb-4">Impressora Térmica</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text mb-2">Porta</label>
                            <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text">
                                <option value="COM1">COM1</option>
                                <option value="COM2">COM2</option>
                                <option value="COM3">COM3</option>
                                <option value="USB">USB</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text mb-2">Modelo</label>
                            <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text">
                                <option value="epson">Epson TM-T20</option>
                                <option value="bematech">Bematech MP-4200</option>
                                <option value="daruma">Daruma DR800</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text mb-2">Velocidade</label>
                            <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text">
                                <option value="9600">9600 bps</option>
                                <option value="19200">19200 bps</option>
                                <option value="38400">38400 bps</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                                Testar Impressora
                            </button>
                        </div>
                    </div>
                </div>

                {/* Balança */}
                <div className="bg-surface border border-border rounded-lg p-6 mt-6">
                    <h3 className="text-lg font-medium text-text mb-4">Balança</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text mb-2">Porta</label>
                            <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text">
                                <option value="COM2">COM2</option>
                                <option value="COM3">COM3</option>
                                <option value="COM4">COM4</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text mb-2">Protocolo</label>
                            <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text">
                                <option value="toledo">Toledo</option>
                                <option value="filizola">Filizola</option>
                                <option value="urano">Urano</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                                Testar Balança
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Componente de configurações de backup
const BackupSettings = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-text mb-4">Configurações de Backup</h2>

                {/* Backup automático */}
                <div className="bg-surface border border-border rounded-lg p-6">
                    <h3 className="text-lg font-medium text-text mb-4">Backup Automático</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="font-medium text-text">Backup automático</label>
                                <p className="text-sm text-text-secondary">Realizar backup automático dos dados</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-text mb-2">Intervalo (horas)</label>
                                <input
                                    type="number"
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                    defaultValue="24"
                                    min="1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text mb-2">Retenção (dias)</label>
                                <input
                                    type="number"
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                    defaultValue="30"
                                    min="1"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Backup manual */}
                <div className="bg-surface border border-border rounded-lg p-6 mt-6">
                    <h3 className="text-lg font-medium text-text mb-4">Backup Manual</h3>
                    <div className="space-y-4">
                        <div className="flex space-x-4">
                            <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                                Fazer Backup Agora
                            </button>
                            <button className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors">
                                Restaurar Backup
                            </button>
                        </div>

                        <div className="bg-background border border-border rounded-lg p-4">
                            <h4 className="font-medium text-text mb-2">Últimos Backups</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-text">backup_2024_01_15_14_30.sql</span>
                                    <span className="text-text-secondary">15/01/2024 14:30</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-text">backup_2024_01_14_14_30.sql</span>
                                    <span className="text-text-secondary">14/01/2024 14:30</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-text">backup_2024_01_13_14_30.sql</span>
                                    <span className="text-text-secondary">13/01/2024 14:30</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Componente de configurações de usuários
const UsuariosSettings = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-text mb-4">Gerenciamento de Usuários</h2>

                {/* Lista de usuários */}
                <div className="bg-surface border border-border rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-text">Usuários do Sistema</h3>
                        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                            Novo Usuário
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-3 px-4 font-medium text-text">Nome</th>
                                    <th className="text-left py-3 px-4 font-medium text-text">Usuário</th>
                                    <th className="text-left py-3 px-4 font-medium text-text">Grupo</th>
                                    <th className="text-left py-3 px-4 font-medium text-text">Status</th>
                                    <th className="text-left py-3 px-4 font-medium text-text">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-border">
                                    <td className="py-3 px-4 text-text">Administrador</td>
                                    <td className="py-3 px-4 text-text">admin</td>
                                    <td className="py-3 px-4 text-text">Administrador</td>
                                    <td className="py-3 px-4">
                                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                            Ativo
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <button className="text-primary hover:text-primary/80 mr-2">Editar</button>
                                        <button className="text-red-500 hover:text-red-600">Excluir</button>
                                    </td>
                                </tr>
                                <tr className="border-b border-border">
                                    <td className="py-3 px-4 text-text">João Silva</td>
                                    <td className="py-3 px-4 text-text">joao</td>
                                    <td className="py-3 px-4 text-text">Operador</td>
                                    <td className="py-3 px-4">
                                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                            Ativo
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <button className="text-primary hover:text-primary/80 mr-2">Editar</button>
                                        <button className="text-red-500 hover:text-red-600">Excluir</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Componente de configurações da empresa
const EmpresaSettings = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-text mb-4">Dados da Empresa</h2>

                {/* Informações da empresa */}
                <div className="bg-surface border border-border rounded-lg p-6">
                    <h3 className="text-lg font-medium text-text mb-4">Informações Gerais</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text mb-2">Razão Social</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                defaultValue="Empresa Exemplo LTDA"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text mb-2">Nome Fantasia</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                defaultValue="Empresa Exemplo"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text mb-2">CNPJ</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                defaultValue="00.000.000/0001-00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text mb-2">Inscrição Estadual</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                defaultValue="000.000.000"
                            />
                        </div>
                    </div>
                </div>

                {/* Endereço */}
                <div className="bg-surface border border-border rounded-lg p-6 mt-6">
                    <h3 className="text-lg font-medium text-text mb-4">Endereço</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text mb-2">CEP</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                defaultValue="00000-000"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text mb-2">Estado</label>
                            <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text">
                                <option value="SP">São Paulo</option>
                                <option value="RJ">Rio de Janeiro</option>
                                <option value="MG">Minas Gerais</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text mb-2">Cidade</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                defaultValue="São Paulo"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text mb-2">Bairro</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                defaultValue="Centro"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-text mb-2">Endereço</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                defaultValue="Rua Exemplo, 123"
                            />
                        </div>
                    </div>
                </div>

                {/* Contato */}
                <div className="bg-surface border border-border rounded-lg p-6 mt-6">
                    <h3 className="text-lg font-medium text-text mb-4">Contato</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text mb-2">Telefone</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                defaultValue="(11) 0000-0000"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text mb-2">Email</label>
                            <input
                                type="email"
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text"
                                defaultValue="contato@empresa.com"
                            />
                        </div>
                    </div>
                </div>

                {/* Botões de ação */}
                <div className="flex justify-end space-x-4 mt-6">
                    <button className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors">
                        Cancelar
                    </button>
                    <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Settings 
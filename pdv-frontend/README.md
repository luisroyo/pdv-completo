# PDV Frontend - Sistema de Ponto de Venda

Frontend moderno e responsivo para o sistema PDV, desenvolvido com React e Tailwind CSS, com suporte a temas dinâmicos e modo offline.

## 🚀 Características Principais

### ✨ **Sistema de Temas Dinâmicos**
- **Temas JSON**: Configuração de cores, fontes e ícones via arquivos JSON
- **Multi-empresa**: Suporte a diferentes estabelecimentos sem alterar código
- **Temas Pré-definidos**: Padaria, Farmácia, Supermercado, etc.
- **Modo Escuro**: Suporte nativo a tema claro/escuro

### 📱 **Progressive Web App (PWA)**
- **Offline First**: Funciona sem internet
- **Cache Inteligente**: Dados importantes salvos localmente
- **Sincronização**: Dados offline sincronizados quando online
- **Instalação**: Pode ser instalado como app nativo

### 🎨 **Interface Moderna**
- **Tailwind CSS**: Estilização utilitária e responsiva
- **Componentes Reutilizáveis**: Arquitetura modular
- **Animações**: Transições suaves e feedback visual
- **Acessibilidade**: Suporte a leitores de tela

### 🔧 **Funcionalidades PDV**
- **Tela de Vendas**: Interface otimizada para vendas rápidas
- **Gestão de Caixa**: Abertura/fechamento com controle de movimentos
- **Histórico**: Relatórios e histórico de vendas
- **Configurações**: Personalização do sistema

## 🛠️ Stack Tecnológica

### **Frontend**
- **React 18**: Biblioteca principal
- **Vite**: Build tool rápido
- **Tailwind CSS**: Framework CSS utilitário
- **Zustand**: Gerenciamento de estado
- **React Router**: Navegação

### **Ícones e UI**
- **Heroicons**: Ícones SVG
- **FontAwesome**: Ícones adicionais
- **ECharts**: Gráficos e relatórios

### **Offline e PWA**
- **IndexedDB**: Armazenamento local
- **Workbox**: Service Worker
- **PWA Plugin**: Configuração automática

### **Internacionalização**
- **i18next**: Suporte a múltiplos idiomas
- **react-i18next**: Integração com React

## 📁 Estrutura do Projeto

```
pdv-frontend/
├── public/
│   ├── logos/           # Logos dos clientes
│   ├── icons/           # Ícones customizados
│   └── themes/          # Arquivos JSON de temas
├── src/
│   ├── assets/          # Estilos globais e recursos
│   ├── components/      # Componentes reutilizáveis
│   ├── modules/         # Telas principais do PDV
│   ├── services/        # Comunicação com API
│   ├── store/           # Estado global (Zustand)
│   ├── themes/          # Configurações de tema
│   ├── utils/           # Utilitários e helpers
│   ├── App.jsx          # Componente principal
│   └── main.jsx         # Ponto de entrada
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎨 Sistema de Temas

### **Estrutura do Tema JSON**
```json
{
  "name": "Nome do Tema",
  "logo": "/logos/logo.png",
  "primaryColor": "#2563eb",
  "secondaryColor": "#64748b",
  "accentColor": "#f59e0b",
  "backgroundColor": "#ffffff",
  "surfaceColor": "#f8fafc",
  "textColor": "#1e293b",
  "fontFamily": "Inter",
  "iconPack": "default"
}
```

### **Temas Disponíveis**
- **default.json**: Tema padrão do sistema
- **padaria.json**: Tema para padarias (cores quentes)
- **farmacia.json**: Tema para farmácias (cores verdes)
- **supermercado.json**: Tema para supermercados

### **Como Aplicar um Tema**
```javascript
import { useThemeStore } from './store/themeStore'

const { loadTheme } = useThemeStore()

// Carrega tema específico
await loadTheme('/themes/padaria.json')
```

## 🚀 Instalação e Execução

### **Pré-requisitos**
- Node.js 18+
- npm ou yarn

### **Instalação**
```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

### **Variáveis de Ambiente**
Crie um arquivo `.env.local`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=PDV Sistema
VITE_APP_VERSION=1.0.0
```

## 📱 Funcionalidades PDV

### **1. Tela de Vendas**
- Interface otimizada para vendas rápidas
- Atalhos de teclado (F1-F12)
- Leitura de código de barras
- Múltiplas formas de pagamento
- Display do cliente

### **2. Gestão de Caixa**
- Abertura/fechamento de caixa
- Controle de movimentos (entrada/saída)
- Relatórios de caixa
- Controle de saldo

### **3. Histórico e Relatórios**
- Histórico de vendas
- Relatórios fiscais (X, Z, Redução Z)
- Gráficos de vendas
- Exportação de dados

### **4. Configurações**
- Personalização de temas
- Configurações de hardware
- Usuários e permissões
- Backup e sincronização

## 🔧 Desenvolvimento

### **Estrutura de Componentes**
```jsx
// Exemplo de componente
import React from 'react'
import { useThemeStore } from '../store/themeStore'

const MyComponent = () => {
  const { currentTheme } = useThemeStore()
  
  return (
    <div className="bg-surface text-text">
      {/* Conteúdo do componente */}
    </div>
  )
}
```

### **Hooks Personalizados**
```javascript
// hooks/usePDV.js
import { useState, useEffect } from 'react'
import { salesService } from '../services/api'

export const usePDV = () => {
  const [sales, setSales] = useState([])
  
  const createSale = async (data) => {
    const response = await salesService.create(data)
    setSales(prev => [...prev, response.data])
    return response
  }
  
  return { sales, createSale }
}
```

### **Estilização com Tailwind**
```jsx
// Classes utilitárias do Tailwind
<div className="
  bg-primary text-white 
  hover:bg-primary/90 
  transition-colors 
  rounded-lg 
  p-4
">
  Botão com tema
</div>
```

## 📊 Estado Global (Zustand)

### **Store de Autenticação**
```javascript
const { user, isAuthenticated, login, logout } = useAuthStore()
```

### **Store de Tema**
```javascript
const { currentTheme, loadTheme, toggleDarkMode } = useThemeStore()
```

### **Store de Vendas**
```javascript
const { currentSale, addItem, finalizeSale } = useSalesStore()
```

## 🔌 Integração com Backend

### **Configuração da API**
```javascript
// services/api.js
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 30000
})
```

### **Interceptors**
- **Autenticação**: Token JWT automático
- **Refresh Token**: Renovação automática
- **Offline**: Cache e sincronização

## 📱 PWA e Offline

### **Service Worker**
- Cache de recursos estáticos
- Cache de dados da API
- Sincronização em background

### **IndexedDB**
- Armazenamento de vendas offline
- Cache de produtos
- Dados de configuração

### **Sincronização**
```javascript
// Sincroniza dados offline quando online
const syncOfflineData = async () => {
  const offlineSales = await getOfflineSales()
  await api.post('/sync/offline', offlineSales)
}
```

## 🎯 Próximos Passos

### **Funcionalidades Planejadas**
- [ ] Integração com TEF (PayGo, Sitef)
- [ ] Impressora térmica
- [ ] Balança integrada
- [ ] Scanner de código de barras
- [ ] Relatórios avançados
- [ ] Backup automático

### **Melhorias Técnicas**
- [ ] Testes automatizados
- [ ] Performance optimization
- [ ] Acessibilidade completa
- [ ] Documentação de API
- [ ] CI/CD pipeline

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte e dúvidas:
- Email: suporte@pdv.com
- Documentação: [docs.pdv.com](https://docs.pdv.com)
- Issues: [GitHub Issues](https://github.com/luisroyo/pdv-completo/issues) 
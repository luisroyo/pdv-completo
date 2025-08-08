# PDV Completo - Sistema de Ponto de Venda Fiscal

Sistema completo de PDV (Ponto de Venda) desenvolvido para atender estabelecimentos comerciais brasileiros com todas as funcionalidades fiscais obrigatórias.

## 🏗️ Arquitetura do Projeto

O projeto está organizado em duas partes principais:

```
pdv/
├── pdv-backend/          # Backend C# (.NET 8)
│   ├── PDV.sln          # Solution principal
│   ├── PDV.Core/        # Entidades e interfaces
│   ├── PDV.Infrastructure/ # Repositórios e contexto
│   ├── PDV.Application/ # Serviços de negócio
│   ├── PDV.Fiscal/      # Integrações fiscais
│   ├── PDV.API/         # API REST
│   ├── PDV.Desktop/     # Aplicação WPF
│   ├── appsettings.json # Configurações
│   ├── docker-compose.yml # PostgreSQL + PgAdmin
│   └── start-pdv.ps1    # Script de inicialização
│
├── pdv-frontend/         # Frontend React
│   ├── src/             # Código fonte React
│   ├── public/          # Assets públicos
│   ├── package.json     # Dependências
│   ├── vite.config.js   # Configuração Vite
│   ├── tailwind.config.js # Configuração Tailwind
│   └── README.md        # Documentação frontend
│
├── README.md            # Este arquivo
└── .gitignore          # Arquivos ignorados pelo Git
```

## 🚀 Características Principais

### ✅ **Backend C# (.NET 8)**
- **Clean Architecture** com separação clara de responsabilidades
- **Entity Framework Core** com suporte a PostgreSQL e SQLite
- **API REST** com autenticação JWT
- **Integração Fiscal** (NFC-e, SAT, TEF)
- **Multi-empresa** e multi-filial
- **Controle de permissões** granular
- **Aplicação Desktop** WPF com WebView2

### ✅ **Frontend React**
- **Sistema de temas dinâmicos** via JSON
- **PWA** com funcionalidade offline
- **Tailwind CSS** para estilização
- **Zustand** para gerenciamento de estado
- **Interface responsiva** para touch e teclado
- **Atalhos de teclado** otimizados para PDV

### ✅ **Funcionalidades PDV**
- **Vendas** com múltiplas formas de pagamento
- **Gestão de caixa** com controle de movimentos
- **Controle de estoque** automático
- **Relatórios fiscais** (X, Z, Redução Z)
- **Integração com hardware** (impressora, balança, scanner)
- **Modo offline** com sincronização

## 🛠️ Stack Tecnológica

### **Backend**
- **.NET 8** - Framework principal
- **Entity Framework Core** - ORM
- **PostgreSQL** - Banco principal
- **SQLite** - Banco local/offline
- **AutoMapper** - Mapeamento de objetos
- **FluentValidation** - Validações
- **JWT** - Autenticação

### **Frontend**
- **React 18** - Biblioteca principal
- **Vite** - Build tool
- **Tailwind CSS** - Framework CSS
- **Zustand** - Gerenciamento de estado
- **Axios** - Cliente HTTP
- **PWA** - Progressive Web App

### **Fiscal**
- **NFC-e** - Nota Fiscal de Consumidor Eletrônica
- **SAT** - Sistema Autenticador e Transmissor
- **TEF** - Transferência Eletrônica de Fundos
- **XML** - Geração e validação de documentos

## 📋 Pré-requisitos

### **Desenvolvimento**
- **Visual Studio 2022** ou **VS Code**
- **.NET 8 SDK**
- **Node.js 18+**
- **PostgreSQL 14+**
- **Docker** (opcional)

### **Produção**
- **Windows Server** ou **Linux**
- **PostgreSQL**
- **Certificado Digital** para emissão fiscal

## 🚀 Instalação e Configuração

### **1. Clone o repositório**
```bash
git clone https://github.com/luisroyo/pdv-completo.git
cd pdv-completo
```

### **2. Configurar Backend**
```bash
cd pdv-backend

# Instalar dependências
dotnet restore

# Configurar banco de dados
docker-compose up -d

# Executar migrações
dotnet ef database update --project PDV.Infrastructure --startup-project PDV.API

# Executar API
dotnet run --project PDV.API
```

### **3. Configurar Frontend**
```bash
cd pdv-frontend

# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev
```

### **4. Executar Desktop**
```bash
cd pdv-backend
dotnet run --project PDV.Desktop
```

## 📱 Funcionalidades por Módulo

### **🔐 Autenticação e Segurança**
- Login com usuário/senha
- Controle de permissões por grupo
- Auditoria de ações sensíveis
- Criptografia de dados sensíveis

### **🏪 Gestão de Estabelecimentos**
- Cadastro de empresas
- Múltiplas filiais
- Configurações fiscais por estado
- Logos e temas personalizados

### **📦 Gestão de Produtos**
- Cadastro com código de barras
- Categorização e subcategorias
- Controle de estoque mínimo
- Campos fiscais (NCM, CFOP, CST)

### **👥 Gestão de Clientes**
- Cadastro de CPF/CNPJ
- Endereços completos
- Histórico de compras
- Classificação de clientes

### **💰 Vendas e Caixa**
- Interface otimizada para vendas rápidas
- Múltiplas formas de pagamento
- Controle de caixa (abertura/fechamento)
- Movimentos de entrada/saída

### **📊 Relatórios e Analytics**
- Relatórios fiscais obrigatórios
- Gráficos de vendas
- Análise de produtos mais vendidos
- Exportação de dados

### **⚙️ Configurações**
- Temas dinâmicos
- Configurações de hardware
- Backup automático
- Sincronização offline

## 🔧 Configurações Específicas

### **Fiscal**
```json
{
  "NFCe": {
    "Ambiente": "Homologacao",
    "Certificado": "path/to/certificate.pfx",
    "Senha": "senha_certificado"
  },
  "SAT": {
    "Ambiente": "Homologacao",
    "CodigoAtivacao": "12345678"
  }
}
```

### **Hardware**
```json
{
  "Impressora": {
    "Porta": "COM1",
    "Modelo": "Epson TM-T20"
  },
  "Balança": {
    "Porta": "COM2",
    "Protocolo": "Toledo"
  }
}
```

## 🧪 Testes

### **Backend**
```bash
cd pdv-backend
dotnet test
```

### **Frontend**
```bash
cd pdv-frontend
npm run test
```

## 📦 Deploy

### **Backend**
```bash
cd pdv-backend
dotnet publish PDV.API -c Release -o ./publish
```

### **Frontend**
```bash
cd pdv-frontend
npm run build
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- **Email**: suporte@pdv.com
- **Documentação**: [docs.pdv.com](https://docs.pdv.com)
- **Issues**: [GitHub Issues](https://github.com/luisroyo/pdv-completo/issues)

## 🎯 Roadmap

### **Versão 1.0** ✅
- [x] Estrutura base do projeto
- [x] Autenticação e autorização
- [x] CRUD básico de entidades
- [x] Interface de vendas
- [x] Sistema de temas

### **Versão 1.1** 🚧
- [ ] Integração NFC-e
- [ ] Integração SAT
- [ ] Integração TEF
- [ ] Impressora térmica
- [ ] Balança integrada

### **Versão 1.2** 📋
- [ ] Relatórios avançados
- [ ] Backup automático
- [ ] Sincronização offline
- [ ] App mobile
- [ ] Integração com ERPs

---

**Desenvolvido com ❤️ para o mercado brasileiro** 
# PDV Fiscal - Sistema de Ponto de Venda

Sistema completo de PDV (Ponto de Venda) desenvolvido para atender às exigências fiscais brasileiras, com suporte a NFC-e, SAT, TEF e controle completo de vendas.

## 🚀 Características Principais

### ⚙️ Stack Tecnológica
- **Backend**: C# com .NET 8
- **Interface**: HTML/CSS/JS embutida via WebView2
- **Banco Principal**: PostgreSQL
- **Banco Local**: SQLite (modo offline)
- **Comunicação**: API REST interna (localhost)

### 🧾 Funcionalidades Obrigatórias
- ✅ Cadastro de produtos com campos fiscais (CFOP, NCM, CST, CEST)
- ✅ Cadastro de clientes (CPF/CNPJ)
- ✅ Cadastro de usuários e permissões
- ✅ Emissão de NFC-e com integração SEFAZ
- ✅ Integração com SAT Fiscal (SP)
- ✅ Integração com TEF (PayGo, Sitef)
- ✅ Suporte a impressora térmica e balança
- ✅ Controle de caixa (abertura/fechamento)
- ✅ Relatórios fiscais (X, Z, Redução Z)
- ✅ Modo contingência offline
- ✅ Cancelamento de vendas
- ✅ Controle de estoque automático
- ✅ Múltiplos pagamentos
- ✅ Cupons promocionais
- ✅ Backup automático

### 🔐 Segurança
- ✅ Controle de acesso com login/senha
- ✅ Logs de auditoria
- ✅ Criptografia de dados sensíveis
- ✅ Atualização automática com rollback

## 📁 Estrutura do Projeto

```
pdv/
├── src/
│   ├── PDV.Core/                 # Entidades e interfaces
│   ├── PDV.Infrastructure/       # Entity Framework e repositórios
│   ├── PDV.Application/          # Serviços de negócio
│   ├── PDV.Fiscal/              # Integração fiscal (NFC-e, SAT)
│   ├── PDV.API/                 # API REST
│   └── PDV.Desktop/             # Aplicação desktop com WebView2
├── tests/
│   └── PDV.Tests/               # Testes automatizados
├── appsettings.json             # Configurações
└── README.md                    # Documentação
```

## 🛠️ Instalação e Configuração

### Pré-requisitos
- .NET 8 SDK
- PostgreSQL (opcional, SQLite é usado por padrão)
- WebView2 Runtime (Windows)

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/pdv-fiscal.git
cd pdv-fiscal
```

### 2. Restaurar dependências
```bash
dotnet restore
```

### 3. Configurar banco de dados
Edite o arquivo `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=pdv.db",
    "PostgreSQL": "Host=localhost;Database=pdv;Username=postgres;Password=sua_senha"
  }
}
```

### 4. Executar migrações
```bash
cd src/PDV.API
dotnet ef database update
```

### 5. Executar o sistema
```bash
# Executar API
cd src/PDV.API
dotnet run

# Em outro terminal, executar desktop
cd src/PDV.Desktop
dotnet run
```

## 📋 Configuração Fiscal

### NFC-e
1. Configure o certificado digital no `appsettings.json`
2. Defina o número de série da NFC-e
3. Configure CSC e tokens da SEFAZ

### SAT (São Paulo)
1. Configure o código de ativação
2. Defina o número de série do SAT

### TEF
1. Configure o provedor (PayGo, Sitef)
2. Defina as configurações específicas

## 🔧 Desenvolvimento

### Estrutura de Camadas

#### Core (PDV.Core)
- **Entidades**: Empresa, Filial, Usuario, Produto, Cliente, Venda, etc.
- **Interfaces**: IRepository, IUnitOfWork
- **Enums**: StatusVenda, TipoPagamento, etc.

#### Infrastructure (PDV.Infrastructure)
- **DbContext**: PDVDbContext com configurações PostgreSQL/SQLite
- **Repositórios**: Implementações dos repositórios
- **UnitOfWork**: Gerenciamento de transações

#### Application (PDV.Application)
- **Serviços**: VendaService, ProdutoService, etc.
- **Validações**: FluentValidation
- **Mapeamentos**: AutoMapper

#### Fiscal (PDV.Fiscal)
- **NFCeService**: Emissão e cancelamento de NFC-e
- **SATService**: Integração com SAT
- **TEFService**: Integração com TEF

#### API (PDV.API)
- **Controllers**: VendasController, ProdutosController, etc.
- **Configuração**: Program.cs com DI e CORS

#### Desktop (PDV.Desktop)
- **MainWindow**: Interface principal com WebView2
- **App**: Configuração do WPF

### Padrões Utilizados
- **Clean Architecture**: Separação clara de responsabilidades
- **Repository Pattern**: Abstração do acesso a dados
- **Unit of Work**: Gerenciamento de transações
- **Dependency Injection**: Inversão de controle
- **CQRS**: Separação de comandos e consultas

## 📊 Funcionalidades por Módulo

### Módulo de Vendas
- Criação de vendas
- Adição de itens
- Aplicação de descontos
- Múltiplos pagamentos
- Finalização com NFC-e
- Cancelamento com justificativa

### Módulo Fiscal
- Emissão de NFC-e
- Cancelamento de NFC-e
- Integração SAT (SP)
- Modo contingência
- Validação de XML
- Geração de DANFE

### Módulo de Produtos
- Cadastro com campos fiscais
- Controle de estoque
- Categorização
- Preços e promoções
- Códigos de barras

### Módulo de Clientes
- Cadastro CPF/CNPJ
- Endereços
- Limite de crédito
- Histórico de compras

### Módulo de Caixa
- Abertura/fechamento
- Sangrias e suprimentos
- Controle de saldo
- Relatórios

### Módulo de Relatórios
- Relatório X (vendas do dia)
- Relatório Z (fechamento)
- Redução Z
- Vendas por CFOP/NCM
- Estoque
- Clientes

## 🔒 Segurança e Auditoria

### Controle de Acesso
- Login com usuário/senha
- Controle de permissões por módulo
- Sessões seguras
- Logout automático

### Logs de Auditoria
- Todas as operações são logadas
- Logs de vendas, cancelamentos, aberturas de caixa
- Logs de acesso e tentativas de login
- Logs de operações fiscais

### Criptografia
- Senhas criptografadas
- Dados sensíveis criptografados
- Backup criptografado
- Comunicação segura

## 🚀 Deploy e Produção

### Requisitos de Produção
- Windows Server 2019+
- .NET 8 Runtime
- PostgreSQL 13+
- WebView2 Runtime
- Certificado digital válido
- Impressora térmica configurada

### Backup
- Backup automático diário
- Backup criptografado
- Envio para nuvem
- Restauração automática

### Monitoramento
- Logs estruturados
- Métricas de performance
- Alertas de erro
- Dashboard de status

## 📝 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte técnico ou dúvidas:
- Email: suporte@pdv-fiscal.com
- Documentação: [docs.pdv-fiscal.com](https://docs.pdv-fiscal.com)
- Issues: [GitHub Issues](https://github.com/seu-usuario/pdv-fiscal/issues)

## 🔄 Changelog

### v1.0.0 (2024-01-01)
- ✅ Versão inicial do sistema
- ✅ Módulo de vendas completo
- ✅ Integração NFC-e
- ✅ Controle de caixa
- ✅ Interface WebView2
- ✅ Backup automático 
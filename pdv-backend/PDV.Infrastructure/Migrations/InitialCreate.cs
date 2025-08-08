using Microsoft.EntityFrameworkCore.Migrations;

namespace PDV.Infrastructure.Migrations;

public partial class InitialCreate : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // Criar schema
        migrationBuilder.EnsureSchema(name: "pdv");

        // Tabela Empresas
        migrationBuilder.CreateTable(
            name: "Empresas",
            schema: "pdv",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                CNPJ = table.Column<string>(type: "character varying(18)", maxLength: 18, nullable: false),
                RazaoSocial = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                NomeFantasia = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                InscricaoEstadual = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                InscricaoMunicipal = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                Endereco = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                Numero = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                Complemento = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                Bairro = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                Cidade = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                UF = table.Column<string>(type: "character varying(2)", maxLength: 2, nullable: true),
                CEP = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                Telefone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                Email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                Site = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                NumeroSerieNFCe = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                NumeroSerieSAT = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                DataCriacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                DataAtualizacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Empresas", x => x.Id);
            });

        migrationBuilder.CreateIndex(
            name: "IX_Empresas_CNPJ",
            schema: "pdv",
            table: "Empresas",
            column: "CNPJ",
            unique: true);

        // Tabela Filiais
        migrationBuilder.CreateTable(
            name: "Filiais",
            schema: "pdv",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                EmpresaId = table.Column<Guid>(type: "uuid", nullable: false),
                Nome = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                Endereco = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                Telefone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                Responsavel = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                Ativo = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                DataCriacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                DataAtualizacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Filiais", x => x.Id);
                table.ForeignKey(
                    name: "FK_Filiais_Empresas_EmpresaId",
                    column: x => x.EmpresaId,
                    principalSchema: "pdv",
                    principalTable: "Empresas",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Restrict);
            });

        migrationBuilder.CreateIndex(
            name: "IX_Filiais_EmpresaId",
            schema: "pdv",
            table: "Filiais",
            column: "EmpresaId");

        // Tabela GruposPermissao
        migrationBuilder.CreateTable(
            name: "GruposPermissao",
            schema: "pdv",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                Nome = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                Descricao = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                Ativo = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                DataCriacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                DataAtualizacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_GruposPermissao", x => x.Id);
            });

        // Tabela Permissoes
        migrationBuilder.CreateTable(
            name: "Permissoes",
            schema: "pdv",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                GrupoPermissaoId = table.Column<Guid>(type: "uuid", nullable: false),
                Nome = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                Descricao = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                Ativo = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                DataCriacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                DataAtualizacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Permissoes", x => x.Id);
                table.ForeignKey(
                    name: "FK_Permissoes_GruposPermissao_GrupoPermissaoId",
                    column: x => x.GrupoPermissaoId,
                    principalSchema: "pdv",
                    principalTable: "GruposPermissao",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Restrict);
            });

        migrationBuilder.CreateIndex(
            name: "IX_Permissoes_GrupoPermissaoId",
            schema: "pdv",
            table: "Permissoes",
            column: "GrupoPermissaoId");

        // Tabela Usuarios
        migrationBuilder.CreateTable(
            name: "Usuarios",
            schema: "pdv",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                EmpresaId = table.Column<Guid>(type: "uuid", nullable: false),
                FilialId = table.Column<Guid>(type: "uuid", nullable: true),
                Login = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                Senha = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                Nome = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                Email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                Telefone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                Ativo = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                DataUltimoAcesso = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                DataCriacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                DataAtualizacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Usuarios", x => x.Id);
                table.ForeignKey(
                    name: "FK_Usuarios_Empresas_EmpresaId",
                    column: x => x.EmpresaId,
                    principalSchema: "pdv",
                    principalTable: "Empresas",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Restrict);
                table.ForeignKey(
                    name: "FK_Usuarios_Filiais_FilialId",
                    column: x => x.FilialId,
                    principalSchema: "pdv",
                    principalTable: "Filiais",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Restrict);
            });

        migrationBuilder.CreateIndex(
            name: "IX_Usuarios_EmpresaId",
            schema: "pdv",
            table: "Usuarios",
            column: "EmpresaId");

        migrationBuilder.CreateIndex(
            name: "IX_Usuarios_FilialId",
            schema: "pdv",
            table: "Usuarios",
            column: "FilialId");

        migrationBuilder.CreateIndex(
            name: "IX_Usuarios_Login",
            schema: "pdv",
            table: "Usuarios",
            column: "Login",
            unique: true);

        // Tabela CategoriasProduto
        migrationBuilder.CreateTable(
            name: "CategoriasProduto",
            schema: "pdv",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                CategoriaPaiId = table.Column<Guid>(type: "uuid", nullable: true),
                Nome = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                Descricao = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                Ativo = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                DataCriacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                DataAtualizacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_CategoriasProduto", x => x.Id);
                table.ForeignKey(
                    name: "FK_CategoriasProduto_CategoriasProduto_CategoriaPaiId",
                    column: x => x.CategoriaPaiId,
                    principalSchema: "pdv",
                    principalTable: "CategoriasProduto",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Restrict);
            });

        migrationBuilder.CreateIndex(
            name: "IX_CategoriasProduto_CategoriaPaiId",
            schema: "pdv",
            table: "CategoriasProduto",
            column: "CategoriaPaiId");

        // Tabela Produtos
        migrationBuilder.CreateTable(
            name: "Produtos",
            schema: "pdv",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                FilialId = table.Column<Guid>(type: "uuid", nullable: false),
                CategoriaId = table.Column<Guid>(type: "uuid", nullable: true),
                Codigo = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                CodigoBarras = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                Nome = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                Descricao = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                PrecoCusto = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                PrecoVenda = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                EstoqueMinimo = table.Column<decimal>(type: "decimal(18,3)", precision: 18, scale: 3, nullable: false, defaultValue: 0m),
                EstoqueAtual = table.Column<decimal>(type: "decimal(18,3)", precision: 18, scale: 3, nullable: false, defaultValue: 0m),
                UnidadeMedida = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false, defaultValue: "UN"),
                Peso = table.Column<decimal>(type: "decimal(18,3)", precision: 18, scale: 3, nullable: true),
                Altura = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                Largura = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                Comprimento = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                CFOP = table.Column<string>(type: "character varying(4)", maxLength: 4, nullable: false),
                NCM = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: false),
                CST = table.Column<string>(type: "character varying(3)", maxLength: 3, nullable: false),
                CEST = table.Column<string>(type: "character varying(7)", maxLength: 7, nullable: true),
                AliquotaICMS = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: false, defaultValue: 0m),
                AliquotaPIS = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: false, defaultValue: 0m),
                AliquotaCOFINS = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: false, defaultValue: 0m),
                Ativo = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                DataCriacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                DataAtualizacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Produtos", x => x.Id);
                table.ForeignKey(
                    name: "FK_Produtos_CategoriasProduto_CategoriaId",
                    column: x => x.CategoriaId,
                    principalSchema: "pdv",
                    principalTable: "CategoriasProduto",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Restrict);
                table.ForeignKey(
                    name: "FK_Produtos_Filiais_FilialId",
                    column: x => x.FilialId,
                    principalSchema: "pdv",
                    principalTable: "Filiais",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Restrict);
            });

        migrationBuilder.CreateIndex(
            name: "IX_Produtos_CategoriaId",
            schema: "pdv",
            table: "Produtos",
            column: "CategoriaId");

        migrationBuilder.CreateIndex(
            name: "IX_Produtos_FilialId",
            schema: "pdv",
            table: "Produtos",
            column: "FilialId");

        migrationBuilder.CreateIndex(
            name: "IX_Produtos_Codigo_FilialId",
            schema: "pdv",
            table: "Produtos",
            columns: new[] { "Codigo", "FilialId" },
            unique: true);

        migrationBuilder.CreateIndex(
            name: "IX_Produtos_CodigoBarras_FilialId",
            schema: "pdv",
            table: "Produtos",
            columns: new[] { "CodigoBarras", "FilialId" },
            unique: true,
            filter: "\"CodigoBarras\" IS NOT NULL");

        // Tabela Clientes
        migrationBuilder.CreateTable(
            name: "Clientes",
            schema: "pdv",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                Documento = table.Column<string>(type: "character varying(18)", maxLength: 18, nullable: false),
                Nome = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                NomeFantasia = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                Email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                Telefone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                Celular = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                Endereco = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                Numero = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                Complemento = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                Bairro = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                Cidade = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                UF = table.Column<string>(type: "character varying(2)", maxLength: 2, nullable: true),
                CEP = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                DataNascimento = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                Sexo = table.Column<string>(type: "character varying(1)", maxLength: 1, nullable: true),
                Observacoes = table.Column<string>(type: "text", nullable: true),
                Ativo = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                DataCriacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                DataAtualizacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Clientes", x => x.Id);
            });

        migrationBuilder.CreateIndex(
            name: "IX_Clientes_Documento",
            schema: "pdv",
            table: "Clientes",
            column: "Documento",
            unique: true);

        // Tabela Caixas
        migrationBuilder.CreateTable(
            name: "Caixas",
            schema: "pdv",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                FilialId = table.Column<Guid>(type: "uuid", nullable: false),
                Nome = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                Descricao = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                Ativo = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                DataCriacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                DataAtualizacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Caixas", x => x.Id);
                table.ForeignKey(
                    name: "FK_Caixas_Filiais_FilialId",
                    column: x => x.FilialId,
                    principalSchema: "pdv",
                    principalTable: "Filiais",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Restrict);
            });

        migrationBuilder.CreateIndex(
            name: "IX_Caixas_FilialId",
            schema: "pdv",
            table: "Caixas",
            column: "FilialId");

        // Tabela MovimentosCaixa
        migrationBuilder.CreateTable(
            name: "MovimentosCaixa",
            schema: "pdv",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                CaixaId = table.Column<Guid>(type: "uuid", nullable: false),
                UsuarioId = table.Column<Guid>(type: "uuid", nullable: false),
                Tipo = table.Column<int>(type: "integer", nullable: false),
                Valor = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                Descricao = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                Observacoes = table.Column<string>(type: "text", nullable: true),
                DataMovimento = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                DataCriacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                DataAtualizacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_MovimentosCaixa", x => x.Id);
                table.ForeignKey(
                    name: "FK_MovimentosCaixa_Caixas_CaixaId",
                    column: x => x.CaixaId,
                    principalSchema: "pdv",
                    principalTable: "Caixas",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Restrict);
                table.ForeignKey(
                    name: "FK_MovimentosCaixa_Usuarios_UsuarioId",
                    column: x => x.UsuarioId,
                    principalSchema: "pdv",
                    principalTable: "Usuarios",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Restrict);
            });

        migrationBuilder.CreateIndex(
            name: "IX_MovimentosCaixa_CaixaId",
            schema: "pdv",
            table: "MovimentosCaixa",
            column: "CaixaId");

        migrationBuilder.CreateIndex(
            name: "IX_MovimentosCaixa_UsuarioId",
            schema: "pdv",
            table: "MovimentosCaixa",
            column: "UsuarioId");

        // Tabela Vendas
        migrationBuilder.CreateTable(
            name: "Vendas",
            schema: "pdv",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                CaixaId = table.Column<Guid>(type: "uuid", nullable: false),
                UsuarioId = table.Column<Guid>(type: "uuid", nullable: false),
                ClienteId = table.Column<Guid>(type: "uuid", nullable: true),
                NumeroVenda = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                DataVenda = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                SubTotal = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                Desconto = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false, defaultValue: 0m),
                Total = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                Status = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                Observacoes = table.Column<string>(type: "text", nullable: true),
                // Campos fiscais NFC-e
                StatusNFCe = table.Column<int>(type: "integer", nullable: true),
                NumeroNFCe = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                ChaveAcessoNFCe = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                ProtocoloNFCe = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                DataEmissaoNFCe = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                XMLNFCe = table.Column<string>(type: "text", nullable: true),
                DANFENFCe = table.Column<string>(type: "text", nullable: true),
                // Campos fiscais SAT
                StatusSAT = table.Column<int>(type: "integer", nullable: true),
                NumeroSAT = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                ChaveAcessoSAT = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                ProtocoloSAT = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                DataEmissaoSAT = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                XMLSAT = table.Column<string>(type: "text", nullable: true),
                DANFESAT = table.Column<string>(type: "text", nullable: true),
                DataCriacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                DataAtualizacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Vendas", x => x.Id);
                table.ForeignKey(
                    name: "FK_Vendas_Caixas_CaixaId",
                    column: x => x.CaixaId,
                    principalSchema: "pdv",
                    principalTable: "Caixas",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Restrict);
                table.ForeignKey(
                    name: "FK_Vendas_Clientes_ClienteId",
                    column: x => x.ClienteId,
                    principalSchema: "pdv",
                    principalTable: "Clientes",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Restrict);
                table.ForeignKey(
                    name: "FK_Vendas_Usuarios_UsuarioId",
                    column: x => x.UsuarioId,
                    principalSchema: "pdv",
                    principalTable: "Usuarios",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Restrict);
            });

        migrationBuilder.CreateIndex(
            name: "IX_Vendas_CaixaId",
            schema: "pdv",
            table: "Vendas",
            column: "CaixaId");

        migrationBuilder.CreateIndex(
            name: "IX_Vendas_ClienteId",
            schema: "pdv",
            table: "Vendas",
            column: "ClienteId");

        migrationBuilder.CreateIndex(
            name: "IX_Vendas_UsuarioId",
            schema: "pdv",
            table: "Vendas",
            column: "UsuarioId");

        migrationBuilder.CreateIndex(
            name: "IX_Vendas_NumeroVenda_CaixaId",
            schema: "pdv",
            table: "Vendas",
            columns: new[] { "NumeroVenda", "CaixaId" },
            unique: true);

        // Tabela ItensVenda
        migrationBuilder.CreateTable(
            name: "ItensVenda",
            schema: "pdv",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                VendaId = table.Column<Guid>(type: "uuid", nullable: false),
                ProdutoId = table.Column<Guid>(type: "uuid", nullable: false),
                CodigoProduto = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                NomeProduto = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                Quantidade = table.Column<decimal>(type: "decimal(18,3)", precision: 18, scale: 3, nullable: false),
                PrecoUnitario = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                PrecoTotal = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                Desconto = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false, defaultValue: 0m),
                CFOP = table.Column<string>(type: "character varying(4)", maxLength: 4, nullable: false),
                NCM = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: false),
                CST = table.Column<string>(type: "character varying(3)", maxLength: 3, nullable: false),
                AliquotaICMS = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: false, defaultValue: 0m),
                DataCriacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                DataAtualizacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_ItensVenda", x => x.Id);
                table.ForeignKey(
                    name: "FK_ItensVenda_Produtos_ProdutoId",
                    column: x => x.ProdutoId,
                    principalSchema: "pdv",
                    principalTable: "Produtos",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Restrict);
                table.ForeignKey(
                    name: "FK_ItensVenda_Vendas_VendaId",
                    column: x => x.VendaId,
                    principalSchema: "pdv",
                    principalTable: "Vendas",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateIndex(
            name: "IX_ItensVenda_ProdutoId",
            schema: "pdv",
            table: "ItensVenda",
            column: "ProdutoId");

        migrationBuilder.CreateIndex(
            name: "IX_ItensVenda_VendaId",
            schema: "pdv",
            table: "ItensVenda",
            column: "VendaId");

        // Tabela PagamentosVenda
        migrationBuilder.CreateTable(
            name: "PagamentosVenda",
            schema: "pdv",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                VendaId = table.Column<Guid>(type: "uuid", nullable: false),
                FormaPagamento = table.Column<int>(type: "integer", nullable: false),
                Valor = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                Parcelas = table.Column<int>(type: "integer", nullable: false, defaultValue: 1),
                Observacoes = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                DataCriacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                DataAtualizacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_PagamentosVenda", x => x.Id);
                table.ForeignKey(
                    name: "FK_PagamentosVenda_Vendas_VendaId",
                    column: x => x.VendaId,
                    principalSchema: "pdv",
                    principalTable: "Vendas",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateIndex(
            name: "IX_PagamentosVenda_VendaId",
            schema: "pdv",
            table: "PagamentosVenda",
            column: "VendaId");

        // Tabela CuponsDesconto
        migrationBuilder.CreateTable(
            name: "CuponsDesconto",
            schema: "pdv",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                Codigo = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                Descricao = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                TipoDesconto = table.Column<int>(type: "integer", nullable: false),
                ValorDesconto = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                PercentualDesconto = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: false),
                ValorMinimo = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                DataInicio = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                DataFim = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                QuantidadeMaxima = table.Column<int>(type: "integer", nullable: true),
                QuantidadeUsada = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                Ativo = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                DataCriacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                DataAtualizacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_CuponsDesconto", x => x.Id);
            });

        migrationBuilder.CreateIndex(
            name: "IX_CuponsDesconto_Codigo",
            schema: "pdv",
            table: "CuponsDesconto",
            column: "Codigo",
            unique: true);

        // Tabela NotasFiscais
        migrationBuilder.CreateTable(
            name: "NotasFiscais",
            schema: "pdv",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                Numero = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                Serie = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                Tipo = table.Column<int>(type: "integer", nullable: false),
                CNPJEmitente = table.Column<string>(type: "character varying(18)", maxLength: 18, nullable: false),
                NomeEmitente = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                CNPJDestinatario = table.Column<string>(type: "character varying(18)", maxLength: 18, nullable: true),
                NomeDestinatario = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                DataEmissao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                ValorTotal = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                Status = table.Column<int>(type: "integer", nullable: false),
                XML = table.Column<string>(type: "text", nullable: true),
                DataCriacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                DataAtualizacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_NotasFiscais", x => x.Id);
            });

        // Tabela MovimentosEstoque
        migrationBuilder.CreateTable(
            name: "MovimentosEstoque",
            schema: "pdv",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                ProdutoId = table.Column<Guid>(type: "uuid", nullable: false),
                UsuarioId = table.Column<Guid>(type: "uuid", nullable: false),
                VendaId = table.Column<Guid>(type: "uuid", nullable: true),
                NotaFiscalId = table.Column<Guid>(type: "uuid", nullable: true),
                Tipo = table.Column<int>(type: "integer", nullable: false),
                Quantidade = table.Column<decimal>(type: "decimal(18,3)", precision: 18, scale: 3, nullable: false),
                QuantidadeAnterior = table.Column<decimal>(type: "decimal(18,3)", precision: 18, scale: 3, nullable: false),
                QuantidadeAtual = table.Column<decimal>(type: "decimal(18,3)", precision: 18, scale: 3, nullable: false),
                Observacoes = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                DataMovimento = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                DataCriacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                DataAtualizacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_MovimentosEstoque", x => x.Id);
                table.ForeignKey(
                    name: "FK_MovimentosEstoque_NotasFiscais_NotaFiscalId",
                    column: x => x.NotaFiscalId,
                    principalSchema: "pdv",
                    principalTable: "NotasFiscais",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Restrict);
                table.ForeignKey(
                    name: "FK_MovimentosEstoque_Produtos_ProdutoId",
                    column: x => x.ProdutoId,
                    principalSchema: "pdv",
                    principalTable: "Produtos",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Restrict);
                table.ForeignKey(
                    name: "FK_MovimentosEstoque_Usuarios_UsuarioId",
                    column: x => x.UsuarioId,
                    principalSchema: "pdv",
                    principalTable: "Usuarios",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Restrict);
                table.ForeignKey(
                    name: "FK_MovimentosEstoque_Vendas_VendaId",
                    column: x => x.VendaId,
                    principalSchema: "pdv",
                    principalTable: "Vendas",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Restrict);
            });

        migrationBuilder.CreateIndex(
            name: "IX_MovimentosEstoque_NotaFiscalId",
            schema: "pdv",
            table: "MovimentosEstoque",
            column: "NotaFiscalId");

        migrationBuilder.CreateIndex(
            name: "IX_MovimentosEstoque_ProdutoId",
            schema: "pdv",
            table: "MovimentosEstoque",
            column: "ProdutoId");

        migrationBuilder.CreateIndex(
            name: "IX_MovimentosEstoque_UsuarioId",
            schema: "pdv",
            table: "MovimentosEstoque",
            column: "UsuarioId");

        migrationBuilder.CreateIndex(
            name: "IX_MovimentosEstoque_VendaId",
            schema: "pdv",
            table: "MovimentosEstoque",
            column: "VendaId");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(
            name: "MovimentosEstoque",
            schema: "pdv");

        migrationBuilder.DropTable(
            name: "PagamentosVenda",
            schema: "pdv");

        migrationBuilder.DropTable(
            name: "ItensVenda",
            schema: "pdv");

        migrationBuilder.DropTable(
            name: "MovimentosCaixa",
            schema: "pdv");

        migrationBuilder.DropTable(
            name: "CuponsDesconto",
            schema: "pdv");

        migrationBuilder.DropTable(
            name: "NotasFiscais",
            schema: "pdv");

        migrationBuilder.DropTable(
            name: "Vendas",
            schema: "pdv");

        migrationBuilder.DropTable(
            name: "Caixas",
            schema: "pdv");

        migrationBuilder.DropTable(
            name: "Clientes",
            schema: "pdv");

        migrationBuilder.DropTable(
            name: "Produtos",
            schema: "pdv");

        migrationBuilder.DropTable(
            name: "Permissoes",
            schema: "pdv");

        migrationBuilder.DropTable(
            name: "Usuarios",
            schema: "pdv");

        migrationBuilder.DropTable(
            name: "CategoriasProduto",
            schema: "pdv");

        migrationBuilder.DropTable(
            name: "Filiais",
            schema: "pdv");

        migrationBuilder.DropTable(
            name: "GruposPermissao",
            schema: "pdv");

        migrationBuilder.DropTable(
            name: "Empresas",
            schema: "pdv");
    }
} 
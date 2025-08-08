using Microsoft.EntityFrameworkCore;
using PDV.Core.Entities;

namespace PDV.Infrastructure.Data;

public class PDVDbContext : DbContext
{
    public PDVDbContext(DbContextOptions<PDVDbContext> options) : base(options)
    {
    }

    // DbSets
    public DbSet<Empresa> Empresas { get; set; }
    public DbSet<Filial> Filiais { get; set; }
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Permissao> Permissoes { get; set; }
    public DbSet<GrupoPermissao> GruposPermissao { get; set; }
    public DbSet<Produto> Produtos { get; set; }
    public DbSet<CategoriaProduto> CategoriasProduto { get; set; }
    public DbSet<Cliente> Clientes { get; set; }
    public DbSet<Caixa> Caixas { get; set; }
    public DbSet<MovimentoCaixa> MovimentosCaixa { get; set; }
    public DbSet<Venda> Vendas { get; set; }
    public DbSet<ItemVenda> ItensVenda { get; set; }
    public DbSet<PagamentoVenda> PagamentosVenda { get; set; }
    public DbSet<CupomDesconto> CuponsDesconto { get; set; }
    public DbSet<MovimentoEstoque> MovimentosEstoque { get; set; }
    public DbSet<NotaFiscal> NotasFiscais { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configurações específicas para PostgreSQL
        if (Database.IsNpgsql())
        {
            // Configurações específicas do PostgreSQL
            modelBuilder.HasDefaultSchema("pdv");
        }

        // Configurações de entidades
        ConfigureEmpresa(modelBuilder);
        ConfigureFilial(modelBuilder);
        ConfigureUsuario(modelBuilder);
        ConfigureProduto(modelBuilder);
        ConfigureCliente(modelBuilder);
        ConfigureCaixa(modelBuilder);
        ConfigureVenda(modelBuilder);
        ConfigureMovimentoEstoque(modelBuilder);
    }

    private void ConfigureEmpresa(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Empresa>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.CNPJ).HasMaxLength(18).IsRequired();
            entity.HasIndex(e => e.CNPJ).IsUnique();
            entity.Property(e => e.RazaoSocial).HasMaxLength(100).IsRequired();
            entity.Property(e => e.NomeFantasia).HasMaxLength(100).IsRequired();
        });
    }

    private void ConfigureFilial(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Filial>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Nome).HasMaxLength(100).IsRequired();
            entity.HasOne(e => e.Empresa)
                  .WithMany(e => e.Filiais)
                  .HasForeignKey(e => e.EmpresaId)
                  .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private void ConfigureUsuario(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Login).HasMaxLength(50).IsRequired();
            entity.HasIndex(e => e.Login).IsUnique();
            entity.Property(e => e.Senha).HasMaxLength(255).IsRequired();
            entity.HasOne(e => e.Empresa)
                  .WithMany(e => e.Usuarios)
                  .HasForeignKey(e => e.EmpresaId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Filial)
                  .WithMany()
                  .HasForeignKey(e => e.FilialId)
                  .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private void ConfigureProduto(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Produto>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Codigo).HasMaxLength(50).IsRequired();
            entity.HasIndex(e => new { e.Codigo, e.FilialId }).IsUnique();
            entity.Property(e => e.CodigoBarras).HasMaxLength(50);
            entity.HasIndex(e => new { e.CodigoBarras, e.FilialId }).IsUnique();
            entity.Property(e => e.Nome).HasMaxLength(100).IsRequired();
            entity.Property(e => e.CFOP).HasMaxLength(4).IsRequired();
            entity.Property(e => e.NCM).HasMaxLength(8).IsRequired();
            entity.Property(e => e.CST).HasMaxLength(3).IsRequired();
            entity.Property(e => e.CEST).HasMaxLength(7);
            entity.HasOne(e => e.Filial)
                  .WithMany(e => e.Produtos)
                  .HasForeignKey(e => e.FilialId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Categoria)
                  .WithMany(e => e.Produtos)
                  .HasForeignKey(e => e.CategoriaId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<CategoriaProduto>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Nome).HasMaxLength(100).IsRequired();
            entity.HasOne(e => e.CategoriaPai)
                  .WithMany(e => e.Subcategorias)
                  .HasForeignKey(e => e.CategoriaPaiId)
                  .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private void ConfigureCliente(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Documento).HasMaxLength(18).IsRequired();
            entity.HasIndex(e => e.Documento).IsUnique();
            entity.Property(e => e.Nome).HasMaxLength(100).IsRequired();
        });
    }

    private void ConfigureCaixa(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Caixa>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Nome).HasMaxLength(50).IsRequired();
            entity.HasOne(e => e.Filial)
                  .WithMany(e => e.Caixas)
                  .HasForeignKey(e => e.FilialId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.UsuarioAbertura)
                  .WithMany()
                  .HasForeignKey(e => e.UsuarioAberturaId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.UsuarioFechamento)
                  .WithMany()
                  .HasForeignKey(e => e.UsuarioFechamentoId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<MovimentoCaixa>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Caixa)
                  .WithMany(e => e.Movimentos)
                  .HasForeignKey(e => e.CaixaId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Usuario)
                  .WithMany()
                  .HasForeignKey(e => e.UsuarioId)
                  .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private void ConfigureVenda(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Venda>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.NumeroVenda).HasMaxLength(20).IsRequired();
            entity.HasIndex(e => new { e.NumeroVenda, e.CaixaId }).IsUnique();
            entity.HasOne(e => e.Caixa)
                  .WithMany(e => e.Vendas)
                  .HasForeignKey(e => e.CaixaId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Usuario)
                  .WithMany()
                  .HasForeignKey(e => e.UsuarioId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Cliente)
                  .WithMany(e => e.Vendas)
                  .HasForeignKey(e => e.ClienteId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<ItemVenda>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Venda)
                  .WithMany(e => e.Itens)
                  .HasForeignKey(e => e.VendaId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Produto)
                  .WithMany(e => e.ItensVenda)
                  .HasForeignKey(e => e.ProdutoId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<PagamentoVenda>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Venda)
                  .WithMany(e => e.Pagamentos)
                  .HasForeignKey(e => e.VendaId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private void ConfigureMovimentoEstoque(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<MovimentoEstoque>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Produto)
                  .WithMany(e => e.MovimentosEstoque)
                  .HasForeignKey(e => e.ProdutoId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Usuario)
                  .WithMany()
                  .HasForeignKey(e => e.UsuarioId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Venda)
                  .WithMany()
                  .HasForeignKey(e => e.VendaId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.NotaFiscal)
                  .WithMany(e => e.MovimentosEstoque)
                  .HasForeignKey(e => e.NotaFiscalId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<NotaFiscal>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Numero).HasMaxLength(20).IsRequired();
            entity.Property(e => e.Serie).HasMaxLength(20).IsRequired();
            entity.Property(e => e.CNPJEmitente).HasMaxLength(18).IsRequired();
            entity.Property(e => e.NomeEmitente).HasMaxLength(100).IsRequired();
        });
    }
} 
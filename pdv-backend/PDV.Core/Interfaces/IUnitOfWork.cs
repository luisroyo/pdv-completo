namespace PDV.Core.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IRepository<Empresa> Empresas { get; }
    IRepository<Filial> Filiais { get; }
    IRepository<Usuario> Usuarios { get; }
    IRepository<Produto> Produtos { get; }
    IRepository<Cliente> Clientes { get; }
    IRepository<Caixa> Caixas { get; }
    IRepository<Venda> Vendas { get; }
    IRepository<MovimentoEstoque> MovimentosEstoque { get; }
    IRepository<NotaFiscal> NotasFiscais { get; }
    IRepository<CupomDesconto> CuponsDesconto { get; }
    
    Task<int> SaveChangesAsync();
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
} 
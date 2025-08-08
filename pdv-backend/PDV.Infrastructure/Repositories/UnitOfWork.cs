using Microsoft.EntityFrameworkCore.Storage;
using PDV.Core.Interfaces;
using PDV.Infrastructure.Data;

namespace PDV.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly PDVDbContext _context;
    private IDbContextTransaction? _transaction;

    public UnitOfWork(PDVDbContext context)
    {
        _context = context;
        Empresas = new Repository<Core.Entities.Empresa>(context);
        Filiais = new Repository<Core.Entities.Filial>(context);
        Usuarios = new Repository<Core.Entities.Usuario>(context);
        Produtos = new Repository<Core.Entities.Produto>(context);
        Clientes = new Repository<Core.Entities.Cliente>(context);
        Caixas = new Repository<Core.Entities.Caixa>(context);
        Vendas = new Repository<Core.Entities.Venda>(context);
        MovimentosEstoque = new Repository<Core.Entities.MovimentoEstoque>(context);
        NotasFiscais = new Repository<Core.Entities.NotaFiscal>(context);
        CuponsDesconto = new Repository<Core.Entities.CupomDesconto>(context);
    }

    public IRepository<Core.Entities.Empresa> Empresas { get; }
    public IRepository<Core.Entities.Filial> Filiais { get; }
    public IRepository<Core.Entities.Usuario> Usuarios { get; }
    public IRepository<Core.Entities.Produto> Produtos { get; }
    public IRepository<Core.Entities.Cliente> Clientes { get; }
    public IRepository<Core.Entities.Caixa> Caixas { get; }
    public IRepository<Core.Entities.Venda> Vendas { get; }
    public IRepository<Core.Entities.MovimentoEstoque> MovimentosEstoque { get; }
    public IRepository<Core.Entities.NotaFiscal> NotasFiscais { get; }
    public IRepository<Core.Entities.CupomDesconto> CuponsDesconto { get; }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public async Task BeginTransactionAsync()
    {
        _transaction = await _context.Database.BeginTransactionAsync();
    }

    public async Task CommitTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.CommitAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task RollbackTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public void Dispose()
    {
        _transaction?.Dispose();
        _context.Dispose();
    }
} 
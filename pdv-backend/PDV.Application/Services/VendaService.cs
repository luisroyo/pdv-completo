using PDV.Core.Entities;
using PDV.Core.Interfaces;
using Microsoft.Extensions.Logging;

namespace PDV.Application.Services;

public class VendaService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<VendaService> _logger;

    public VendaService(IUnitOfWork unitOfWork, ILogger<VendaService> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<Venda> CriarVendaAsync(Guid caixaId, Guid usuarioId, Guid? clienteId = null)
    {
        try
        {
            // Validar se o caixa está aberto
            var caixa = await _unitOfWork.Caixas.GetByIdAsync(caixaId);
            if (caixa == null)
                throw new InvalidOperationException("Caixa não encontrado");

            if (caixa.Status != StatusCaixa.Aberto)
                throw new InvalidOperationException("Caixa deve estar aberto para criar vendas");

            // Gerar número da venda
            var numeroVenda = await GerarNumeroVendaAsync(caixaId);

            var venda = new Venda
            {
                NumeroVenda = numeroVenda,
                CaixaId = caixaId,
                UsuarioId = usuarioId,
                ClienteId = clienteId,
                DataVenda = DateTime.Now,
                Status = StatusVenda.EmAndamento
            };

            await _unitOfWork.Vendas.AddAsync(venda);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Venda {NumeroVenda} criada com sucesso", numeroVenda);
            return venda;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar venda");
            throw;
        }
    }

    public async Task<ItemVenda> AdicionarItemAsync(Guid vendaId, Guid produtoId, decimal quantidade, decimal? precoUnitario = null)
    {
        try
        {
            var venda = await _unitOfWork.Vendas.GetByIdAsync(vendaId);
            if (venda == null)
                throw new InvalidOperationException("Venda não encontrada");

            if (venda.Status != StatusVenda.EmAndamento)
                throw new InvalidOperationException("Venda não está em andamento");

            var produto = await _unitOfWork.Produtos.GetByIdAsync(produtoId);
            if (produto == null)
                throw new InvalidOperationException("Produto não encontrado");

            if (!produto.Ativo)
                throw new InvalidOperationException("Produto inativo");

            if (produto.ControlaEstoque && produto.EstoqueAtual < quantidade)
                throw new InvalidOperationException($"Estoque insuficiente. Disponível: {produto.EstoqueAtual}");

            var preco = precoUnitario ?? produto.PrecoVenda;
            var precoTotal = preco * quantidade;
            var total = precoTotal;

            var item = new ItemVenda
            {
                VendaId = vendaId,
                ProdutoId = produtoId,
                NomeProduto = produto.Nome,
                CodigoProduto = produto.Codigo,
                Quantidade = quantidade,
                PrecoUnitario = preco,
                PrecoTotal = precoTotal,
                Total = total,
                CFOP = produto.CFOP,
                NCM = produto.NCM,
                CST = produto.CST,
                CEST = produto.CEST,
                AliquotaICMS = produto.AliquotaICMS,
                AliquotaPIS = produto.AliquotaPIS,
                AliquotaCOFINS = produto.AliquotaCOFINS,
                AliquotaIPI = produto.AliquotaIPI
            };

            await _unitOfWork.Vendas.GetAsync(v => v.Id == vendaId);
            await _unitOfWork.SaveChangesAsync();

            // Atualizar totais da venda
            await AtualizarTotaisVendaAsync(vendaId);

            _logger.LogInformation("Item adicionado à venda {VendaId}: {Produto} x {Quantidade}", vendaId, produto.Nome, quantidade);
            return item;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao adicionar item à venda");
            throw;
        }
    }

    public async Task<Venda> FinalizarVendaAsync(Guid vendaId, List<PagamentoVenda> pagamentos, bool emitirNFCe = true)
    {
        try
        {
            await _unitOfWork.BeginTransactionAsync();

            var venda = await _unitOfWork.Vendas.GetByIdAsync(vendaId);
            if (venda == null)
                throw new InvalidOperationException("Venda não encontrada");

            if (venda.Status != StatusVenda.EmAndamento)
                throw new InvalidOperationException("Venda não está em andamento");

            // Validar pagamentos
            var totalPagamentos = pagamentos.Sum(p => p.Valor);
            if (totalPagamentos < venda.Total)
                throw new InvalidOperationException("Valor dos pagamentos é menor que o total da venda");

            // Adicionar pagamentos
            foreach (var pagamento in pagamentos)
            {
                pagamento.VendaId = vendaId;
                await _unitOfWork.Vendas.GetAsync(v => v.Id == vendaId);
            }

            // Atualizar venda
            venda.Status = StatusVenda.Finalizada;
            venda.TotalPago = totalPagamentos;
            venda.Troco = totalPagamentos - venda.Total;
            venda.EmitirNFCe = emitirNFCe;

            // Baixar estoque
            await BaixarEstoqueAsync(vendaId);

            // Atualizar caixa
            await AtualizarCaixaAsync(venda.CaixaId, venda.Total);

            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitTransactionAsync();

            _logger.LogInformation("Venda {NumeroVenda} finalizada com sucesso", venda.NumeroVenda);
            return venda;
        }
        catch (Exception ex)
        {
            await _unitOfWork.RollbackTransactionAsync();
            _logger.LogError(ex, "Erro ao finalizar venda");
            throw;
        }
    }

    public async Task<Venda> CancelarVendaAsync(Guid vendaId, string justificativa)
    {
        try
        {
            await _unitOfWork.BeginTransactionAsync();

            var venda = await _unitOfWork.Vendas.GetByIdAsync(vendaId);
            if (venda == null)
                throw new InvalidOperationException("Venda não encontrada");

            if (venda.Status == StatusVenda.Cancelada)
                throw new InvalidOperationException("Venda já está cancelada");

            if (venda.Status == StatusVenda.Finalizada)
            {
                // Se a venda foi finalizada, estornar estoque
                await EstornarEstoqueAsync(vendaId);
            }

            venda.Status = StatusVenda.Cancelada;
            venda.Observacoes = justificativa;

            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitTransactionAsync();

            _logger.LogInformation("Venda {NumeroVenda} cancelada: {Justificativa}", venda.NumeroVenda, justificativa);
            return venda;
        }
        catch (Exception ex)
        {
            await _unitOfWork.RollbackTransactionAsync();
            _logger.LogError(ex, "Erro ao cancelar venda");
            throw;
        }
    }

    private async Task<string> GerarNumeroVendaAsync(Guid caixaId)
    {
        var vendasHoje = await _unitOfWork.Vendas.GetAsync(v => 
            v.CaixaId == caixaId && 
            v.DataVenda.Date == DateTime.Today);

        var proximoNumero = vendasHoje.Count() + 1;
        return $"{DateTime.Now:yyyyMMdd}{proximoNumero:D4}";
    }

    private async Task AtualizarTotaisVendaAsync(Guid vendaId)
    {
        var venda = await _unitOfWork.Vendas.GetByIdAsync(vendaId);
        if (venda == null) return;

        var itens = await _unitOfWork.Vendas.GetAsync(v => v.Id == vendaId);
        var subTotal = itens.Sum(i => i.Total);
        var total = subTotal - venda.Desconto;

        venda.SubTotal = subTotal;
        venda.Total = total;

        await _unitOfWork.SaveChangesAsync();
    }

    private async Task BaixarEstoqueAsync(Guid vendaId)
    {
        var itens = await _unitOfWork.Vendas.GetAsync(v => v.Id == vendaId);
        
        foreach (var item in itens)
        {
            var produto = await _unitOfWork.Produtos.GetByIdAsync(item.ProdutoId);
            if (produto == null || !produto.ControlaEstoque) continue;

            var quantidadeAnterior = produto.EstoqueAtual;
            produto.EstoqueAtual -= item.Quantidade;

            var movimento = new MovimentoEstoque
            {
                ProdutoId = produto.Id,
                UsuarioId = item.Venda.UsuarioId,
                VendaId = vendaId,
                Tipo = TipoMovimentoEstoque.Saida,
                Quantidade = item.Quantidade,
                QuantidadeAnterior = quantidadeAnterior,
                QuantidadeAtual = produto.EstoqueAtual,
                CustoUnitario = produto.PrecoCusto,
                CustoTotal = produto.PrecoCusto * item.Quantidade,
                Observacoes = $"Saída por venda {item.Venda.NumeroVenda}"
            };

            await _unitOfWork.MovimentosEstoque.AddAsync(movimento);
        }
    }

    private async Task EstornarEstoqueAsync(Guid vendaId)
    {
        var itens = await _unitOfWork.Vendas.GetAsync(v => v.Id == vendaId);
        
        foreach (var item in itens)
        {
            var produto = await _unitOfWork.Produtos.GetByIdAsync(item.ProdutoId);
            if (produto == null || !produto.ControlaEstoque) continue;

            var quantidadeAnterior = produto.EstoqueAtual;
            produto.EstoqueAtual += item.Quantidade;

            var movimento = new MovimentoEstoque
            {
                ProdutoId = produto.Id,
                UsuarioId = item.Venda.UsuarioId,
                VendaId = vendaId,
                Tipo = TipoMovimentoEstoque.Entrada,
                Quantidade = item.Quantidade,
                QuantidadeAnterior = quantidadeAnterior,
                QuantidadeAtual = produto.EstoqueAtual,
                CustoUnitario = produto.PrecoCusto,
                CustoTotal = produto.PrecoCusto * item.Quantidade,
                Observacoes = $"Estorno por cancelamento da venda {item.Venda.NumeroVenda}"
            };

            await _unitOfWork.MovimentosEstoque.AddAsync(movimento);
        }
    }

    private async Task AtualizarCaixaAsync(Guid caixaId, decimal valorVenda)
    {
        var caixa = await _unitOfWork.Caixas.GetByIdAsync(caixaId);
        if (caixa == null) return;

        caixa.SaldoAtual += valorVenda;
        caixa.TotalVendas += valorVenda;

        var movimento = new MovimentoCaixa
        {
            CaixaId = caixaId,
            UsuarioId = caixa.UsuarioAberturaId ?? Guid.Empty,
            Tipo = TipoMovimentoCaixa.Venda,
            Valor = valorVenda,
            Observacoes = "Recebimento de venda"
        };

        await _unitOfWork.Caixas.GetAsync(c => c.Id == caixaId);
    }
} 
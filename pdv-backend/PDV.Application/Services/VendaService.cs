using Microsoft.Extensions.Logging;
using PDV.Core.Entities;
using PDV.Core.Interfaces;

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
        var numeroVenda = await GerarNumeroVendaAsync(caixaId);
        
        var venda = new Venda
        {
            NumeroVenda = numeroVenda,
            DataVenda = DateTime.Now,
            Status = StatusVenda.EmAndamento,
            CaixaId = caixaId,
            UsuarioId = usuarioId,
            ClienteId = clienteId,
            SubTotal = 0,
            Desconto = 0,
            Total = 0,
            TotalPago = 0,
            Troco = 0
        };

        await _unitOfWork.Vendas.AddAsync(venda);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Venda criada: {NumeroVenda}", numeroVenda);
        return venda;
    }

    public async Task<ItemVenda> AdicionarItemAsync(Guid vendaId, Guid produtoId, decimal quantidade, decimal? precoUnitario = null)
    {
        var venda = await _unitOfWork.Vendas.GetByIdAsync(vendaId);
        if (venda == null)
            throw new InvalidOperationException("Venda não encontrada");

        if (venda.Status != StatusVenda.EmAndamento)
            throw new InvalidOperationException("Venda não está em andamento");

        var produto = await _unitOfWork.Produtos.GetByIdAsync(produtoId);
        if (produto == null)
            throw new InvalidOperationException("Produto não encontrado");

        if (!produto.IsActive)
            throw new InvalidOperationException("Produto inativo");

        if (produto.ControlaEstoque && produto.EstoqueAtual < quantidade)
            throw new InvalidOperationException("Estoque insuficiente");

        var preco = precoUnitario ?? produto.PrecoVenda;
        var total = preco * quantidade;

        var item = new ItemVenda
        {
            VendaId = vendaId,
            ProdutoId = produtoId,
            NomeProduto = produto.Nome,
            CodigoProduto = produto.Codigo,
            Quantidade = quantidade,
            PrecoUnitario = preco,
            PrecoTotal = total,
            Total = total,
            CFOP = produto.CFOP,
            NCM = produto.NCM,
            CST = produto.CST,
            AliquotaICMS = produto.AliquotaICMS,
            AliquotaPIS = produto.AliquotaPIS,
            AliquotaCOFINS = produto.AliquotaCOFINS
        };

        await _unitOfWork.Vendas.AddAsync(venda);
        await AtualizarTotaisVendaAsync(vendaId);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Item adicionado à venda {NumeroVenda}: {Produto} x{Quantidade}", 
            venda.NumeroVenda, produto.Nome, quantidade);

        return item;
    }

    public async Task<Venda> FinalizarVendaAsync(Guid vendaId, List<PagamentoVenda> pagamentos, bool emitirNFCe = true)
    {
        var venda = await _unitOfWork.Vendas.GetByIdAsync(vendaId);
        if (venda == null)
            throw new InvalidOperationException("Venda não encontrada");

        if (venda.Status != StatusVenda.EmAndamento)
            throw new InvalidOperationException("Venda não está em andamento");

        // Validar pagamentos
        var totalPago = pagamentos.Sum(p => p.Valor);
        if (totalPago < venda.Total)
            throw new InvalidOperationException("Valor pago é menor que o total da venda");

        // Adicionar pagamentos
        foreach (var pagamento in pagamentos)
        {
            pagamento.VendaId = vendaId;
            await _unitOfWork.Vendas.AddAsync(venda);
        }

        // Atualizar venda
        venda.Status = StatusVenda.Finalizada;
        venda.TotalPago = totalPago;
        venda.Troco = totalPago - venda.Total;
        venda.EmitirNFCe = emitirNFCe;

        // Baixar estoque
        await BaixarEstoqueAsync(vendaId);

        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Venda finalizada: {NumeroVenda}", venda.NumeroVenda);
        return venda;
    }

    public async Task<Venda> CancelarVendaAsync(Guid vendaId, string justificativa)
    {
        var venda = await _unitOfWork.Vendas.GetByIdAsync(vendaId);
        if (venda == null)
            throw new InvalidOperationException("Venda não encontrada");

        if (venda.Status == StatusVenda.Cancelada)
            throw new InvalidOperationException("Venda já está cancelada");

        if (venda.Status == StatusVenda.Finalizada)
        {
            // Estornar estoque se a venda foi finalizada
            await EstornarEstoqueAsync(vendaId);
        }

        venda.Status = StatusVenda.Cancelada;
        venda.Observacoes = justificativa;

        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Venda cancelada: {NumeroVenda}", venda.NumeroVenda);
        return venda;
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
        var venda = await _unitOfWork.Vendas.GetByIdAsync(vendaId);
        if (venda == null) return;

        foreach (var item in venda.Itens)
        {
            var produto = await _unitOfWork.Produtos.GetByIdAsync(item.ProdutoId);
            if (produto == null || !produto.ControlaEstoque) continue;

            var quantidadeAnterior = produto.EstoqueAtual;
            produto.EstoqueAtual -= item.Quantidade;

            var movimento = new MovimentoEstoque
            {
                ProdutoId = produto.Id,
                UsuarioId = venda.UsuarioId,
                VendaId = vendaId,
                Tipo = TipoMovimentoEstoque.Saida,
                Quantidade = item.Quantidade,
                QuantidadeAnterior = quantidadeAnterior,
                QuantidadeAtual = produto.EstoqueAtual,
                CustoUnitario = produto.PrecoCusto,
                CustoTotal = produto.PrecoCusto * item.Quantidade,
                Observacoes = $"Saída por venda {venda.NumeroVenda}"
            };

            await _unitOfWork.MovimentosEstoque.AddAsync(movimento);
        }
    }

    private async Task EstornarEstoqueAsync(Guid vendaId)
    {
        var venda = await _unitOfWork.Vendas.GetByIdAsync(vendaId);
        if (venda == null) return;

        foreach (var item in venda.Itens)
        {
            var produto = await _unitOfWork.Produtos.GetByIdAsync(item.ProdutoId);
            if (produto == null || !produto.ControlaEstoque) continue;

            var quantidadeAnterior = produto.EstoqueAtual;
            produto.EstoqueAtual += item.Quantidade;

            var movimento = new MovimentoEstoque
            {
                ProdutoId = produto.Id,
                UsuarioId = venda.UsuarioId,
                VendaId = vendaId,
                Tipo = TipoMovimentoEstoque.Entrada,
                Quantidade = item.Quantidade,
                QuantidadeAnterior = quantidadeAnterior,
                QuantidadeAtual = produto.EstoqueAtual,
                CustoUnitario = produto.PrecoCusto,
                CustoTotal = produto.PrecoCusto * item.Quantidade,
                Observacoes = $"Estorno por cancelamento da venda {venda.NumeroVenda}"
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
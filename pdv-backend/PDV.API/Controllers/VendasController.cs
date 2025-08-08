using Microsoft.AspNetCore.Mvc;
using PDV.Application.Services;
using PDV.Core.Entities;
using PDV.Core.Interfaces;
using PDV.Fiscal.Services;

namespace PDV.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VendasController : ControllerBase
{
    private readonly VendaService _vendaService;
    private readonly NFCeService _nfcService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<VendasController> _logger;

    public VendasController(VendaService vendaService, NFCeService nfcService, IUnitOfWork unitOfWork, ILogger<VendasController> logger)
    {
        _vendaService = vendaService;
        _nfcService = nfcService;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    [HttpPost]
    public async Task<ActionResult<Venda>> CriarVenda([FromBody] CriarVendaRequest request)
    {
        try
        {
            var venda = await _vendaService.CriarVendaAsync(request.CaixaId, request.UsuarioId, request.ClienteId);
            return CreatedAtAction(nameof(ObterVenda), new { id = venda.Id }, venda);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar venda");
            return StatusCode(500, new { error = "Erro interno do servidor" });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Venda>> ObterVenda(Guid id)
    {
        try
        {
            var venda = await _unitOfWork.Vendas.GetByIdAsync(id);
            if (venda == null)
            {
                return NotFound(new { error = "Venda não encontrada" });
            }

            return Ok(venda);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter venda {Id}", id);
            return StatusCode(500, new { error = "Erro interno do servidor" });
        }
    }

    [HttpPost("{id}/itens")]
    public async Task<ActionResult<ItemVenda>> AdicionarItem(Guid id, [FromBody] AdicionarItemRequest request)
    {
        try
        {
            var item = await _vendaService.AdicionarItemAsync(id, request.ProdutoId, request.Quantidade, request.PrecoUnitario);
            return Ok(item);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao adicionar item à venda {Id}", id);
            return StatusCode(500, new { error = "Erro interno do servidor" });
        }
    }

    [HttpPost("{id}/finalizar")]
    public async Task<ActionResult<Venda>> FinalizarVenda(Guid id, [FromBody] FinalizarVendaRequest request)
    {
        try
        {
            var venda = await _vendaService.FinalizarVendaAsync(id, request.Pagamentos, request.EmitirNFCe);
            return Ok(venda);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao finalizar venda {Id}", id);
            return StatusCode(500, new { error = "Erro interno do servidor" });
        }
    }

    [HttpPost("{id}/cancelar")]
    public async Task<ActionResult<Venda>> CancelarVenda(Guid id, [FromBody] CancelarVendaRequest request)
    {
        try
        {
            var venda = await _vendaService.CancelarVendaAsync(id, request.Justificativa);
            return Ok(venda);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao cancelar venda {Id}", id);
            return StatusCode(500, new { error = "Erro interno do servidor" });
        }
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Venda>>> ListarVendas(
        [FromQuery] DateTime? dataInicio, 
        [FromQuery] DateTime? dataFim,
        [FromQuery] string? status,
        [FromQuery] Guid? clienteId,
        [FromQuery] Guid? usuarioId,
        [FromQuery] decimal? valorMinimo,
        [FromQuery] decimal? valorMaximo,
        [FromQuery] int pagina = 1,
        [FromQuery] int tamanhoPagina = 50)
    {
        try
        {
            var vendas = await _unitOfWork.Vendas.GetAllAsync();
            
            // Aplicar filtros
            if (dataInicio.HasValue)
            {
                vendas = vendas.Where(v => v.DataVenda >= dataInicio.Value).ToList();
            }
            
            if (dataFim.HasValue)
            {
                vendas = vendas.Where(v => v.DataVenda <= dataFim.Value).ToList();
            }
            
            if (!string.IsNullOrEmpty(status))
            {
                vendas = vendas.Where(v => v.Status.ToString().Equals(status, StringComparison.OrdinalIgnoreCase)).ToList();
            }
            
            if (clienteId.HasValue)
            {
                vendas = vendas.Where(v => v.ClienteId == clienteId.Value).ToList();
            }
            
            if (usuarioId.HasValue)
            {
                vendas = vendas.Where(v => v.UsuarioId == usuarioId.Value).ToList();
            }
            
            if (valorMinimo.HasValue)
            {
                vendas = vendas.Where(v => v.Total >= valorMinimo.Value).ToList();
            }
            
            if (valorMaximo.HasValue)
            {
                vendas = vendas.Where(v => v.Total <= valorMaximo.Value).ToList();
            }

            // Ordenar por data mais recente
            vendas = vendas.OrderByDescending(v => v.DataVenda).ToList();

            // Paginação
            var total = vendas.Count;
            var vendasPaginadas = vendas
                .Skip((pagina - 1) * tamanhoPagina)
                .Take(tamanhoPagina)
                .ToList();

            var resultado = new
            {
                vendas = vendasPaginadas,
                paginacao = new
                {
                    pagina,
                    tamanhoPagina,
                    total,
                    totalPaginas = (int)Math.Ceiling((double)total / tamanhoPagina)
                }
            };

            return Ok(resultado);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao listar vendas");
            return StatusCode(500, new { error = "Erro interno do servidor" });
        }
    }

    [HttpGet("resumo")]
    public async Task<ActionResult<object>> ObterResumoVendas([FromQuery] DateTime? dataInicio, [FromQuery] DateTime? dataFim)
    {
        try
        {
            var vendas = await _unitOfWork.Vendas.GetAllAsync();
            
            // Aplicar filtros de data
            if (dataInicio.HasValue)
            {
                vendas = vendas.Where(v => v.DataVenda >= dataInicio.Value).ToList();
            }
            
            if (dataFim.HasValue)
            {
                vendas = vendas.Where(v => v.DataVenda <= dataFim.Value).ToList();
            }

            var vendasFinalizadas = vendas.Where(v => v.Status == StatusVenda.Finalizada).ToList();
            var vendasCanceladas = vendas.Where(v => v.Status == StatusVenda.Cancelada).ToList();

            var resumo = new
            {
                totalVendas = vendasFinalizadas.Count,
                totalCanceladas = vendasCanceladas.Count,
                valorTotal = vendasFinalizadas.Sum(v => v.Total),
                valorMedio = vendasFinalizadas.Any() ? vendasFinalizadas.Average(v => v.Total) : 0,
                valorCancelado = vendasCanceladas.Sum(v => v.Total),
                percentualCancelamento = vendas.Any() ? (double)vendasCanceladas.Count / vendas.Count * 100 : 0
            };

            return Ok(resumo);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter resumo de vendas");
            return StatusCode(500, new { error = "Erro interno do servidor" });
        }
    }

    [HttpGet("cliente/{clienteId}")]
    public async Task<ActionResult<IEnumerable<Venda>>> ObterVendasPorCliente(Guid clienteId)
    {
        try
        {
            var vendas = await _unitOfWork.Vendas.GetAllAsync();
            var vendasCliente = vendas.Where(v => v.ClienteId == clienteId)
                                     .OrderByDescending(v => v.DataVenda)
                                     .ToList();

            return Ok(vendasCliente);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter vendas do cliente {ClienteId}", clienteId);
            return StatusCode(500, new { error = "Erro interno do servidor" });
        }
    }
}

public class CriarVendaRequest
{
    public Guid CaixaId { get; set; }
    public Guid UsuarioId { get; set; }
    public Guid? ClienteId { get; set; }
}

public class AdicionarItemRequest
{
    public Guid ProdutoId { get; set; }
    public decimal Quantidade { get; set; }
    public decimal? PrecoUnitario { get; set; }
}

public class FinalizarVendaRequest
{
    public List<PagamentoVenda> Pagamentos { get; set; } = new();
    public bool EmitirNFCe { get; set; } = true;
}

public class CancelarVendaRequest
{
    public string Justificativa { get; set; } = string.Empty;
} 
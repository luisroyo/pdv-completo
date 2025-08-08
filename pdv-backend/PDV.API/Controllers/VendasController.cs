using Microsoft.AspNetCore.Mvc;
using PDV.Application.Services;
using PDV.Core.Entities;
using PDV.Fiscal.Services;

namespace PDV.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VendasController : ControllerBase
{
    private readonly VendaService _vendaService;
    private readonly NFCeService _nfcService;
    private readonly ILogger<VendasController> _logger;

    public VendasController(VendaService vendaService, NFCeService nfcService, ILogger<VendasController> logger)
    {
        _vendaService = vendaService;
        _nfcService = nfcService;
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
            // Implementar busca da venda
            return Ok(new { message = "Venda encontrada", id });
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
    public async Task<ActionResult<IEnumerable<Venda>>> ListarVendas([FromQuery] DateTime? dataInicio, [FromQuery] DateTime? dataFim)
    {
        try
        {
            // Implementar listagem de vendas com filtros
            return Ok(new { message = "Lista de vendas", dataInicio, dataFim });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao listar vendas");
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
using Microsoft.AspNetCore.Mvc;
using PDV.Core.Entities;
using PDV.Core.Interfaces;

namespace PDV.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CaixaController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CaixaController> _logger;

    public CaixaController(IUnitOfWork unitOfWork, ILogger<CaixaController> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    [HttpPost("abrir")]
    public async Task<ActionResult<Caixa>> AbrirCaixa([FromBody] AbrirCaixaRequest request)
    {
        try
        {
            // Verificar se já existe um caixa aberto
            var caixas = await _unitOfWork.Caixas.GetAllAsync();
            var caixaAberto = caixas.FirstOrDefault(c => c.Status == StatusCaixa.Aberto);
            
            if (caixaAberto != null)
            {
                return BadRequest(new { error = "Já existe um caixa aberto" });
            }

            var caixa = new Caixa
            {
                Id = Guid.NewGuid(),
                UsuarioId = request.UsuarioId,
                DataAbertura = DateTime.Now,
                SaldoInicial = request.SaldoInicial,
                SaldoAtual = request.SaldoInicial,
                Status = StatusCaixa.Aberto,
                Observacoes = request.Observacoes
            };

            await _unitOfWork.Caixas.AddAsync(caixa);
            await _unitOfWork.SaveChangesAsync();

            return CreatedAtAction(nameof(ObterCaixa), new { id = caixa.Id }, caixa);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao abrir caixa");
            return StatusCode(500, new { error = "Erro interno do servidor" });
        }
    }

    [HttpPost("{id}/fechar")]
    public async Task<ActionResult<Caixa>> FecharCaixa(Guid id, [FromBody] FecharCaixaRequest request)
    {
        try
        {
            var caixa = await _unitOfWork.Caixas.GetByIdAsync(id);
            if (caixa == null)
            {
                return NotFound(new { error = "Caixa não encontrado" });
            }

            if (caixa.Status != StatusCaixa.Aberto)
            {
                return BadRequest(new { error = "Caixa não está aberto" });
            }

            caixa.DataFechamento = DateTime.Now;
            caixa.SaldoFinal = request.SaldoFinal;
            caixa.Status = StatusCaixa.Fechado;
            caixa.ObservacoesFechamento = request.Observacoes;

            _unitOfWork.Caixas.Update(caixa);
            await _unitOfWork.SaveChangesAsync();

            return Ok(caixa);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao fechar caixa {Id}", id);
            return StatusCode(500, new { error = "Erro interno do servidor" });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Caixa>> ObterCaixa(Guid id)
    {
        try
        {
            var caixa = await _unitOfWork.Caixas.GetByIdAsync(id);
            if (caixa == null)
            {
                return NotFound(new { error = "Caixa não encontrado" });
            }

            return Ok(caixa);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter caixa {Id}", id);
            return StatusCode(500, new { error = "Erro interno do servidor" });
        }
    }

    [HttpGet("atual")]
    public async Task<ActionResult<Caixa>> ObterCaixaAtual()
    {
        try
        {
            var caixas = await _unitOfWork.Caixas.GetAllAsync();
            var caixaAtual = caixas.FirstOrDefault(c => c.Status == StatusCaixa.Aberto);
            
            if (caixaAtual == null)
            {
                return NotFound(new { error = "Nenhum caixa aberto encontrado" });
            }

            return Ok(caixaAtual);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter caixa atual");
            return StatusCode(500, new { error = "Erro interno do servidor" });
        }
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Caixa>>> ListarCaixas(
        [FromQuery] DateTime? dataInicio,
        [FromQuery] DateTime? dataFim,
        [FromQuery] string? status,
        [FromQuery] Guid? usuarioId,
        [FromQuery] int pagina = 1,
        [FromQuery] int tamanhoPagina = 50)
    {
        try
        {
            var caixas = await _unitOfWork.Caixas.GetAllAsync();
            
            // Aplicar filtros
            if (dataInicio.HasValue)
            {
                caixas = caixas.Where(c => c.DataAbertura >= dataInicio.Value).ToList();
            }
            
            if (dataFim.HasValue)
            {
                caixas = caixas.Where(c => c.DataAbertura <= dataFim.Value).ToList();
            }
            
            if (!string.IsNullOrEmpty(status))
            {
                caixas = caixas.Where(c => c.Status.ToString().Equals(status, StringComparison.OrdinalIgnoreCase)).ToList();
            }
            
            if (usuarioId.HasValue)
            {
                caixas = caixas.Where(c => c.UsuarioId == usuarioId.Value).ToList();
            }

            // Ordenar por data de abertura mais recente
            caixas = caixas.OrderByDescending(c => c.DataAbertura).ToList();

            // Paginação
            var total = caixas.Count;
            var caixasPaginados = caixas
                .Skip((pagina - 1) * tamanhoPagina)
                .Take(tamanhoPagina)
                .ToList();

            var resultado = new
            {
                caixas = caixasPaginados,
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
            _logger.LogError(ex, "Erro ao listar caixas");
            return StatusCode(500, new { error = "Erro interno do servidor" });
        }
    }

    [HttpPost("{id}/movimentacoes")]
    public async Task<ActionResult<MovimentoCaixa>> AdicionarMovimentacao(Guid id, [FromBody] AdicionarMovimentacaoRequest request)
    {
        try
        {
            var caixa = await _unitOfWork.Caixas.GetByIdAsync(id);
            if (caixa == null)
            {
                return NotFound(new { error = "Caixa não encontrado" });
            }

            if (caixa.Status != StatusCaixa.Aberto)
            {
                return BadRequest(new { error = "Caixa não está aberto" });
            }

            var movimentacao = new MovimentoCaixa
            {
                Id = Guid.NewGuid(),
                CaixaId = id,
                Tipo = request.Tipo,
                Valor = request.Valor,
                Descricao = request.Descricao,
                DataMovimento = DateTime.Now,
                UsuarioId = request.UsuarioId
            };

            // Atualizar saldo do caixa
            if (request.Tipo == TipoMovimento.Entrada)
            {
                caixa.SaldoAtual += request.Valor;
            }
            else
            {
                if (caixa.SaldoAtual < request.Valor)
                {
                    return BadRequest(new { error = "Saldo insuficiente para realizar a saída" });
                }
                caixa.SaldoAtual -= request.Valor;
            }

            await _unitOfWork.MovimentosCaixa.AddAsync(movimentacao);
            _unitOfWork.Caixas.Update(caixa);
            await _unitOfWork.SaveChangesAsync();

            return CreatedAtAction(nameof(ObterMovimentacao), new { id = movimentacao.Id }, movimentacao);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao adicionar movimentação ao caixa {Id}", id);
            return StatusCode(500, new { error = "Erro interno do servidor" });
        }
    }

    [HttpGet("{id}/movimentacoes")]
    public async Task<ActionResult<IEnumerable<MovimentoCaixa>>> ListarMovimentacoes(
        Guid id,
        [FromQuery] DateTime? dataInicio,
        [FromQuery] DateTime? dataFim,
        [FromQuery] string? tipo,
        [FromQuery] int pagina = 1,
        [FromQuery] int tamanhoPagina = 50)
    {
        try
        {
            var caixa = await _unitOfWork.Caixas.GetByIdAsync(id);
            if (caixa == null)
            {
                return NotFound(new { error = "Caixa não encontrado" });
            }

            var movimentacoes = await _unitOfWork.MovimentosCaixa.GetAllAsync();
            var movimentacoesCaixa = movimentacoes.Where(m => m.CaixaId == id).ToList();
            
            // Aplicar filtros
            if (dataInicio.HasValue)
            {
                movimentacoesCaixa = movimentacoesCaixa.Where(m => m.DataMovimento >= dataInicio.Value).ToList();
            }
            
            if (dataFim.HasValue)
            {
                movimentacoesCaixa = movimentacoesCaixa.Where(m => m.DataMovimento <= dataFim.Value).ToList();
            }
            
            if (!string.IsNullOrEmpty(tipo))
            {
                movimentacoesCaixa = movimentacoesCaixa.Where(m => m.Tipo.ToString().Equals(tipo, StringComparison.OrdinalIgnoreCase)).ToList();
            }

            // Ordenar por data mais recente
            movimentacoesCaixa = movimentacoesCaixa.OrderByDescending(m => m.DataMovimento).ToList();

            // Paginação
            var total = movimentacoesCaixa.Count;
            var movimentacoesPaginadas = movimentacoesCaixa
                .Skip((pagina - 1) * tamanhoPagina)
                .Take(tamanhoPagina)
                .ToList();

            var resultado = new
            {
                movimentacoes = movimentacoesPaginadas,
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
            _logger.LogError(ex, "Erro ao listar movimentações do caixa {Id}", id);
            return StatusCode(500, new { error = "Erro interno do servidor" });
        }
    }

    [HttpGet("movimentacoes/{id}")]
    public async Task<ActionResult<MovimentoCaixa>> ObterMovimentacao(Guid id)
    {
        try
        {
            var movimentacao = await _unitOfWork.MovimentosCaixa.GetByIdAsync(id);
            if (movimentacao == null)
            {
                return NotFound(new { error = "Movimentação não encontrada" });
            }

            return Ok(movimentacao);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter movimentação {Id}", id);
            return StatusCode(500, new { error = "Erro interno do servidor" });
        }
    }

    [HttpGet("{id}/resumo")]
    public async Task<ActionResult<object>> ObterResumoCaixa(Guid id)
    {
        try
        {
            var caixa = await _unitOfWork.Caixas.GetByIdAsync(id);
            if (caixa == null)
            {
                return NotFound(new { error = "Caixa não encontrado" });
            }

            var movimentacoes = await _unitOfWork.MovimentosCaixa.GetAllAsync();
            var movimentacoesCaixa = movimentacoes.Where(m => m.CaixaId == id).ToList();

            var entradas = movimentacoesCaixa.Where(m => m.Tipo == TipoMovimento.Entrada).Sum(m => m.Valor);
            var saidas = movimentacoesCaixa.Where(m => m.Tipo == TipoMovimento.Saida).Sum(m => m.Valor);

            var resumo = new
            {
                caixa = caixa,
                totalEntradas = entradas,
                totalSaidas = saidas,
                saldoCalculado = caixa.SaldoInicial + entradas - saidas,
                totalMovimentacoes = movimentacoesCaixa.Count,
                movimentacoesPorTipo = new
                {
                    entradas = movimentacoesCaixa.Count(m => m.Tipo == TipoMovimento.Entrada),
                    saidas = movimentacoesCaixa.Count(m => m.Tipo == TipoMovimento.Saida)
                }
            };

            return Ok(resumo);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter resumo do caixa {Id}", id);
            return StatusCode(500, new { error = "Erro interno do servidor" });
        }
    }
}

public class AbrirCaixaRequest
{
    public Guid UsuarioId { get; set; }
    public decimal SaldoInicial { get; set; }
    public string? Observacoes { get; set; }
}

public class FecharCaixaRequest
{
    public decimal SaldoFinal { get; set; }
    public string? Observacoes { get; set; }
}

public class AdicionarMovimentacaoRequest
{
    public TipoMovimento Tipo { get; set; }
    public decimal Valor { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public Guid UsuarioId { get; set; }
} 
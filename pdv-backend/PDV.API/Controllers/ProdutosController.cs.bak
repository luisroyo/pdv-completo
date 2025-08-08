using Microsoft.AspNetCore.Mvc;
using PDV.Core.Entities;
using PDV.Core.Interfaces;
using PDV.Application.Services;

namespace PDV.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProdutosController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<ProdutosController> _logger;

    public ProdutosController(IUnitOfWork unitOfWork, ILogger<ProdutosController> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Produto>>> ListarProdutos([FromQuery] string? busca, [FromQuery] int? categoriaId)
    {
        try
        {
            var produtos = await _unitOfWork.Produtos.GetAllAsync();
            
            // Aplicar filtros se fornecidos
            if (!string.IsNullOrEmpty(busca))
            {
                produtos = produtos.Where(p => 
                    p.Nome.Contains(busca, StringComparison.OrdinalIgnoreCase) ||
                    p.CodigoBarras.Contains(busca, StringComparison.OrdinalIgnoreCase)
                ).ToList();
            }

            if (categoriaId.HasValue)
            {
                produtos = produtos.Where(p => p.CategoriaId == categoriaId.Value).ToList();
            }

            return Ok(produtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao listar produtos");
            return StatusCode(500, new { error = "Erro interno do servidor" });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Produto>> ObterProduto(Guid id)
    {
        try
        {
            var produto = await _unitOfWork.Produtos.GetByIdAsync(id);
            if (produto == null)
            {
                return NotFound(new { error = "Produto não encontrado" });
            }

            return Ok(produto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter produto {Id}", id);
            return StatusCode(500, new { error = "Erro interno do servidor" });
        }
    }

    [HttpGet("buscar/{codigoBarras}")]
    public async Task<ActionResult<Produto>> BuscarPorCodigoBarras(string codigoBarras)
    {
        try
        {
            var produtos = await _unitOfWork.Produtos.GetAllAsync();
            var produto = produtos.FirstOrDefault(p => p.CodigoBarras == codigoBarras);
            
            if (produto == null)
            {
                return NotFound(new { error = "Produto não encontrado" });
            }

            return Ok(produto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar produto por código de barras {CodigoBarras}", codigoBarras);
            return StatusCode(500, new { error = "Erro interno do servidor" });
        }
    }

    [HttpPost]
    public async Task<ActionResult<Produto>> CriarProduto([FromBody] CriarProdutoRequest request)
    {
        try
        {
            var produto = new Produto
            {
                Id = Guid.NewGuid(),
                Nome = request.Nome,
                Descricao = request.Descricao,
                CodigoBarras = request.CodigoBarras,
                PrecoVenda = request.PrecoVenda,
                PrecoCusto = request.PrecoCusto,
                EstoqueAtual = request.EstoqueAtual,
                EstoqueMinimo = request.EstoqueMinimo,
                CategoriaId = request.CategoriaId,
                UnidadeMedida = request.UnidadeMedida,
                NCM = request.NCM,
                CFOP = request.CFOP,
                CST = request.CST,
                AliquotaICMS = request.AliquotaICMS,
                Ativo = true,
                DataCadastro = DateTime.Now,
                DataAtualizacao = DateTime.Now
            };

            await _unitOfWork.Produtos.AddAsync(produto);
            await _unitOfWork.SaveChangesAsync();

            return CreatedAtAction(nameof(ObterProduto), new { id = produto.Id }, produto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar produto");
            return StatusCode(500, new { error = "Erro interno do servidor" });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Produto>> AtualizarProduto(Guid id, [FromBody] AtualizarProdutoRequest request)
    {
        try
        {
            var produto = await _unitOfWork.Produtos.GetByIdAsync(id);
            if (produto == null)
            {
                return NotFound(new { error = "Produto não encontrado" });
            }

            produto.Nome = request.Nome;
            produto.Descricao = request.Descricao;
            produto.CodigoBarras = request.CodigoBarras;
            produto.PrecoVenda = request.PrecoVenda;
            produto.PrecoCusto = request.PrecoCusto;
            produto.EstoqueAtual = request.EstoqueAtual;
            produto.EstoqueMinimo = request.EstoqueMinimo;
            produto.CategoriaId = request.CategoriaId;
            produto.UnidadeMedida = request.UnidadeMedida;
            produto.NCM = request.NCM;
            produto.CFOP = request.CFOP;
            produto.CST = request.CST;
            produto.AliquotaICMS = request.AliquotaICMS;
            produto.Ativo = request.Ativo;
            produto.DataAtualizacao = DateTime.Now;

            _unitOfWork.Produtos.Update(produto);
            await _unitOfWork.SaveChangesAsync();

            return Ok(produto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao atualizar produto {Id}", id);
            return StatusCode(500, new { error = "Erro interno do servidor" });
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> ExcluirProduto(Guid id)
    {
        try
        {
            var produto = await _unitOfWork.Produtos.GetByIdAsync(id);
            if (produto == null)
            {
                return NotFound(new { error = "Produto não encontrado" });
            }

            _unitOfWork.Produtos.Remove(produto);
            await _unitOfWork.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao excluir produto {Id}", id);
            return StatusCode(500, new { error = "Erro interno do servidor" });
        }
    }

    [HttpPost("{id}/estoque")]
    public async Task<ActionResult<Produto>> AtualizarEstoque(Guid id, [FromBody] AtualizarEstoqueRequest request)
    {
        try
        {
            var produto = await _unitOfWork.Produtos.GetByIdAsync(id);
            if (produto == null)
            {
                return NotFound(new { error = "Produto não encontrado" });
            }

            produto.EstoqueAtual = request.EstoqueAtual;
            produto.DataAtualizacao = DateTime.Now;

            _unitOfWork.Produtos.Update(produto);
            await _unitOfWork.SaveChangesAsync();

            return Ok(produto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao atualizar estoque do produto {Id}", id);
            return StatusCode(500, new { error = "Erro interno do servidor" });
        }
    }

    [HttpGet("estoque-baixo")]
    public async Task<ActionResult<IEnumerable<Produto>>> ProdutosEstoqueBaixo()
    {
        try
        {
            var produtos = await _unitOfWork.Produtos.GetAllAsync();
            var produtosEstoqueBaixo = produtos.Where(p => p.EstoqueAtual <= p.EstoqueMinimo && p.Ativo).ToList();

            return Ok(produtosEstoqueBaixo);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao listar produtos com estoque baixo");
            return StatusCode(500, new { error = "Erro interno do servidor" });
        }
    }
}

public class CriarProdutoRequest
{
    public string Nome { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public string CodigoBarras { get; set; } = string.Empty;
    public decimal PrecoVenda { get; set; }
    public decimal PrecoCusto { get; set; }
    public decimal EstoqueAtual { get; set; }
    public decimal EstoqueMinimo { get; set; }
    public Guid? CategoriaId { get; set; }
    public string UnidadeMedida { get; set; } = "UN";
    public string? NCM { get; set; }
    public string? CFOP { get; set; }
    public string? CST { get; set; }
    public decimal AliquotaICMS { get; set; }
}

public class AtualizarProdutoRequest
{
    public string Nome { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public string CodigoBarras { get; set; } = string.Empty;
    public decimal PrecoVenda { get; set; }
    public decimal PrecoCusto { get; set; }
    public decimal EstoqueAtual { get; set; }
    public decimal EstoqueMinimo { get; set; }
    public Guid? CategoriaId { get; set; }
    public string UnidadeMedida { get; set; } = "UN";
    public string? NCM { get; set; }
    public string? CFOP { get; set; }
    public string? CST { get; set; }
    public decimal AliquotaICMS { get; set; }
    public bool Ativo { get; set; }
}

public class AtualizarEstoqueRequest
{
    public decimal EstoqueAtual { get; set; }
} 
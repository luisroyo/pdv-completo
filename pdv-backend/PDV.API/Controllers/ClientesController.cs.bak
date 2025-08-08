using Microsoft.AspNetCore.Mvc;
using PDV.Core.Entities;
using PDV.Core.Interfaces;

namespace PDV.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClientesController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<ClientesController> _logger;

    public ClientesController(IUnitOfWork unitOfWork, ILogger<ClientesController> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Cliente>>> ListarClientes([FromQuery] string? busca, [FromQuery] bool? ativo)
    {
        try
        {
            var clientes = await _unitOfWork.Clientes.GetAllAsync();
            
            // Aplicar filtros se fornecidos
            if (!string.IsNullOrEmpty(busca))
            {
                clientes = clientes.Where(c => 
                    c.Nome.Contains(busca, StringComparison.OrdinalIgnoreCase) ||
                    c.CPF.Contains(busca, StringComparison.OrdinalIgnoreCase) ||
                    c.Email.Contains(busca, StringComparison.OrdinalIgnoreCase)
                ).ToList();
            }

            if (ativo.HasValue)
            {
                clientes = clientes.Where(c => c.Ativo == ativo.Value).ToList();
            }

            return Ok(clientes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao listar clientes");
            return StatusCode(500, new { error = "Erro interno do servidor" });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Cliente>> ObterCliente(Guid id)
    {
        try
        {
            var cliente = await _unitOfWork.Clientes.GetByIdAsync(id);
            if (cliente == null)
            {
                return NotFound(new { error = "Cliente não encontrado" });
            }

            return Ok(cliente);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter cliente {Id}", id);
            return StatusCode(500, new { error = "Erro interno do servidor" });
        }
    }

    [HttpGet("buscar/{cpf}")]
    public async Task<ActionResult<Cliente>> BuscarPorCPF(string cpf)
    {
        try
        {
            var clientes = await _unitOfWork.Clientes.GetAllAsync();
            var cliente = clientes.FirstOrDefault(c => c.CPF == cpf);
            
            if (cliente == null)
            {
                return NotFound(new { error = "Cliente não encontrado" });
            }

            return Ok(cliente);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar cliente por CPF {CPF}", cpf);
            return StatusCode(500, new { error = "Erro interno do servidor" });
        }
    }

    [HttpPost]
    public async Task<ActionResult<Cliente>> CriarCliente([FromBody] CriarClienteRequest request)
    {
        try
        {
            // Verificar se já existe cliente com o mesmo CPF
            var clientes = await _unitOfWork.Clientes.GetAllAsync();
            if (clientes.Any(c => c.CPF == request.CPF))
            {
                return BadRequest(new { error = "Já existe um cliente cadastrado com este CPF" });
            }

            var cliente = new Cliente
            {
                Id = Guid.NewGuid(),
                Nome = request.Nome,
                CPF = request.CPF,
                RG = request.RG,
                DataNascimento = request.DataNascimento,
                Email = request.Email,
                Telefone = request.Telefone,
                Celular = request.Celular,
                CEP = request.CEP,
                Endereco = request.Endereco,
                Numero = request.Numero,
                Complemento = request.Complemento,
                Bairro = request.Bairro,
                Cidade = request.Cidade,
                Estado = request.Estado,
                Observacoes = request.Observacoes,
                Ativo = true,
                DataCadastro = DateTime.Now,
                DataAtualizacao = DateTime.Now
            };

            await _unitOfWork.Clientes.AddAsync(cliente);
            await _unitOfWork.SaveChangesAsync();

            return CreatedAtAction(nameof(ObterCliente), new { id = cliente.Id }, cliente);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar cliente");
            return StatusCode(500, new { error = "Erro interno do servidor" });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Cliente>> AtualizarCliente(Guid id, [FromBody] AtualizarClienteRequest request)
    {
        try
        {
            var cliente = await _unitOfWork.Clientes.GetByIdAsync(id);
            if (cliente == null)
            {
                return NotFound(new { error = "Cliente não encontrado" });
            }

            // Verificar se o CPF já existe em outro cliente
            var clientes = await _unitOfWork.Clientes.GetAllAsync();
            if (clientes.Any(c => c.CPF == request.CPF && c.Id != id))
            {
                return BadRequest(new { error = "Já existe um cliente cadastrado com este CPF" });
            }

            cliente.Nome = request.Nome;
            cliente.CPF = request.CPF;
            cliente.RG = request.RG;
            cliente.DataNascimento = request.DataNascimento;
            cliente.Email = request.Email;
            cliente.Telefone = request.Telefone;
            cliente.Celular = request.Celular;
            cliente.CEP = request.CEP;
            cliente.Endereco = request.Endereco;
            cliente.Numero = request.Numero;
            cliente.Complemento = request.Complemento;
            cliente.Bairro = request.Bairro;
            cliente.Cidade = request.Cidade;
            cliente.Estado = request.Estado;
            cliente.Observacoes = request.Observacoes;
            cliente.Ativo = request.Ativo;
            cliente.DataAtualizacao = DateTime.Now;

            _unitOfWork.Clientes.Update(cliente);
            await _unitOfWork.SaveChangesAsync();

            return Ok(cliente);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao atualizar cliente {Id}", id);
            return StatusCode(500, new { error = "Erro interno do servidor" });
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> ExcluirCliente(Guid id)
    {
        try
        {
            var cliente = await _unitOfWork.Clientes.GetByIdAsync(id);
            if (cliente == null)
            {
                return NotFound(new { error = "Cliente não encontrado" });
            }

            _unitOfWork.Clientes.Remove(cliente);
            await _unitOfWork.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao excluir cliente {Id}", id);
            return StatusCode(500, new { error = "Erro interno do servidor" });
        }
    }

    [HttpGet("{id}/historico")]
    public async Task<ActionResult<IEnumerable<Venda>>> HistoricoCompras(Guid id)
    {
        try
        {
            var cliente = await _unitOfWork.Clientes.GetByIdAsync(id);
            if (cliente == null)
            {
                return NotFound(new { error = "Cliente não encontrado" });
            }

            var vendas = await _unitOfWork.Vendas.GetAllAsync();
            var historico = vendas.Where(v => v.ClienteId == id).OrderByDescending(v => v.DataVenda).ToList();

            return Ok(historico);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter histórico de compras do cliente {Id}", id);
            return StatusCode(500, new { error = "Erro interno do servidor" });
        }
    }

    [HttpGet("aniversariantes")]
    public async Task<ActionResult<IEnumerable<Cliente>>> AniversariantesDoMes()
    {
        try
        {
            var clientes = await _unitOfWork.Clientes.GetAllAsync();
            var mesAtual = DateTime.Now.Month;
            
            var aniversariantes = clientes
                .Where(c => c.DataNascimento.HasValue && c.DataNascimento.Value.Month == mesAtual && c.Ativo)
                .OrderBy(c => c.DataNascimento.Value.Day)
                .ToList();

            return Ok(aniversariantes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao listar aniversariantes do mês");
            return StatusCode(500, new { error = "Erro interno do servidor" });
        }
    }
}

public class CriarClienteRequest
{
    public string Nome { get; set; } = string.Empty;
    public string CPF { get; set; } = string.Empty;
    public string? RG { get; set; }
    public DateTime? DataNascimento { get; set; }
    public string? Email { get; set; }
    public string? Telefone { get; set; }
    public string? Celular { get; set; }
    public string? CEP { get; set; }
    public string? Endereco { get; set; }
    public string? Numero { get; set; }
    public string? Complemento { get; set; }
    public string? Bairro { get; set; }
    public string? Cidade { get; set; }
    public string? Estado { get; set; }
    public string? Observacoes { get; set; }
}

public class AtualizarClienteRequest
{
    public string Nome { get; set; } = string.Empty;
    public string CPF { get; set; } = string.Empty;
    public string? RG { get; set; }
    public DateTime? DataNascimento { get; set; }
    public string? Email { get; set; }
    public string? Telefone { get; set; }
    public string? Celular { get; set; }
    public string? CEP { get; set; }
    public string? Endereco { get; set; }
    public string? Numero { get; set; }
    public string? Complemento { get; set; }
    public string? Bairro { get; set; }
    public string? Cidade { get; set; }
    public string? Estado { get; set; }
    public string? Observacoes { get; set; }
    public bool Ativo { get; set; }
} 
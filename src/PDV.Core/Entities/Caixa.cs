using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PDV.Core.Entities;

public class Caixa : BaseEntity
{
    [Required]
    [MaxLength(50)]
    public string Nome { get; set; } = string.Empty;
    
    [MaxLength(20)]
    public string? Codigo { get; set; }
    
    public StatusCaixa Status { get; set; } = StatusCaixa.Fechado;
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal SaldoInicial { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal SaldoAtual { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalVendas { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalSangrias { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalSuprimentos { get; set; }
    
    public DateTime? DataAbertura { get; set; }
    
    public DateTime? DataFechamento { get; set; }
    
    public Guid? UsuarioAberturaId { get; set; }
    public virtual Usuario? UsuarioAbertura { get; set; }
    
    public Guid? UsuarioFechamentoId { get; set; }
    public virtual Usuario? UsuarioFechamento { get; set; }
    
    [MaxLength(255)]
    public string? Observacoes { get; set; }
    
    // Relacionamentos
    [Required]
    public Guid FilialId { get; set; }
    public virtual Filial Filial { get; set; } = null!;
    
    public virtual ICollection<Venda> Vendas { get; set; } = new List<Venda>();
    public virtual ICollection<MovimentoCaixa> Movimentos { get; set; } = new List<MovimentoCaixa>();
}

public class MovimentoCaixa : BaseEntity
{
    public TipoMovimentoCaixa Tipo { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal Valor { get; set; }
    
    [MaxLength(255)]
    public string? Observacoes { get; set; }
    
    public Guid? VendaId { get; set; }
    public virtual Venda? Venda { get; set; }
    
    // Relacionamentos
    [Required]
    public Guid CaixaId { get; set; }
    public virtual Caixa Caixa { get; set; } = null!;
    
    [Required]
    public Guid UsuarioId { get; set; }
    public virtual Usuario Usuario { get; set; } = null!;
}

public enum StatusCaixa
{
    Fechado = 1,
    Aberto = 2,
    Bloqueado = 3
}

public enum TipoMovimentoCaixa
{
    Abertura = 1,
    Sangria = 2,
    Suprimento = 3,
    Venda = 4,
    Cancelamento = 5,
    Fechamento = 6
} 
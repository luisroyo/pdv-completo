using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PDV.Core.Entities;

public class MovimentoEstoque : BaseEntity
{
    public TipoMovimentoEstoque Tipo { get; set; }
    
    [Column(TypeName = "decimal(18,3)")]
    public decimal Quantidade { get; set; }
    
    [Column(TypeName = "decimal(18,3)")]
    public decimal QuantidadeAnterior { get; set; }
    
    [Column(TypeName = "decimal(18,3)")]
    public decimal QuantidadeAtual { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal CustoUnitario { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal CustoTotal { get; set; }
    
    [MaxLength(255)]
    public string? Observacoes { get; set; }
    
    public DateTime DataMovimento { get; set; } = DateTime.Now;
    
    // Relacionamentos
    [Required]
    public Guid ProdutoId { get; set; }
    public virtual Produto Produto { get; set; } = null!;
    
    [Required]
    public Guid UsuarioId { get; set; }
    public virtual Usuario Usuario { get; set; } = null!;
    
    public Guid? VendaId { get; set; }
    public virtual Venda? Venda { get; set; }
    
    public Guid? NotaFiscalId { get; set; }
    public virtual NotaFiscal? NotaFiscal { get; set; }
}

public class NotaFiscal : BaseEntity
{
    [Required]
    [MaxLength(20)]
    public string Numero { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(20)]
    public string Serie { get; set; } = string.Empty;
    
    public DateTime DataEmissao { get; set; }
    
    public DateTime DataEntrada { get; set; }
    
    [Required]
    [MaxLength(18)]
    public string CNPJEmitente { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string NomeEmitente { get; set; } = string.Empty;
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal ValorTotal { get; set; }
    
    public TipoNotaFiscal Tipo { get; set; }
    
    public StatusNotaFiscal Status { get; set; }
    
    [MaxLength(255)]
    public string? Observacoes { get; set; }
    
    // Relacionamentos
    public virtual ICollection<MovimentoEstoque> MovimentosEstoque { get; set; } = new List<MovimentoEstoque>();
}

public enum TipoMovimentoEstoque
{
    Entrada = 1,
    Saida = 2,
    Ajuste = 3,
    Transferencia = 4,
    Devolucao = 5
}

public enum TipoNotaFiscal
{
    Entrada = 1,
    Saida = 2
}

public enum StatusNotaFiscal
{
    Pendente = 1,
    Aprovada = 2,
    Cancelada = 3
} 
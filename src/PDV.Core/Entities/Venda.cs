using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PDV.Core.Entities;

public class Venda : BaseEntity
{
    [Required]
    [MaxLength(20)]
    public string NumeroVenda { get; set; } = string.Empty;
    
    public DateTime DataVenda { get; set; } = DateTime.Now;
    
    public StatusVenda Status { get; set; } = StatusVenda.EmAndamento;
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal SubTotal { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal Desconto { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal Total { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalPago { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal Troco { get; set; }
    
    public TipoVenda Tipo { get; set; } = TipoVenda.Venda;
    
    [MaxLength(255)]
    public string? Observacoes { get; set; }
    
    // Campos fiscais
    public bool EmitirNFCe { get; set; } = true;
    
    public StatusNFCe StatusNFCe { get; set; } = StatusNFCe.NaoEmitida;
    
    [MaxLength(50)]
    public string? NumeroNFCe { get; set; }
    
    [MaxLength(50)]
    public string? ChaveAcessoNFCe { get; set; }
    
    public DateTime? DataEmissaoNFCe { get; set; }
    
    [MaxLength(50)]
    public string? ProtocoloNFCe { get; set; }
    
    public string? XMLNFCe { get; set; }
    
    public string? DANFENFCe { get; set; }
    
    // Campos SAT (SP)
    public StatusSAT StatusSAT { get; set; } = StatusSAT.NaoEmitido;
    
    [MaxLength(50)]
    public string? NumeroSAT { get; set; }
    
    [MaxLength(50)]
    public string? ChaveAcessoSAT { get; set; }
    
    public DateTime? DataEmissaoSAT { get; set; }
    
    [MaxLength(50)]
    public string? ProtocoloSAT { get; set; }
    
    public string? XMLSAT { get; set; }
    
    public string? CFeSAT { get; set; }
    
    // Campos TEF
    public bool UsarTEF { get; set; } = false;
    
    public StatusTEF StatusTEF { get; set; } = StatusTEF.NaoProcessado;
    
    [MaxLength(50)]
    public string? CodigoAutorizacaoTEF { get; set; }
    
    [MaxLength(50)]
    public string? NSU { get; set; }
    
    // Relacionamentos
    [Required]
    public Guid CaixaId { get; set; }
    public virtual Caixa Caixa { get; set; } = null!;
    
    [Required]
    public Guid UsuarioId { get; set; }
    public virtual Usuario Usuario { get; set; } = null!;
    
    public Guid? ClienteId { get; set; }
    public virtual Cliente? Cliente { get; set; }
    
    public virtual ICollection<ItemVenda> Itens { get; set; } = new List<ItemVenda>();
    public virtual ICollection<PagamentoVenda> Pagamentos { get; set; } = new List<PagamentoVenda>();
    public virtual ICollection<CupomDesconto> CuponsDesconto { get; set; } = new List<CupomDesconto>();
}

public class ItemVenda : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string NomeProduto { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(50)]
    public string CodigoProduto { get; set; } = string.Empty;
    
    [Column(TypeName = "decimal(18,3)")]
    public decimal Quantidade { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal PrecoUnitario { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal PrecoTotal { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal Desconto { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal Total { get; set; }
    
    // Campos fiscais do item
    [Required]
    [MaxLength(4)]
    public string CFOP { get; set; } = "5102";
    
    [Required]
    [MaxLength(8)]
    public string NCM { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(3)]
    public string CST { get; set; } = "000";
    
    [MaxLength(7)]
    public string? CEST { get; set; }
    
    [Column(TypeName = "decimal(5,2)")]
    public decimal AliquotaICMS { get; set; }
    
    [Column(TypeName = "decimal(5,2)")]
    public decimal AliquotaPIS { get; set; }
    
    [Column(TypeName = "decimal(5,2)")]
    public decimal AliquotaCOFINS { get; set; }
    
    [Column(TypeName = "decimal(5,2)")]
    public decimal AliquotaIPI { get; set; }
    
    // Relacionamentos
    [Required]
    public Guid VendaId { get; set; }
    public virtual Venda Venda { get; set; } = null!;
    
    [Required]
    public Guid ProdutoId { get; set; }
    public virtual Produto Produto { get; set; } = null!;
}

public class PagamentoVenda : BaseEntity
{
    public TipoPagamento Tipo { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal Valor { get; set; }
    
    [MaxLength(50)]
    public string? CodigoAutorizacao { get; set; }
    
    [MaxLength(50)]
    public string? NSU { get; set; }
    
    [MaxLength(50)]
    public string? Bandeira { get; set; }
    
    [MaxLength(50)]
    public string? Parcelas { get; set; }
    
    [MaxLength(255)]
    public string? Observacoes { get; set; }
    
    // Relacionamentos
    [Required]
    public Guid VendaId { get; set; }
    public virtual Venda Venda { get; set; } = null!;
}

public class CupomDesconto : BaseEntity
{
    [Required]
    [MaxLength(50)]
    public string Codigo { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string Descricao { get; set; } = string.Empty;
    
    public TipoDesconto Tipo { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal Valor { get; set; }
    
    public bool Ativo { get; set; } = true;
    
    public DateTime? DataInicio { get; set; }
    
    public DateTime? DataFim { get; set; }
    
    // Relacionamentos
    public virtual ICollection<Venda> Vendas { get; set; } = new List<Venda>();
}

public enum StatusVenda
{
    EmAndamento = 1,
    Finalizada = 2,
    Cancelada = 3,
    Devolvida = 4
}

public enum TipoVenda
{
    Venda = 1,
    Devolucao = 2,
    Troca = 3
}

public enum StatusNFCe
{
    NaoEmitida = 1,
    EmProcessamento = 2,
    Emitida = 3,
    Cancelada = 4,
    Erro = 5,
    Contingencia = 6
}

public enum StatusSAT
{
    NaoEmitido = 1,
    EmProcessamento = 2,
    Emitido = 3,
    Cancelado = 4,
    Erro = 5
}

public enum StatusTEF
{
    NaoProcessado = 1,
    EmProcessamento = 2,
    Aprovado = 3,
    Negado = 4,
    Erro = 5
}

public enum TipoPagamento
{
    Dinheiro = 1,
    CartaoCredito = 2,
    CartaoDebito = 3,
    PIX = 4,
    Vale = 5,
    Cheque = 6,
    Boleto = 7
}

public enum TipoDesconto
{
    Percentual = 1,
    Valor = 2
} 
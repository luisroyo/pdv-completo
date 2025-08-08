using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PDV.Core.Entities;

public class Produto : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Nome { get; set; } = string.Empty;
    
    [MaxLength(255)]
    public string? Descricao { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string Codigo { get; set; } = string.Empty;
    
    [MaxLength(50)]
    public string? CodigoBarras { get; set; }
    
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal PrecoVenda { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal PrecoCusto { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal PrecoPromocional { get; set; }
    
    [Required]
    [MaxLength(10)]
    public string UnidadeMedida { get; set; } = "UN";
    
    [Column(TypeName = "decimal(18,3)")]
    public decimal EstoqueAtual { get; set; }
    
    [Column(TypeName = "decimal(18,3)")]
    public decimal EstoqueMinimo { get; set; }
    
    [Column(TypeName = "decimal(18,3)")]
    public decimal EstoqueMaximo { get; set; }
    
    public bool ControlaEstoque { get; set; } = true;
    
    public bool Ativo { get; set; } = true;
    
    // Campos fiscais obrigatórios
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
    
    public bool IsServico { get; set; } = false;
    
    public bool IsProdutoEspecial { get; set; } = false;
    
    [MaxLength(100)]
    public string? Marca { get; set; }
    
    [MaxLength(100)]
    public string? Modelo { get; set; }
    
    [MaxLength(50)]
    public string? Referencia { get; set; }
    
    [Column(TypeName = "decimal(18,3)")]
    public decimal Peso { get; set; }
    
    [Column(TypeName = "decimal(18,3)")]
    public decimal Comprimento { get; set; }
    
    [Column(TypeName = "decimal(18,3)")]
    public decimal Largura { get; set; }
    
    [Column(TypeName = "decimal(18,3)")]
    public decimal Altura { get; set; }
    
    // Relacionamentos
    [Required]
    public Guid FilialId { get; set; }
    public virtual Filial Filial { get; set; } = null!;
    
    public Guid? CategoriaId { get; set; }
    public virtual CategoriaProduto? Categoria { get; set; }
    
    public virtual ICollection<ItemVenda> ItensVenda { get; set; } = new List<ItemVenda>();
    public virtual ICollection<MovimentoEstoque> MovimentosEstoque { get; set; } = new List<MovimentoEstoque>();
}

public class CategoriaProduto : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Nome { get; set; } = string.Empty;
    
    [MaxLength(255)]
    public string? Descricao { get; set; }
    
    public Guid? CategoriaPaiId { get; set; }
    public virtual CategoriaProduto? CategoriaPai { get; set; }
    
    public virtual ICollection<CategoriaProduto> Subcategorias { get; set; } = new List<CategoriaProduto>();
    public virtual ICollection<Produto> Produtos { get; set; } = new List<Produto>();
} 
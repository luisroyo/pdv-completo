using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PDV.Core.Entities;

public class Filial : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Nome { get; set; } = string.Empty;
    
    [MaxLength(20)]
    public string? Codigo { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Endereco { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(10)]
    public string Numero { get; set; } = string.Empty;
    
    [MaxLength(50)]
    public string? Complemento { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string Bairro { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(50)]
    public string Cidade { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(2)]
    public string UF { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(8)]
    public string CEP { get; set; } = string.Empty;
    
    [MaxLength(20)]
    public string? Telefone { get; set; }
    
    [MaxLength(100)]
    public string? Email { get; set; }
    
    // Configurações específicas da filial
    public string? NumeroSerieNFCe { get; set; }
    public string? NumeroSerieSAT { get; set; }
    public string? ConfiguracaoImpressora { get; set; }
    public string? ConfiguracaoBalança { get; set; }
    
    // Relacionamentos
    [Required]
    public Guid EmpresaId { get; set; }
    public virtual Empresa Empresa { get; set; } = null!;
    
    public virtual ICollection<Caixa> Caixas { get; set; } = new List<Caixa>();
    public virtual ICollection<Produto> Produtos { get; set; } = new List<Produto>();
} 
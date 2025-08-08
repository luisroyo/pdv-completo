using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PDV.Core.Entities;

public class Cliente : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Nome { get; set; } = string.Empty;
    
    [MaxLength(255)]
    public string? NomeFantasia { get; set; }
    
    [Required]
    [MaxLength(18)]
    public string Documento { get; set; } = string.Empty; // CPF ou CNPJ
    
    public TipoDocumento TipoDocumento { get; set; }
    
    [MaxLength(20)]
    public string? InscricaoEstadual { get; set; }
    
    [MaxLength(20)]
    public string? InscricaoMunicipal { get; set; }
    
    [MaxLength(100)]
    public string? Endereco { get; set; }
    
    [MaxLength(10)]
    public string? Numero { get; set; }
    
    [MaxLength(50)]
    public string? Complemento { get; set; }
    
    [MaxLength(50)]
    public string? Bairro { get; set; }
    
    [MaxLength(50)]
    public string? Cidade { get; set; }
    
    [MaxLength(2)]
    public string? UF { get; set; }
    
    [MaxLength(8)]
    public string? CEP { get; set; }
    
    [MaxLength(20)]
    public string? Telefone { get; set; }
    
    [MaxLength(20)]
    public string? Celular { get; set; }
    
    [MaxLength(100)]
    public string? Email { get; set; }
    
    [MaxLength(100)]
    public string? Contato { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal LimiteCredito { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal SaldoCredito { get; set; }
    
    public bool IsClienteEspecial { get; set; } = false;
    
    public bool IsIsentoICMS { get; set; } = false;
    
    [MaxLength(255)]
    public string? Observacoes { get; set; }
    
    // Relacionamentos
    public virtual ICollection<Venda> Vendas { get; set; } = new List<Venda>();
}

public enum TipoDocumento
{
    CPF = 1,
    CNPJ = 2
} 
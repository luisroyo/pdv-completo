using System.ComponentModel.DataAnnotations;

namespace PDV.Core.Entities;

public class Empresa : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string RazaoSocial { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string NomeFantasia { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(18)]
    public string CNPJ { get; set; } = string.Empty;
    
    [MaxLength(20)]
    public string? InscricaoEstadual { get; set; }
    
    [MaxLength(20)]
    public string? InscricaoMunicipal { get; set; }
    
    [Required]
    [MaxLength(2)]
    public string UF { get; set; } = string.Empty;
    
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
    [MaxLength(8)]
    public string CEP { get; set; } = string.Empty;
    
    [MaxLength(20)]
    public string? Telefone { get; set; }
    
    [MaxLength(100)]
    public string? Email { get; set; }
    
    [MaxLength(100)]
    public string? Website { get; set; }
    
    // Configurações fiscais
    public string? CertificadoDigital { get; set; }
    public string? SenhaCertificado { get; set; }
    public DateTime? ValidadeCertificado { get; set; }
    
    // Configurações NFC-e
    public string? NumeroSerieNFCe { get; set; }
    public string? CSC { get; set; }
    public string? IdToken { get; set; }
    public string? Token { get; set; }
    
    // Configurações SAT (SP)
    public string? CodigoAtivacaoSAT { get; set; }
    public string? NumeroSerieSAT { get; set; }
    
    // Configurações TEF
    public string? ConfiguracaoTEF { get; set; }
    
    // Relacionamentos
    public virtual ICollection<Filial> Filiais { get; set; } = new List<Filial>();
    public virtual ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
} 
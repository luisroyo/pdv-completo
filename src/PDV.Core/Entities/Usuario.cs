using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PDV.Core.Entities;

public class Usuario : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Nome { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(50)]
    public string Login { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(255)]
    public string Senha { get; set; } = string.Empty;
    
    [MaxLength(100)]
    public string? Email { get; set; }
    
    [MaxLength(20)]
    public string? Telefone { get; set; }
    
    [MaxLength(11)]
    public string? CPF { get; set; }
    
    public TipoUsuario Tipo { get; set; }
    
    public bool RequerSenha { get; set; } = true;
    
    public DateTime? UltimoAcesso { get; set; }
    
    public DateTime? UltimaAlteracaoSenha { get; set; }
    
    // Relacionamentos
    [Required]
    public Guid EmpresaId { get; set; }
    public virtual Empresa Empresa { get; set; } = null!;
    
    public Guid? FilialId { get; set; }
    public virtual Filial? Filial { get; set; }
    
    public virtual ICollection<Permissao> Permissoes { get; set; } = new List<Permissao>();
    public virtual ICollection<Caixa> Caixas { get; set; } = new List<Caixa>();
}

public enum TipoUsuario
{
    Administrador = 1,
    Gerente = 2,
    Operador = 3,
    Supervisor = 4
} 
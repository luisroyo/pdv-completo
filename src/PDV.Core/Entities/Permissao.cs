using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PDV.Core.Entities;

public class Permissao : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Nome { get; set; } = string.Empty;
    
    [MaxLength(255)]
    public string? Descricao { get; set; }
    
    public ModuloSistema Modulo { get; set; }
    
    public TipoPermissao Tipo { get; set; }
    
    // Relacionamentos
    public Guid? UsuarioId { get; set; }
    public virtual Usuario? Usuario { get; set; }
    
    public Guid? GrupoPermissaoId { get; set; }
    public virtual GrupoPermissao? GrupoPermissao { get; set; }
}

public class GrupoPermissao : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Nome { get; set; } = string.Empty;
    
    [MaxLength(255)]
    public string? Descricao { get; set; }
    
    // Relacionamentos
    public virtual ICollection<Permissao> Permissoes { get; set; } = new List<Permissao>();
    public virtual ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
}

public enum ModuloSistema
{
    Vendas = 1,
    Produtos = 2,
    Clientes = 3,
    Relatorios = 4,
    Configuracoes = 5,
    Fiscal = 6,
    Caixa = 7,
    Usuarios = 8,
    Backup = 9
}

public enum TipoPermissao
{
    Visualizar = 1,
    Incluir = 2,
    Alterar = 3,
    Excluir = 4,
    Imprimir = 5,
    Cancelar = 6,
    Administrar = 7
} 
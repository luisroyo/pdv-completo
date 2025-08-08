using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using PDV.Core.Entities;
using PDV.Application.Services;

namespace PDV.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IConfiguration configuration, ILogger<AuthController> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        try
        {
            // TODO: Implementar validação real com banco de dados
            // Por enquanto, vamos simular um login básico
            if (request.Username == "admin" && request.Password == "123456")
            {
                var token = GenerateJwtToken(request.Username, "Administrador");
                
                return Ok(new LoginResponse
                {
                    Token = token,
                    Username = request.Username,
                    Nome = "Administrador",
                    Permissoes = new[] { "vendas", "caixa", "relatorios", "configuracoes" }
                });
            }

            return Unauthorized(new { error = "Usuário ou senha inválidos" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro no login");
            return StatusCode(500, new { error = "Erro interno do servidor" });
        }
    }

    [HttpPost("logout")]
    public ActionResult Logout()
    {
        // Em uma implementação real, você invalidaria o token
        return Ok(new { message = "Logout realizado com sucesso" });
    }

    [HttpGet("me")]
    public ActionResult<UsuarioInfo> GetCurrentUser()
    {
        var username = User.Identity?.Name;
        if (string.IsNullOrEmpty(username))
        {
            return Unauthorized();
        }

        return Ok(new UsuarioInfo
        {
            Username = username,
            Nome = "Administrador",
            Permissoes = new[] { "vendas", "caixa", "relatorios", "configuracoes" }
        });
    }

    private string GenerateJwtToken(string username, string nome)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "sua_chave_secreta_muito_longa_aqui"));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.Name, username),
            new Claim(ClaimTypes.NameIdentifier, username),
            new Claim("nome", nome)
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"] ?? "PDV",
            audience: _configuration["Jwt:Audience"] ?? "PDV",
            claims: claims,
            expires: DateTime.Now.AddHours(8),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public class LoginRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Nome { get; set; } = string.Empty;
    public string[] Permissoes { get; set; } = Array.Empty<string>();
}

public class UsuarioInfo
{
    public string Username { get; set; } = string.Empty;
    public string Nome { get; set; } = string.Empty;
    public string[] Permissoes { get; set; } = Array.Empty<string>();
} 
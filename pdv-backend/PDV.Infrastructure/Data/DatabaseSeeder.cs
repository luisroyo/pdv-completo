using Microsoft.EntityFrameworkCore;
using PDV.Core.Entities;
using BCrypt.Net;

namespace PDV.Infrastructure.Data;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(PDVDbContext context)
    {
        // Verifica se já há dados no banco
        if (await context.Empresas.AnyAsync())
            return;

        // Cria apenas uma empresa básica para o sistema funcionar
        await SeedEmpresaBasicaAsync(context);
        
        await context.SaveChangesAsync();
    }

    private static async Task SeedEmpresaBasicaAsync(PDVDbContext context)
    {
        var empresa = new Empresa
        {
            RazaoSocial = "Empresa Padrão",
            NomeFantasia = "Empresa Padrão",
            CNPJ = "00.000.000/0001-00",
            UF = "SP",
            Endereco = "Rua Padrão",
            Numero = "123",
            Bairro = "Centro",
            Cidade = "São Paulo",
            CEP = "00000-000"
        };

        await context.Empresas.AddAsync(empresa);
        await context.SaveChangesAsync();

        // Criar uma filial padrão
        var filial = new Filial
        {
            Nome = "Filial Principal",
            Codigo = "001",
            Endereco = "Rua Padrão",
            Numero = "123",
            Bairro = "Centro",
            Cidade = "São Paulo",
            UF = "SP",
            CEP = "00000-000",
            EmpresaId = empresa.Id
        };

        await context.Filiais.AddAsync(filial);
        await context.SaveChangesAsync();

        // Criar um grupo de permissão administrador
        var grupoAdmin = new GrupoPermissao
        {
            Nome = "Administrador",
            Descricao = "Grupo com todas as permissões do sistema"
        };

        await context.GruposPermissao.AddAsync(grupoAdmin);
        await context.SaveChangesAsync();

        // Criar um usuário administrador padrão
        var usuarioAdmin = new Usuario
        {
            Nome = "Administrador",
            Login = "admin",
            Senha = BCrypt.Net.BCrypt.HashPassword("123456"),
            Email = "admin@empresa.com",
            Tipo = TipoUsuario.Administrador,
            RequerSenha = true,
            EmpresaId = empresa.Id,
            FilialId = filial.Id
        };

        await context.Usuarios.AddAsync(usuarioAdmin);
        await context.SaveChangesAsync();
    }
} 
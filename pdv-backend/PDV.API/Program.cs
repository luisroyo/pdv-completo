using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using PDV.Infrastructure.Data;
using PDV.Infrastructure.Repositories;
using PDV.Core.Interfaces;
using PDV.Application.Services;
// using PDV.Fiscal.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configurar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Configurar banco de dados
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrEmpty(connectionString))
{
    // Fallback para SQLite local
    connectionString = "Data Source=pdv.db";
}

if (connectionString.Contains("Server=") || connectionString.Contains("Host="))
{
    // PostgreSQL
    builder.Services.AddDbContext<PDVDbContext>(options =>
        options.UseNpgsql(connectionString));
}
else
{
    // SQLite
    builder.Services.AddDbContext<PDVDbContext>(options =>
        options.UseSqlite(connectionString));
}

// Configurar autenticação JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "PDV",
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "PDV",
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? "sua_chave_secreta_muito_longa_aqui")
            )
        };
    });

// Registrar serviços
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<VendaService>();
// builder.Services.AddScoped<NFCeService>();

// Configurar logging
builder.Services.AddLogging(logging =>
{
    logging.AddConsole();
    logging.AddDebug();
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Criar banco de dados se não existir
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<PDVDbContext>();
    context.Database.EnsureCreated();
}

app.Run(); 
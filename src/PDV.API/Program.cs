using Microsoft.EntityFrameworkCore;
using PDV.Infrastructure.Data;
using PDV.Infrastructure.Repositories;
using PDV.Core.Interfaces;
using PDV.Application.Services;
using PDV.Fiscal.Services;

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

// Registrar serviços
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<VendaService>();
builder.Services.AddScoped<NFCeService>();

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
app.UseAuthorization();
app.MapControllers();

// Criar banco de dados se não existir
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<PDVDbContext>();
    context.Database.EnsureCreated();
}

app.Run(); 
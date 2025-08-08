# Script de inicialização do PDV Fiscal
# Execute como administrador

Write-Host "=== PDV FISCAL - Sistema de Ponto de Venda ===" -ForegroundColor Green
Write-Host "Iniciando sistema..." -ForegroundColor Yellow

# Verificar se o .NET 8 está instalado
Write-Host "Verificando .NET 8..." -ForegroundColor Cyan
try {
    $dotnetVersion = dotnet --version
    if ($dotnetVersion -like "8.*") {
        Write-Host "✓ .NET 8 encontrado: $dotnetVersion" -ForegroundColor Green
    }
    else {
        Write-Host "✗ .NET 8 não encontrado. Instale o .NET 8 SDK." -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Host "✗ .NET 8 não encontrado. Instale o .NET 8 SDK." -ForegroundColor Red
    exit 1
}

# Verificar se o WebView2 está instalado
Write-Host "Verificando WebView2 Runtime..." -ForegroundColor Cyan
$webview2Path = "C:\Program Files (x86)\Microsoft\EdgeWebView\Application\msedgewebview2.exe"
if (Test-Path $webview2Path) {
    Write-Host "✓ WebView2 Runtime encontrado" -ForegroundColor Green
}
else {
    Write-Host "⚠ WebView2 Runtime não encontrado. Baixe em: https://developer.microsoft.com/en-us/microsoft-edge/webview2/" -ForegroundColor Yellow
}

# Restaurar dependências
Write-Host "Restaurando dependências..." -ForegroundColor Cyan
dotnet restore
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Erro ao restaurar dependências" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Dependências restauradas" -ForegroundColor Green

# Verificar se o PostgreSQL está rodando (opcional)
Write-Host "Verificando PostgreSQL..." -ForegroundColor Cyan
try {
    $pgTest = Test-NetConnection -ComputerName localhost -Port 5432 -InformationLevel Quiet
    if ($pgTest) {
        Write-Host "✓ PostgreSQL está rodando" -ForegroundColor Green
        $usePostgres = $true
    }
    else {
        Write-Host "⚠ PostgreSQL não está rodando. Usando SQLite." -ForegroundColor Yellow
        $usePostgres = $false
    }
}
catch {
    Write-Host "⚠ PostgreSQL não está rodando. Usando SQLite." -ForegroundColor Yellow
    $usePostgres = $false
}

# Criar banco de dados se necessário
if ($usePostgres) {
    Write-Host "Configurando banco PostgreSQL..." -ForegroundColor Cyan
    # Aqui você pode adicionar comandos para criar o banco se necessário
}
else {
    Write-Host "Usando SQLite (banco local)" -ForegroundColor Cyan
}

# Executar migrações
Write-Host "Executando migrações..." -ForegroundColor Cyan
Set-Location "src\PDV.API"
dotnet ef database update
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠ Erro nas migrações, mas continuando..." -ForegroundColor Yellow
}
Set-Location "..\.."

# Iniciar API em background
Write-Host "Iniciando API..." -ForegroundColor Cyan
Start-Process -FilePath "dotnet" -ArgumentList "run" -WorkingDirectory "src\PDV.API" -WindowStyle Minimized
$apiProcess = $LASTEXITCODE

# Aguardar API inicializar
Write-Host "Aguardando API inicializar..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

# Verificar se a API está rodando
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/swagger" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ API está rodando" -ForegroundColor Green
    }
    else {
        Write-Host "⚠ API pode não estar funcionando corretamente" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "⚠ Não foi possível conectar à API" -ForegroundColor Yellow
}

# Iniciar aplicação desktop
Write-Host "Iniciando aplicação desktop..." -ForegroundColor Cyan
Start-Process -FilePath "dotnet" -ArgumentList "run" -WorkingDirectory "src\PDV.Desktop"

Write-Host "=== Sistema iniciado com sucesso! ===" -ForegroundColor Green
Write-Host "API: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Swagger: http://localhost:5000/swagger" -ForegroundColor Cyan
if ($usePostgres) {
    Write-Host "PgAdmin: http://localhost:8080" -ForegroundColor Cyan
}

Write-Host "Pressione qualquer tecla para sair..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 
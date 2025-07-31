# =====================================================
# TwoLifeCar - Script de Despliegue a Producción
# =====================================================

param(
    [Parameter(Mandatory=$false)]
    [switch]$SetupSSL = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipBuild = $false,
    
    [Parameter(Mandatory=$false)]
    [string]$Domain = "3910.efdiaz.xyz"
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 TwoLifeCar - Despliegue a Producción" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

# Verificar Docker
try {
    docker info | Out-Null
    Write-Host "✅ Docker está disponible" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker no está disponible. Instala Docker Desktop." -ForegroundColor Red
    exit 1
}

# Verificar docker-compose
try {
    docker-compose version | Out-Null
    Write-Host "✅ Docker Compose está disponible" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose no está disponible." -ForegroundColor Red
    exit 1
}

# Verificar archivo de entorno
if (!(Test-Path ".env")) {
    if (Test-Path ".env.production") {
        Write-Host "📋 Copiando .env.production a .env..." -ForegroundColor Blue
        Copy-Item ".env.production" ".env"
    } else {
        Write-Host "⚠️  Archivo .env no encontrado. Creando archivo básico..." -ForegroundColor Yellow
        @"
MONGODB_URI=mongodb://mongo:27017/twolifecar_prod
NODE_ENV=production
DOMAIN=$Domain
"@ | Out-File -FilePath ".env" -Encoding UTF8
    }
}

# Parar servicios existentes
Write-Host "⏹️ Deteniendo servicios existentes..." -ForegroundColor Yellow
docker-compose down --remove-orphans

# Limpiar imágenes antiguas (opcional)
if (!$SkipBuild) {
    Write-Host "🧹 Limpiando imágenes antiguas..." -ForegroundColor Blue
    docker system prune -f
    
    # Construir imágenes
    Write-Host "🔨 Construyendo imágenes de producción..." -ForegroundColor Blue
    docker-compose build --no-cache
}

# Configurar SSL si se solicita
if ($SetupSSL) {
    Write-Host "🔐 Configurando SSL..." -ForegroundColor Blue
    
    # Verificar que el dominio apunte al servidor
    try {
        $dnsResult = Resolve-DnsName $Domain -ErrorAction Stop
        Write-Host "✅ DNS resuelve correctamente para $Domain" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  No se pudo resolver DNS para $Domain" -ForegroundColor Yellow
        Write-Host "   Asegúrate de que el dominio apunte a este servidor" -ForegroundColor Yellow
    }
    
    # Ejecutar configuración SSL
    & ".\scripts\setup-ssl.ps1" -Domain $Domain
} else {
    Write-Host "🌐 Iniciando servicios sin SSL..." -ForegroundColor Blue
    docker-compose up -d
}

# Esperar a que los servicios se inicien
Write-Host "⏳ Esperando a que los servicios se inicien..." -ForegroundColor Blue
Start-Sleep -Seconds 15

# Verificar estado de servicios
Write-Host "🔍 Verificando estado de servicios..." -ForegroundColor Blue
$services = @("api", "dashboard", "landing", "nginx")
$allHealthy = $true

foreach ($service in $services) {
    try {
        $containerState = docker-compose ps $service --format "table {{.State}}" | Select-Object -Skip 1
        if ($containerState -eq "Up") {
            Write-Host "  ✅ $service - Funcionando" -ForegroundColor Green
        } else {
            Write-Host "  ❌ $service - $containerState" -ForegroundColor Red
            $allHealthy = $false
        }
    } catch {
        Write-Host "  ❌ $service - Error al verificar estado" -ForegroundColor Red
        $allHealthy = $false
    }
}

# Test de conectividad
Write-Host ""
Write-Host "🌐 Realizando tests de conectividad..." -ForegroundColor Blue

$protocol = if ($SetupSSL) { "https" } else { "http" }
$port = if ($SetupSSL) { "" } else { ":8080" }
$baseUrl = "$protocol://www.$Domain$port"

$endpoints = @(
    @{ Name = "Landing Page"; Url = "$baseUrl/" }
    @{ Name = "API Health"; Url = "$baseUrl/api/" }
    @{ Name = "Dashboard"; Url = "$baseUrl/dashboard" }
    @{ Name = "Health Check"; Url = "$baseUrl/health" }
)

foreach ($endpoint in $endpoints) {
    try {
        $response = Invoke-WebRequest -Uri $endpoint.Url -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "  ✅ $($endpoint.Name) - OK" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  $($endpoint.Name) - Status: $($response.StatusCode)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  ❌ $($endpoint.Name) - Error: $($_.Exception.Message)" -ForegroundColor Red
        $allHealthy = $false
    }
}

# Mostrar logs si hay problemas
if (!$allHealthy) {
    Write-Host ""
    Write-Host "📋 Mostrando logs de servicios con problemas..." -ForegroundColor Yellow
    docker-compose logs --tail=20
}

# Resumen final
Write-Host ""
Write-Host "=======================================" -ForegroundColor Green
if ($allHealthy) {
    Write-Host "🎉 ¡Despliegue exitoso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Tu aplicación está disponible en:" -ForegroundColor Blue
    Write-Host "   - $baseUrl" -ForegroundColor Cyan
    Write-Host "   - $baseUrl/dashboard (Panel de control)" -ForegroundColor Cyan
    Write-Host "   - $baseUrl/api/ (API)" -ForegroundColor Cyan
    
    if ($SetupSSL) {
        Write-Host ""
        Write-Host "🔐 SSL configurado correctamente" -ForegroundColor Green
        Write-Host "📝 Para renovar certificados: .\docker\ssl\renew-ssl.ps1" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  Despliegue completado con advertencias" -ForegroundColor Yellow
    Write-Host "📋 Revisa los logs para más detalles: docker-compose logs" -ForegroundColor Blue
}

Write-Host ""
Write-Host "📊 Comandos útiles:" -ForegroundColor Blue
Write-Host "   docker-compose ps              # Ver estado de servicios" -ForegroundColor White
Write-Host "   docker-compose logs -f         # Ver logs en tiempo real" -ForegroundColor White
Write-Host "   docker-compose restart         # Reiniciar servicios" -ForegroundColor White
Write-Host "   docker-compose down            # Parar servicios" -ForegroundColor White

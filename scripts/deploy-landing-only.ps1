# =====================================================
# TwoLifeCar - Despliegue SOLO Landing Page
# Script para subir únicamente la landing a www.3210.efdiaz.xyz
# =====================================================

param(
    [Parameter(Mandatory=$false)]
    [switch]$SetupSSL = $false,
    
    [Parameter(Mandatory=$false)]
    [string]$Domain = "3210.efdiaz.xyz"
)

$ErrorActionPreference = "Stop"

Write-Host "🌐 TwoLifeCar - Despliegue Landing Page ÚNICAMENTE" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
Write-Host "Dominio: https://www.$Domain" -ForegroundColor Cyan

# Verificar Docker
try {
    docker info | Out-Null
    Write-Host "✅ Docker está disponible" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker no está disponible. Instala Docker Desktop." -ForegroundColor Red
    exit 1
}

# Parar todos los servicios existentes
Write-Host "⏹️ Deteniendo todos los servicios existentes..." -ForegroundColor Yellow
docker-compose down --remove-orphans 2>$null
docker-compose -f docker-compose.dev.yml down --remove-orphans 2>$null
docker-compose -f docker-compose.test.yml down --remove-orphans 2>$null

# Limpiar contenedores
Write-Host "🧹 Limpiando contenedores..." -ForegroundColor Blue
docker container prune -f

# Construir solo la landing
Write-Host "🔨 Construyendo SOLO la Landing Page..." -ForegroundColor Blue
docker-compose -f docker-compose.landing.yml build --no-cache landing

# Configurar SSL si se solicita
if ($SetupSSL) {
    Write-Host "🔐 Configurando SSL para $Domain..." -ForegroundColor Blue
    
    # Crear directorio SSL
    $SSLDir = ".\docker\ssl"
    if (!(Test-Path $SSLDir)) {
        New-Item -ItemType Directory -Path $SSLDir -Force
    }
    
    # Verificar DNS
    try {
        Resolve-DnsName $Domain -ErrorAction Stop | Out-Null
        Write-Host "✅ DNS resuelve para $Domain" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  DNS no resuelve para $Domain - continuando..." -ForegroundColor Yellow
    }
    
    Write-Host "📜 Obteniendo certificados SSL..." -ForegroundColor Blue
    Write-Host "⚠️  El dominio DEBE apuntar a este servidor" -ForegroundColor Yellow
    
    # Obtener certificados SSL
    try {
        docker run --rm -it `
            -v "${PWD}\${SSLDir}:/etc/letsencrypt" `
            -p "80:80" `
            certbot/certbot certonly `
            --standalone `
            --email "admin@$Domain" `
            --agree-tos `
            --no-eff-email `
            -d $Domain `
            -d "www.$Domain"
        
        # Copiar certificados
        $livePath = "$SSLDir\live\$Domain"
        if (Test-Path $livePath) {
            Copy-Item "$livePath\fullchain.pem" "$SSLDir\" -Force
            Copy-Item "$livePath\privkey.pem" "$SSLDir\" -Force
            Write-Host "✅ Certificados SSL configurados" -ForegroundColor Green
        }
    } catch {
        Write-Host "❌ Error configurando SSL. Continuando sin SSL..." -ForegroundColor Red
        $SetupSSL = $false
    }
}

# Iniciar solo la landing
Write-Host "🚀 Iniciando Landing Page..." -ForegroundColor Green
docker-compose -f docker-compose.landing.yml up -d

# Esperar a que inicie
Write-Host "⏳ Esperando a que la Landing Page se inicie..." -ForegroundColor Blue
Start-Sleep -Seconds 10

# Verificar estado
Write-Host "🔍 Verificando servicios..." -ForegroundColor Blue
$services = @("landing", "nginx")
$allHealthy = $true

foreach ($service in $services) {
    try {
        $state = docker-compose -f docker-compose.landing.yml ps $service --format "table {{.State}}" | Select-Object -Skip 1
        if ($state -eq "Up") {
            Write-Host "  ✅ $service - Funcionando" -ForegroundColor Green
        } else {
            Write-Host "  ❌ $service - $state" -ForegroundColor Red
            $allHealthy = $false
        }
    } catch {
        Write-Host "  ❌ $service - Error verificando" -ForegroundColor Red
        $allHealthy = $false
    }
}

# Test de conectividad
Write-Host ""
Write-Host "🌐 Probando conectividad..." -ForegroundColor Blue

if ($SetupSSL) {
    $testUrl = "https://www.$Domain"
} else {
    $testUrl = "http://www.$Domain"
}

try {
    $response = Invoke-WebRequest -Uri $testUrl -UseBasicParsing -TimeoutSec 15 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Landing Page accesible correctamente" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Landing Page no accesible aún - puede tardar unos minutos" -ForegroundColor Yellow
    $allHealthy = $false
}

# Test de health check local
try {
    $healthUrl = if ($SetupSSL) { "https://www.$Domain/health" } else { "http://localhost/health" }
    $healthResponse = Invoke-WebRequest -Uri $healthUrl -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    if ($healthResponse.StatusCode -eq 200) {
        Write-Host "✅ Health check OK" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Health check no disponible" -ForegroundColor Yellow
}

# Resumen final
Write-Host ""
Write-Host "=================================================" -ForegroundColor Green
if ($allHealthy) {
    Write-Host "🎉 ¡Landing Page desplegada exitosamente!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Landing Page desplegada con advertencias" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🌐 Tu Landing Page está disponible en:" -ForegroundColor Blue
Write-Host "   - $testUrl" -ForegroundColor Cyan

if ($SetupSSL) {
    Write-Host "🔐 SSL configurado - Acceso seguro habilitado" -ForegroundColor Green
}

Write-Host ""
Write-Host "📊 Comandos útiles:" -ForegroundColor Blue
Write-Host "   docker-compose -f docker-compose.landing.yml ps" -ForegroundColor White
Write-Host "   docker-compose -f docker-compose.landing.yml logs -f" -ForegroundColor White
Write-Host "   docker-compose -f docker-compose.landing.yml restart" -ForegroundColor White
Write-Host "   docker-compose -f docker-compose.landing.yml down" -ForegroundColor White

# Mostrar logs si hay problemas
if (!$allHealthy) {
    Write-Host ""
    Write-Host "📋 Logs recientes:" -ForegroundColor Yellow
    docker-compose -f docker-compose.landing.yml logs --tail=10
}

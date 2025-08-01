# =====================================================
# TwoLifeCar - Configuración SSL para Producción
# Script PowerShell para Windows
# =====================================================

param(
    [Parameter(Mandatory=$false)]
    [string]$Domain = "3210.efdiaz.xyz",
    
    [Parameter(Mandatory=$false)]
    [string]$Email = "admin@3210.efdiaz.xyz"
)

Write-Host "🔐 Configurando SSL para TwoLifeCar en $Domain" -ForegroundColor Green

# Verificar que Docker esté corriendo
try {
    docker info | Out-Null
    Write-Host "✅ Docker está corriendo" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker no está corriendo. Inicia Docker Desktop primero." -ForegroundColor Red
    exit 1
}

# Crear directorio SSL
$SSLDir = ".\docker\ssl"
if (!(Test-Path $SSLDir)) {
    New-Item -ItemType Directory -Path $SSLDir -Force
    Write-Host "📁 Directorio SSL creado: $SSLDir" -ForegroundColor Blue
}

# Parar servicios existentes
Write-Host "⏹️ Deteniendo servicios existentes..." -ForegroundColor Yellow
docker-compose down

Write-Host "📜 Obteniendo certificados SSL de Let's Encrypt..." -ForegroundColor Blue
Write-Host "⚠️  IMPORTANTE: Asegúrate de que $Domain apunta a este servidor" -ForegroundColor Yellow

# Obtener certificados SSL usando certbot
$certbotCmd = @(
    "run", "--rm", "-it"
    "-v", "${PWD}\${SSLDir}:/etc/letsencrypt"
    "-v", "${PWD}\${SSLDir}\www:/var/www/certbot"
    "-p", "80:80"
    "certbot/certbot", "certonly"
    "--standalone"
    "--email", $Email
    "--agree-tos"
    "--no-eff-email"
    "-d", $Domain
    "-d", "www.$Domain"
)

try {
    & docker @certbotCmd
    Write-Host "✅ Certificados obtenidos exitosamente" -ForegroundColor Green
} catch {
    Write-Host "❌ Error al obtener certificados SSL" -ForegroundColor Red
    Write-Host "Verifica que:" -ForegroundColor Yellow
    Write-Host "  1. El dominio $Domain apunta a este servidor" -ForegroundColor Yellow
    Write-Host "  2. No hay otros servicios usando el puerto 80" -ForegroundColor Yellow
    Write-Host "  3. El firewall permite conexiones en puerto 80" -ForegroundColor Yellow
    exit 1
}

# Copiar certificados a ubicación esperada por nginx
$liveCertPath = "$SSLDir\live\$Domain"
if (Test-Path $liveCertPath) {
    Write-Host "📋 Copiando certificados..." -ForegroundColor Blue
    
    Copy-Item "$liveCertPath\fullchain.pem" "$SSLDir\" -Force
    Copy-Item "$liveCertPath\privkey.pem" "$SSLDir\" -Force
    
    Write-Host "✅ Certificados copiados correctamente" -ForegroundColor Green
} else {
    Write-Host "❌ Error: No se encontraron los certificados en $liveCertPath" -ForegroundColor Red
    exit 1
}

# Crear script de renovación
$renewScript = @"
# Script de renovación automática de SSL para Windows
param([string]`$Domain = "$Domain")

Write-Host "🔄 Renovando certificados SSL para `$Domain..." -ForegroundColor Blue

# Parar nginx temporalmente
docker-compose stop nginx

# Renovar certificados
docker run --rm ``
    -v "`${PWD}\docker\ssl:/etc/letsencrypt" ``
    -v "`${PWD}\docker\ssl\www:/var/www/certbot" ``
    -p "80:80" ``
    certbot/certbot renew

# Copiar certificados renovados
`$livePath = ".\docker\ssl\live\`$Domain"
if (Test-Path `$livePath) {
    Copy-Item "`$livePath\fullchain.pem" ".\docker\ssl\" -Force
    Copy-Item "`$livePath\privkey.pem" ".\docker\ssl\" -Force
    Write-Host "✅ Certificados renovados y copiados" -ForegroundColor Green
} else {
    Write-Host "❌ Error: No se encontraron certificados renovados" -ForegroundColor Red
}

# Reiniciar nginx
docker-compose start nginx
Write-Host "✅ Servicios reiniciados" -ForegroundColor Green
"@

$renewScript | Out-File -FilePath "$SSLDir\renew-ssl.ps1" -Encoding UTF8
Write-Host "📝 Script de renovación creado: $SSLDir\renew-ssl.ps1" -ForegroundColor Blue

# Levantar servicios con SSL
Write-Host "🚀 Iniciando servicios con SSL..." -ForegroundColor Green
docker-compose up -d

# Esperar a que los servicios se inicien
Start-Sleep -Seconds 10

# Verificar servicios
Write-Host "🔍 Verificando servicios..." -ForegroundColor Blue
$services = docker-compose ps --services
foreach ($service in $services) {
    $status = docker-compose ps $service --format "table {{.State}}" | Select-Object -Skip 1
    if ($status -eq "Up") {
        Write-Host "  ✅ $service" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $service - $status" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎉 ¡Configuración SSL completada!" -ForegroundColor Green
Write-Host "🌐 Tu aplicación está disponible en:" -ForegroundColor Blue
Write-Host "   - https://www.$Domain" -ForegroundColor Cyan
Write-Host "   - https://$Domain" -ForegroundColor Cyan
Write-Host "   - https://www.$Domain/dashboard (Panel de control)" -ForegroundColor Cyan
Write-Host "   - https://www.$Domain/api/ (API)" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Para renovar certificados, ejecuta:" -ForegroundColor Yellow
Write-Host "   .\docker\ssl\renew-ssl.ps1" -ForegroundColor White
Write-Host ""
Write-Host "⏰ Para renovación automática, programa una tarea en Windows que ejecute:" -ForegroundColor Yellow
Write-Host "   PowerShell.exe -File '$(Get-Location)\docker\ssl\renew-ssl.ps1'" -ForegroundColor White

# Test de conectividad
Write-Host ""
Write-Host "🔍 Realizando test de conectividad..." -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri "https://www.$Domain/health" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Health check exitoso - Aplicación funcionando correctamente" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Health check falló - La aplicación puede tardar unos minutos en estar disponible" -ForegroundColor Yellow
    Write-Host "   Intenta acceder en unos minutos: https://www.$Domain" -ForegroundColor Yellow
}

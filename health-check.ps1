# TwoLifeCar Stack Health Check Script (PowerShell)
# Verifica que todos los servicios estén funcionando correctamente

param(
    [switch]$Detailed,
    [switch]$Json
)

Write-Host "🏥 TwoLifeCar Stack Health Check" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Función para verificar servicio HTTP
function Test-HttpService {
    param(
        [string]$Url,
        [string]$ServiceName
    )
    
    Write-Host "Checking $ServiceName ($Url)... " -NoNewline
    
    try {
        $response = Invoke-WebRequest -Uri $Url -Method Head -TimeoutSec 5 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ OK" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ FAILED (Status: $($response.StatusCode))" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ FAILED (Error: $($_.Exception.Message))" -ForegroundColor Red
        return $false
    }
}

# Función para verificar puerto TCP
function Test-TcpPort {
    param(
        [string]$HostName,
        [int]$Port,
        [string]$ServiceName
    )
    
    Write-Host "Checking $ServiceName ($HostName`:$Port)... " -NoNewline
    
    try {
        $tcpClient = New-Object System.Net.Sockets.TcpClient
        $tcpClient.ConnectAsync($HostName, $Port).Wait(3000)
        
        if ($tcpClient.Connected) {
            Write-Host "✅ OK" -ForegroundColor Green
            $tcpClient.Close()
            return $true
        } else {
            Write-Host "❌ FAILED" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ FAILED" -ForegroundColor Red
        return $false
    }
}

# Función para verificar contenedor Docker
function Test-DockerContainer {
    param(
        [string]$ContainerName,
        [string]$ServiceName
    )
    
    Write-Host "Checking Docker container $ServiceName... " -NoNewline
    
    try {
        $containers = docker ps --format "{{.Names}}" 2>$null
        if ($containers -contains $ContainerName) {
            Write-Host "✅ RUNNING" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ NOT RUNNING" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ DOCKER ERROR" -ForegroundColor Red
        return $false
    }
}

# Verificar si Docker está disponible
try {
    docker --version | Out-Null
} catch {
    Write-Host "❌ Docker no está disponible o no está ejecutándose" -ForegroundColor Red
    exit 1
}

Write-Host "🐳 Docker Containers Status:" -ForegroundColor Yellow
Write-Host "----------------------------"

# Verificar contenedores Docker
$containerResults = @{
    "Landing" = Test-DockerContainer "twolifecar-landing-dev" "Landing Page"
    "Dashboard" = Test-DockerContainer "twolifecar-dashboard-dev" "Dashboard"
    "API" = Test-DockerContainer "twolifecar-api-dev" "API"
    "MongoDB" = Test-DockerContainer "twolifecar-mongodb-dev" "MongoDB"
    "Nginx" = Test-DockerContainer "twolifecar-nginx-dev" "Nginx"
}

Write-Host ""
Write-Host "🌐 HTTP Services Status:" -ForegroundColor Yellow
Write-Host "------------------------"

# Verificar servicios HTTP
$httpResults = @{
    "Landing" = Test-HttpService "http://localhost:3000" "Landing Page"
    "Dashboard" = Test-HttpService "http://localhost:3001" "Dashboard"
    "API" = Test-HttpService "http://localhost:5001" "API"
    "Nginx" = Test-HttpService "http://localhost:8080" "Nginx Proxy"
}

Write-Host ""
Write-Host "🔌 TCP Ports Status:" -ForegroundColor Yellow
Write-Host "-------------------"

# Verificar puertos TCP
$portResults = @{
    "Landing" = Test-TcpPort "localhost" 3000 "Landing Port"
    "Dashboard" = Test-TcpPort "localhost" 3001 "Dashboard Port"
    "API" = Test-TcpPort "localhost" 5001 "API Port"
    "Nginx" = Test-TcpPort "localhost" 8080 "Nginx Port"
    "MongoDB" = Test-TcpPort "localhost" 27017 "MongoDB Port"
}

Write-Host ""
Write-Host "🔍 API Endpoints Test:" -ForegroundColor Yellow
Write-Host "---------------------"

# Verificar endpoints específicos de la API
Write-Host "Testing API health endpoint... " -NoNewline
try {
    $apiResponse = Invoke-RestMethod -Uri "http://localhost:5001/" -TimeoutSec 5
    if ($apiResponse -like "*TwoLifeCar*") {
        Write-Host "✅ OK" -ForegroundColor Green
        $apiHealthy = $true
    } else {
        Write-Host "❌ FAILED" -ForegroundColor Red
        $apiHealthy = $false
    }
} catch {
    Write-Host "❌ FAILED" -ForegroundColor Red
    $apiHealthy = $false
}

Write-Host "Testing API leads endpoint... " -NoNewline
try {
    Invoke-RestMethod -Uri "http://localhost:5001/api/leads" -TimeoutSec 5 | Out-Null
    Write-Host "✅ OK" -ForegroundColor Green
    $leadsHealthy = $true
} catch {
    Write-Host "⚠️ NEEDS VERIFICATION" -ForegroundColor Yellow
    $leadsHealthy = $false
}

if ($Detailed) {
    Write-Host ""
    Write-Host "📊 Resource Usage:" -ForegroundColor Yellow
    Write-Host "------------------"
    
    try {
        $dockerStats = docker stats --no-stream --format "table {{.Name}}`t{{.CPUPerc}}`t{{.MemUsage}}`t{{.NetIO}}`t{{.BlockIO}}" 2>$null
        $dockerStats | Select-Object -First 6 | ForEach-Object { Write-Host $_ }
    } catch {
        Write-Host "❌ No se pudo obtener estadísticas de Docker" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🏁 Health Check Complete!" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan

# Contar servicios funcionando
try {
    $containersRunning = (docker ps -q 2>$null | Measure-Object).Count
    Write-Host "Docker containers running: $containersRunning/5"
} catch {
    Write-Host "No se pudo contar contenedores Docker"
}

# Verificar si todos los servicios están OK
$allServicesHealthy = $httpResults.Values -and $portResults.Values -and $containerResults.Values
$healthyCount = ($httpResults.Values + $portResults.Values + $containerResults.Values | Where-Object { $_ -eq $true }).Count
$totalChecks = $httpResults.Count + $portResults.Count + $containerResults.Count

Write-Host "Health Score: $healthyCount/$totalChecks checks passed"

if ($Json) {
    $healthReport = @{
        timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        containers = $containerResults
        httpServices = $httpResults
        ports = $portResults
        api = @{
            health = $apiHealthy
            leads = $leadsHealthy
        }
        summary = @{
            healthy = $allServicesHealthy
            score = "$healthyCount/$totalChecks"
            containersRunning = $containersRunning
        }
    }
    
    Write-Host ""
    Write-Host "📋 JSON Report:" -ForegroundColor Yellow
    $healthReport | ConvertTo-Json -Depth 3
}

if ($allServicesHealthy -and $apiHealthy) {
    Write-Host ""
    Write-Host "🎉 ALL SERVICES ARE HEALTHY!" -ForegroundColor Green
    exit 0
} else {
    Write-Host ""
    Write-Host "⚠️ SOME SERVICES NEED ATTENTION" -ForegroundColor Red
    
    # Mostrar servicios con problemas
    Write-Host ""
    Write-Host "Services with issues:" -ForegroundColor Yellow
    
    $containerResults.GetEnumerator() | Where-Object { -not $_.Value } | ForEach-Object {
        Write-Host "  - Container $($_.Key): Not running" -ForegroundColor Red
    }
    
    $httpResults.GetEnumerator() | Where-Object { -not $_.Value } | ForEach-Object {
        Write-Host "  - HTTP $($_.Key): Not responding" -ForegroundColor Red
    }
    
    $portResults.GetEnumerator() | Where-Object { -not $_.Value } | ForEach-Object {
        Write-Host "  - Port $($_.Key): Not accessible" -ForegroundColor Red
    }
    
    if (-not $apiHealthy) {
        Write-Host "  - API Health: Failed" -ForegroundColor Red
    }
    
    exit 1
}

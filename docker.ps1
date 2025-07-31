# TwoLifeCar Docker Management PowerShell Script

param(
    [Parameter(Mandatory=$true)]
    [string]$Command,
    [string]$Service = "",
    [string]$Environment = "prod"
)

function Write-Status($message) {
    Write-Host "[INFO] $message" -ForegroundColor Blue
}

function Write-Success($message) {
    Write-Host "[SUCCESS] $message" -ForegroundColor Green
}

function Write-Warning($message) {
    Write-Host "[WARNING] $message" -ForegroundColor Yellow
}

function Write-Error($message) {
    Write-Host "[ERROR] $message" -ForegroundColor Red
}

function Test-EnvFile {
    if (-not (Test-Path ".env")) {
        Write-Warning ".env file not found. Creating from .env.example..."
        Copy-Item ".env.example" ".env"
        Write-Warning "Please edit .env file with your actual values before continuing."
        exit 1
    }
}

function Start-Development {
    Write-Status "Starting TwoLifeCar development environment..."
    Test-EnvFile
    docker-compose -f docker-compose.dev.yml up -d
    Write-Success "Development environment started!"
    Write-Status "Services available at:"
    Write-Host "  - Landing: http://localhost:3000"
    Write-Host "  - Dashboard: http://localhost:3001" 
    Write-Host "  - API: http://localhost:5001"
    Write-Host "  - MongoDB: localhost:27017"
    Write-Host "  - Nginx: http://localhost:8080"
}

function Stop-Development {
    Write-Status "Stopping TwoLifeCar development environment..."
    docker-compose -f docker-compose.dev.yml down
    Write-Success "Development environment stopped!"
}

function Start-Test {
    Write-Status "Starting TwoLifeCar test environment..."
    Test-EnvFile
    docker-compose -f docker-compose.test.yml up -d
    Write-Success "Test environment started!"
    Write-Status "Test services available at:"
    Write-Host "  - Landing: http://localhost:3003"
    Write-Host "  - Dashboard: http://localhost:3002"
    Write-Host "  - API: http://localhost:5002"
    Write-Host "  - MongoDB: localhost:27018"
    Write-Host "  - Redis: localhost:6380"
}

function Stop-Test {
    Write-Status "Stopping TwoLifeCar test environment..."
    docker-compose -f docker-compose.test.yml down
    Write-Success "Test environment stopped!"
}

function Start-Production {
    Write-Status "Starting TwoLifeCar production environment..."
    Test-EnvFile
    docker-compose up -d
    Write-Success "Production environment started!"
    Write-Status "Production services available at:"
    Write-Host "  - Landing: http://localhost:3000"
    Write-Host "  - Dashboard: http://localhost:3001"
    Write-Host "  - API: http://localhost:5001"
    Write-Host "  - Load Balancer: http://localhost:80"
}

function Stop-Production {
    Write-Status "Stopping TwoLifeCar production environment..."
    docker-compose down
    Write-Success "Production environment stopped!"
}

function Show-Logs {
    param($env, $service)
    
    switch ($env) {
        "dev" {
            if ($service) {
                docker-compose -f docker-compose.dev.yml logs -f $service
            } else {
                docker-compose -f docker-compose.dev.yml logs -f
            }
        }
        "test" {
            if ($service) {
                docker-compose -f docker-compose.test.yml logs -f $service
            } else {
                docker-compose -f docker-compose.test.yml logs -f
            }
        }
        "prod" {
            if ($service) {
                docker-compose logs -f $service
            } else {
                docker-compose logs -f
            }
        }
        default {
            Write-Error "Unknown environment: $env"
            Write-Host "Usage: .\docker.ps1 logs -Environment {dev|test|prod} [-Service service]"
        }
    }
}

function Show-Status {
    Write-Status "TwoLifeCar Services Status:"
    Write-Host ""
    Write-Host "Development:" -ForegroundColor Cyan
    docker-compose -f docker-compose.dev.yml ps
    Write-Host ""
    Write-Host "Test:" -ForegroundColor Cyan
    docker-compose -f docker-compose.test.yml ps
    Write-Host ""
    Write-Host "Production:" -ForegroundColor Cyan
    docker-compose ps
}

function Remove-All {
    Write-Warning "This will remove all containers, networks, and volumes!"
    $response = Read-Host "Are you sure? (y/N)"
    if ($response -eq "y" -or $response -eq "Y") {
        Write-Status "Cleaning up all TwoLifeCar resources..."
        docker-compose -f docker-compose.dev.yml down -v --remove-orphans
        docker-compose -f docker-compose.test.yml down -v --remove-orphans
        docker-compose down -v --remove-orphans
        docker system prune -f
        Write-Success "Cleanup completed!"
    }
}

# Main script logic
switch ($Command.ToLower()) {
    "dev:up" { Start-Development }
    "dev:down" { Stop-Development }
    "dev:logs" { Show-Logs "dev" $Service }
    "test:up" { Start-Test }
    "test:down" { Stop-Test }
    "test:run" { 
        Write-Status "Running tests..."
        docker-compose -f docker-compose.test.yml run --rm test-runner
    }
    "prod:up" { Start-Production }
    "prod:down" { Stop-Production }
    "prod:deploy" {
        Write-Status "Deploying TwoLifeCar to production..."
        Test-EnvFile
        Write-Status "Building images..."
        docker-compose build --no-cache
        Write-Status "Starting services..."
        docker-compose up -d
        Write-Status "Waiting for services to be ready..."
        Start-Sleep -Seconds 30
        try {
            $response = Invoke-WebRequest -Uri "http://localhost/health" -TimeoutSec 10
            if ($response.StatusCode -eq 200) {
                Write-Success "Production deployment successful!"
            } else {
                throw "Health check failed"
            }
        } catch {
            Write-Error "Production deployment failed - health check failed"
            docker-compose logs
        }
    }
    "logs" { Show-Logs $Environment $Service }
    "status" { Show-Status }
    "cleanup" { Remove-All }
    default {
        Write-Host "TwoLifeCar Docker Management" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Usage: .\docker.ps1 -Command {command} [-Service service] [-Environment env]"
        Write-Host ""
        Write-Host "Development Commands:" -ForegroundColor Yellow
        Write-Host "  dev:up       - Start development environment"
        Write-Host "  dev:down     - Stop development environment"
        Write-Host "  dev:logs     - Show development logs"
        Write-Host ""
        Write-Host "Test Commands:" -ForegroundColor Yellow
        Write-Host "  test:up      - Start test environment"
        Write-Host "  test:down    - Stop test environment"
        Write-Host "  test:run     - Run test suite"
        Write-Host ""
        Write-Host "Production Commands:" -ForegroundColor Yellow
        Write-Host "  prod:up      - Start production environment"
        Write-Host "  prod:down    - Stop production environment"
        Write-Host "  prod:deploy  - Full production deployment"
        Write-Host ""
        Write-Host "Utility Commands:" -ForegroundColor Yellow
        Write-Host "  logs         - Show logs (use -Environment and -Service)"
        Write-Host "  status       - Show status of all environments"
        Write-Host "  cleanup      - Remove all containers and volumes"
        Write-Host ""
        Write-Host "Examples:" -ForegroundColor Cyan
        Write-Host "  .\docker.ps1 -Command dev:up"
        Write-Host "  .\docker.ps1 -Command logs -Environment dev -Service api"
        Write-Host "  .\docker.ps1 -Command prod:deploy"
    }
}

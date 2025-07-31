#!/bin/bash

# TwoLifeCar Docker Management Scripts

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env file exists
check_env() {
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating from .env.example..."
        cp .env.example .env
        print_warning "Please edit .env file with your actual values before continuing."
        exit 1
    fi
}

# Development environment
dev_up() {
    print_status "Starting TwoLifeCar development environment..."
    check_env
    docker-compose -f docker-compose.dev.yml up -d
    print_success "Development environment started!"
    print_status "Services available at:"
    echo "  - Landing: http://localhost:3000"
    echo "  - Dashboard: http://localhost:3001"
    echo "  - API: http://localhost:5001"
    echo "  - MongoDB: localhost:27017"
    echo "  - Nginx: http://localhost:80"
}

dev_down() {
    print_status "Stopping TwoLifeCar development environment..."
    docker-compose -f docker-compose.dev.yml down
    print_success "Development environment stopped!"
}

dev_logs() {
    docker-compose -f docker-compose.dev.yml logs -f ${1:-}
}

# Test environment
test_up() {
    print_status "Starting TwoLifeCar test environment..."
    check_env
    docker-compose -f docker-compose.test.yml up -d
    print_success "Test environment started!"
    print_status "Test services available at:"
    echo "  - Landing: http://localhost:3003"
    echo "  - Dashboard: http://localhost:3002"
    echo "  - API: http://localhost:5002"
    echo "  - MongoDB: localhost:27018"
    echo "  - Redis: localhost:6380"
}

test_down() {
    print_status "Stopping TwoLifeCar test environment..."
    docker-compose -f docker-compose.test.yml down
    print_success "Test environment stopped!"
}

test_run() {
    print_status "Running tests..."
    docker-compose -f docker-compose.test.yml run --rm test-runner
}

# Production environment
prod_up() {
    print_status "Starting TwoLifeCar production environment..."
    check_env
    docker-compose up -d
    print_success "Production environment started!"
    print_status "Production services available at:"
    echo "  - Landing: http://localhost:3000"
    echo "  - Dashboard: http://localhost:3001"
    echo "  - API: http://localhost:5001"
    echo "  - Load Balancer: http://localhost:80"
}

prod_down() {
    print_status "Stopping TwoLifeCar production environment..."
    docker-compose down
    print_success "Production environment stopped!"
}

prod_deploy() {
    print_status "Deploying TwoLifeCar to production..."
    check_env
    
    # Build images
    print_status "Building images..."
    docker-compose build --no-cache
    
    # Start services
    print_status "Starting services..."
    docker-compose up -d
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 30
    
    # Health check
    if curl -f http://localhost/health > /dev/null 2>&1; then
        print_success "Production deployment successful!"
    else
        print_error "Production deployment failed - health check failed"
        docker-compose logs
        exit 1
    fi
}

# Utility functions
logs() {
    env=${1:-prod}
    service=${2:-}
    
    case $env in
        "dev")
            docker-compose -f docker-compose.dev.yml logs -f $service
            ;;
        "test")
            docker-compose -f docker-compose.test.yml logs -f $service
            ;;
        "prod")
            docker-compose logs -f $service
            ;;
        *)
            print_error "Unknown environment: $env"
            echo "Usage: $0 logs {dev|test|prod} [service]"
            exit 1
            ;;
    esac
}

status() {
    print_status "TwoLifeCar Services Status:"
    echo ""
    echo "Development:"
    docker-compose -f docker-compose.dev.yml ps
    echo ""
    echo "Test:"
    docker-compose -f docker-compose.test.yml ps
    echo ""
    echo "Production:"
    docker-compose ps
}

cleanup() {
    print_warning "This will remove all containers, networks, and volumes!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Cleaning up all TwoLifeCar resources..."
        docker-compose -f docker-compose.dev.yml down -v --remove-orphans
        docker-compose -f docker-compose.test.yml down -v --remove-orphans
        docker-compose down -v --remove-orphans
        docker system prune -f
        print_success "Cleanup completed!"
    fi
}

# Main script logic
case "$1" in
    "dev:up")
        dev_up
        ;;
    "dev:down")
        dev_down
        ;;
    "dev:logs")
        dev_logs $2
        ;;
    "test:up")
        test_up
        ;;
    "test:down")
        test_down
        ;;
    "test:run")
        test_run
        ;;
    "prod:up")
        prod_up
        ;;
    "prod:down")
        prod_down
        ;;
    "prod:deploy")
        prod_deploy
        ;;
    "logs")
        logs $2 $3
        ;;
    "status")
        status
        ;;
    "cleanup")
        cleanup
        ;;
    *)
        echo "TwoLifeCar Docker Management"
        echo ""
        echo "Usage: $0 {command}"
        echo ""
        echo "Development Commands:"
        echo "  dev:up       - Start development environment"
        echo "  dev:down     - Stop development environment"
        echo "  dev:logs     - Show development logs"
        echo ""
        echo "Test Commands:"
        echo "  test:up      - Start test environment"
        echo "  test:down    - Stop test environment"
        echo "  test:run     - Run test suite"
        echo ""
        echo "Production Commands:"
        echo "  prod:up      - Start production environment"
        echo "  prod:down    - Stop production environment"
        echo "  prod:deploy  - Full production deployment"
        echo ""
        echo "Utility Commands:"
        echo "  logs {env} [service] - Show logs for environment"
        echo "  status       - Show status of all environments"
        echo "  cleanup      - Remove all containers and volumes"
        echo ""
        exit 1
        ;;
esac

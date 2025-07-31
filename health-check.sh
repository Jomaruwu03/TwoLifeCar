#!/bin/bash

# TwoLifeCar Stack Health Check Script
# Verifica que todos los servicios estén funcionando correctamente

echo "🏥 TwoLifeCar Stack Health Check"
echo "================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para verificar servicio HTTP
check_http_service() {
    local url=$1
    local service_name=$2
    
    echo -n "Checking $service_name ($url)... "
    
    if curl -f -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200"; then
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    else
        echo -e "${RED}❌ FAILED${NC}"
        return 1
    fi
}

# Función para verificar puerto TCP
check_tcp_port() {
    local host=$1
    local port=$2
    local service_name=$3
    
    echo -n "Checking $service_name ($host:$port)... "
    
    if nc -z "$host" "$port" 2>/dev/null; then
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    else
        echo -e "${RED}❌ FAILED${NC}"
        return 1
    fi
}

# Función para verificar contenedor Docker
check_docker_container() {
    local container_name=$1
    local service_name=$2
    
    echo -n "Checking Docker container $service_name... "
    
    if docker ps --format "table {{.Names}}" | grep -q "$container_name"; then
        echo -e "${GREEN}✅ RUNNING${NC}"
        return 0
    else
        echo -e "${RED}❌ NOT RUNNING${NC}"
        return 1
    fi
}

echo "🐳 Docker Containers Status:"
echo "----------------------------"

# Verificar contenedores Docker
check_docker_container "twolifecar-landing-dev" "Landing Page"
check_docker_container "twolifecar-dashboard-dev" "Dashboard"
check_docker_container "twolifecar-api-dev" "API"
check_docker_container "twolifecar-mongodb-dev" "MongoDB"
check_docker_container "twolifecar-nginx-dev" "Nginx"

echo ""
echo "🌐 HTTP Services Status:"
echo "------------------------"

# Verificar servicios HTTP
check_http_service "http://localhost:3000" "Landing Page"
check_http_service "http://localhost:3001" "Dashboard"
check_http_service "http://localhost:5001" "API"
check_http_service "http://localhost:8080" "Nginx Proxy"

echo ""
echo "🔌 TCP Ports Status:"
echo "-------------------"

# Verificar puertos TCP
check_tcp_port "localhost" "3000" "Landing Port"
check_tcp_port "localhost" "3001" "Dashboard Port"
check_tcp_port "localhost" "5001" "API Port"
check_tcp_port "localhost" "8080" "Nginx Port"
check_tcp_port "localhost" "27017" "MongoDB Port"

echo ""
echo "🔍 API Endpoints Test:"
echo "---------------------"

# Verificar endpoints específicos de la API
echo -n "Testing API health endpoint... "
if curl -f -s "http://localhost:5001/" | grep -q "TwoLifeCar"; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ FAILED${NC}"
fi

echo -n "Testing API leads endpoint... "
if curl -f -s "http://localhost:5001/api/leads" >/dev/null 2>&1; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${YELLOW}⚠️  NEEDS VERIFICATION${NC}"
fi

echo ""
echo "📊 Resource Usage:"
echo "------------------"

# Mostrar uso de recursos de Docker
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}" | head -6

echo ""
echo "🏁 Health Check Complete!"
echo "========================="

# Contar servicios funcionando
containers_running=$(docker ps -q | wc -l)
echo "Docker containers running: $containers_running/5"

# Verificar si todos los servicios están OK
if check_http_service "http://localhost:3000" "Landing" >/dev/null 2>&1 && \
   check_http_service "http://localhost:3001" "Dashboard" >/dev/null 2>&1 && \
   check_http_service "http://localhost:5001" "API" >/dev/null 2>&1 && \
   check_http_service "http://localhost:8080" "Nginx" >/dev/null 2>&1 && \
   check_tcp_port "localhost" "27017" "MongoDB" >/dev/null 2>&1; then
    echo -e "${GREEN}🎉 ALL SERVICES ARE HEALTHY!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  SOME SERVICES NEED ATTENTION${NC}"
    exit 1
fi

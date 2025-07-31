#!/bin/bash
# =====================================================
# TwoLifeCar - Despliegue SOLO Landing Page para SSH/Linux
# Script para subir únicamente la landing a www.3910.efdiaz.xyz
# =====================================================

set -e

# Configuración por defecto
DOMAIN="3910.efdiaz.xyz"
SETUP_SSL=false
SKIP_BUILD=false

# Procesar argumentos
while [[ $# -gt 0 ]]; do
    case $1 in
        --ssl)
            SETUP_SSL=true
            shift
            ;;
        --domain)
            DOMAIN="$2"
            shift 2
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        -h|--help)
            echo "Uso: $0 [opciones]"
            echo "Opciones:"
            echo "  --ssl           Configurar SSL con Let's Encrypt"
            echo "  --domain        Dominio a usar (default: 3910.efdiaz.xyz)"
            echo "  --skip-build    Saltar construcción de imágenes"
            echo "  -h, --help      Mostrar esta ayuda"
            exit 0
            ;;
        *)
            echo "Opción desconocida: $1"
            exit 1
            ;;
    esac
done

echo "🌐 TwoLifeCar - Despliegue Landing Page ÚNICAMENTE"
echo "================================================="
echo "Dominio: https://www.$DOMAIN"
echo "SSL: $(if [ "$SETUP_SSL" = true ]; then echo "SÍ"; else echo "NO"; fi)"

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado"
    exit 1
fi

if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker no está corriendo"
    exit 1
fi

echo "✅ Docker está disponible"

# Verificar docker-compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado"
    exit 1
fi

echo "✅ Docker Compose está disponible"

# Parar todos los servicios existentes
echo "⏹️ Deteniendo servicios existentes..."
docker-compose down --remove-orphans 2>/dev/null || true
docker-compose -f docker-compose.dev.yml down --remove-orphans 2>/dev/null || true
docker-compose -f docker-compose.test.yml down --remove-orphans 2>/dev/null || true

# Limpiar contenedores
echo "🧹 Limpiando contenedores..."
docker container prune -f

# Construir solo la landing
if [ "$SKIP_BUILD" = false ]; then
    echo "🔨 Construyendo SOLO la Landing Page..."
    docker-compose -f docker-compose.landing.yml build --no-cache landing
fi

# Configurar SSL si se solicita
if [ "$SETUP_SSL" = true ]; then
    echo "🔐 Configurando SSL para $DOMAIN..."
    
    # Crear directorio SSL
    SSL_DIR="./docker/ssl"
    mkdir -p "$SSL_DIR"
    
    # Verificar DNS
    if nslookup "$DOMAIN" >/dev/null 2>&1; then
        echo "✅ DNS resuelve para $DOMAIN"
    else
        echo "⚠️  DNS no resuelve para $DOMAIN - continuando..."
    fi
    
    echo "📜 Obteniendo certificados SSL..."
    echo "⚠️  El dominio DEBE apuntar a este servidor"
    
    # Obtener certificados SSL
    if docker run --rm -it \
        -v "${PWD}/${SSL_DIR}:/etc/letsencrypt" \
        -p "80:80" \
        certbot/certbot certonly \
        --standalone \
        --email "admin@$DOMAIN" \
        --agree-tos \
        --no-eff-email \
        -d "$DOMAIN" \
        -d "www.$DOMAIN"; then
        
        # Copiar certificados
        LIVE_PATH="$SSL_DIR/live/$DOMAIN"
        if [ -d "$LIVE_PATH" ]; then
            cp "$LIVE_PATH/fullchain.pem" "$SSL_DIR/"
            cp "$LIVE_PATH/privkey.pem" "$SSL_DIR/"
            chmod 644 "$SSL_DIR/fullchain.pem"
            chmod 600 "$SSL_DIR/privkey.pem"
            echo "✅ Certificados SSL configurados"
        else
            echo "❌ Certificados no encontrados"
            SETUP_SSL=false
        fi
    else
        echo "❌ Error configurando SSL. Continuando sin SSL..."
        SETUP_SSL=false
    fi
fi

# Iniciar solo la landing
echo "🚀 Iniciando Landing Page..."
docker-compose -f docker-compose.landing.yml up -d

# Esperar a que inicie
echo "⏳ Esperando a que la Landing Page se inicie..."
sleep 15

# Verificar estado
echo "🔍 Verificando servicios..."
SERVICES=("landing" "nginx")
ALL_HEALTHY=true

for service in "${SERVICES[@]}"; do
    if STATE=$(docker-compose -f docker-compose.landing.yml ps "$service" --format "table {{.State}}" | tail -n 1); then
        if [ "$STATE" = "Up" ]; then
            echo "  ✅ $service - Funcionando"
        else
            echo "  ❌ $service - $STATE"
            ALL_HEALTHY=false
        fi
    else
        echo "  ❌ $service - Error verificando"
        ALL_HEALTHY=false
    fi
done

# Test de conectividad
echo ""
echo "🌐 Probando conectividad..."

if [ "$SETUP_SSL" = true ]; then
    TEST_URL="https://www.$DOMAIN"
else
    TEST_URL="http://www.$DOMAIN"
fi

if curl -f -s -o /dev/null "$TEST_URL" --max-time 15; then
    echo "✅ Landing Page accesible correctamente"
else
    echo "⚠️  Landing Page no accesible aún - puede tardar unos minutos"
    ALL_HEALTHY=false
fi

# Test de health check
HEALTH_URL="${TEST_URL}/health"
if curl -f -s -o /dev/null "$HEALTH_URL" --max-time 5; then
    echo "✅ Health check OK"
else
    echo "⚠️  Health check no disponible"
fi

# Resumen final
echo ""
echo "================================================="
if [ "$ALL_HEALTHY" = true ]; then
    echo "🎉 ¡Landing Page desplegada exitosamente!"
else
    echo "⚠️  Landing Page desplegada con advertencias"
fi

echo ""
echo "🌐 Tu Landing Page está disponible en:"
echo "   - $TEST_URL"

if [ "$SETUP_SSL" = true ]; then
    echo "🔐 SSL configurado - Acceso seguro habilitado"
fi

echo ""
echo "📊 Comandos útiles:"
echo "   docker-compose -f docker-compose.landing.yml ps"
echo "   docker-compose -f docker-compose.landing.yml logs -f"
echo "   docker-compose -f docker-compose.landing.yml restart"
echo "   docker-compose -f docker-compose.landing.yml down"

# Mostrar logs si hay problemas
if [ "$ALL_HEALTHY" = false ]; then
    echo ""
    echo "📋 Logs recientes:"
    docker-compose -f docker-compose.landing.yml logs --tail=10
fi

echo ""
echo "✅ Script completado. Landing Page en funcionamiento."

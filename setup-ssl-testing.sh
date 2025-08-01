#!/bin/bash

# Script para generar certificados auto-firmados (solo para testing)
echo "🔐 Generando certificados SSL auto-firmados para testing..."

# Crear directorio para certificados
mkdir -p docker/ssl

# Generar certificados auto-firmados
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout docker/ssl/key.pem \
    -out docker/ssl/cert.pem \
    -subj "/C=ES/ST=Madrid/L=Madrid/O=TwoLifeCar/OU=Development/CN=3210.efdiaz.xyz/emailAddress=admin@efdiaz.xyz" \
    -config <(
    echo '[req]'
    echo 'distinguished_name = req'
    echo '[san]'
    echo 'subjectAltName = @alt_names'
    echo '[alt_names]'
    echo 'DNS.1 = 3210.efdiaz.xyz'
    echo 'DNS.2 = www.3210.efdiaz.xyz'
    echo 'IP.1 = 167.172.150.250'
    ) \
    -extensions san

# Configurar permisos
chmod 644 docker/ssl/cert.pem
chmod 600 docker/ssl/key.pem

echo "✅ Certificados auto-firmados generados!"
echo "⚠️  NOTA: Estos certificados son solo para testing"
echo "💡 Para producción, usa: ./setup-ssl.sh"
echo ""
echo "Ahora puedes ejecutar:"
echo "  docker-compose -f docker-compose.landing-ssl.yml up -d --build"

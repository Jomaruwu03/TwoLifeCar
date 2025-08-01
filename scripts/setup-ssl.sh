#!/bin/bash

# Script para configurar SSL con Let's Encrypt para TwoLifeCar
# Uso: ./setup-ssl.sh

set -e

DOMAIN="3210.efdiaz.xyz"
EMAIL="admin@${DOMAIN}"
SSL_DIR="./docker/ssl"

echo "🔐 Configurando SSL para TwoLifeCar en ${DOMAIN}"

# Crear directorio SSL si no existe
mkdir -p "${SSL_DIR}"

# Verificar si Docker está corriendo
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker no está corriendo. Inicia Docker Desktop primero."
    exit 1
fi

# Parar servicios existentes
echo "⏹️ Deteniendo servicios existentes..."
docker-compose down

# Obtener certificados SSL con Certbot
echo "📜 Obteniendo certificados SSL de Let's Encrypt..."

# Usar certbot en contenedor para obtener certificados
docker run --rm -it \
    -v "${PWD}/${SSL_DIR}:/etc/letsencrypt" \
    -v "${PWD}/${SSL_DIR}/www:/var/www/certbot" \
    -p 80:80 \
    certbot/certbot certonly \
    --standalone \
    --email "${EMAIL}" \
    --agree-tos \
    --no-eff-email \
    -d "${DOMAIN}" \
    -d "www.${DOMAIN}"

# Copiar certificados a ubicación esperada por nginx
if [ -d "${SSL_DIR}/live/${DOMAIN}" ]; then
    echo "📋 Copiando certificados..."
    cp "${SSL_DIR}/live/${DOMAIN}/fullchain.pem" "${SSL_DIR}/"
    cp "${SSL_DIR}/live/${DOMAIN}/privkey.pem" "${SSL_DIR}/"
    
    # Establecer permisos correctos
    chmod 644 "${SSL_DIR}/fullchain.pem"
    chmod 600 "${SSL_DIR}/privkey.pem"
    
    echo "✅ Certificados SSL configurados correctamente"
else
    echo "❌ Error: No se pudieron obtener los certificados SSL"
    exit 1
fi

# Crear script de renovación automática
cat > "${SSL_DIR}/renew-ssl.sh" << 'EOF'
#!/bin/bash
# Script de renovación automática de SSL

DOMAIN="3210.efdiaz.xyz"
SSL_DIR="./docker/ssl"

echo "🔄 Renovando certificados SSL..."

# Parar nginx temporalmente
docker-compose stop nginx

# Renovar certificados
docker run --rm \
    -v "${PWD}/${SSL_DIR}:/etc/letsencrypt" \
    -v "${PWD}/${SSL_DIR}/www:/var/www/certbot" \
    -p 80:80 \
    certbot/certbot renew

# Copiar certificados renovados
if [ -d "${SSL_DIR}/live/${DOMAIN}" ]; then
    cp "${SSL_DIR}/live/${DOMAIN}/fullchain.pem" "${SSL_DIR}/"
    cp "${SSL_DIR}/live/${DOMAIN}/privkey.pem" "${SSL_DIR}/"
    chmod 644 "${SSL_DIR}/fullchain.pem"
    chmod 600 "${SSL_DIR}/privkey.pem"
fi

# Reiniciar nginx
docker-compose start nginx

echo "✅ Certificados renovados correctamente"
EOF

chmod +x "${SSL_DIR}/renew-ssl.sh"

echo "🚀 Iniciando servicios con SSL..."
docker-compose up -d

echo ""
echo "✅ Configuración SSL completada!"
echo "🌐 Tu aplicación está disponible en:"
echo "   - https://www.${DOMAIN}"
echo "   - https://${DOMAIN}"
echo ""
echo "📝 Para renovar certificados, ejecuta:"
echo "   cd ${SSL_DIR} && ./renew-ssl.sh"
echo ""
echo "⏰ Agrega a crontab para renovación automática:"
echo "   0 12 * * * cd $(pwd) && ${SSL_DIR}/renew-ssl.sh"

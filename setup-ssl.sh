#!/bin/bash

# Script para configurar SSL con Let's Encrypt
echo "🔐 Configurando SSL para 3210.efdiaz.xyz..."

# Crear directorio para certificados
mkdir -p docker/ssl

# Función para instalar certbot si no existe
install_certbot() {
    echo "📦 Instalando Certbot..."
    if command -v apt-get &> /dev/null; then
        sudo apt-get update
        sudo apt-get install -y certbot
    elif command -v yum &> /dev/null; then
        sudo yum install -y certbot
    else
        echo "❌ No se pudo instalar Certbot automáticamente"
        echo "Instala Certbot manualmente: https://certbot.eff.org/"
        exit 1
    fi
}

# Verificar si certbot está instalado
if ! command -v certbot &> /dev/null; then
    install_certbot
fi

echo "🌐 Generando certificados SSL para 3210.efdiaz.xyz y www.3210.efdiaz.xyz..."

# Generar certificados con Let's Encrypt
sudo certbot certonly --standalone \
    --agree-tos \
    --no-eff-email \
    --email admin@efdiaz.xyz \
    -d 3210.efdiaz.xyz \
    -d www.3210.efdiaz.xyz

# Copiar certificados al directorio del proyecto
if [ -f "/etc/letsencrypt/live/3210.efdiaz.xyz/fullchain.pem" ]; then
    echo "📋 Copiando certificados..."
    sudo cp /etc/letsencrypt/live/3210.efdiaz.xyz/fullchain.pem docker/ssl/cert.pem
    sudo cp /etc/letsencrypt/live/3210.efdiaz.xyz/privkey.pem docker/ssl/key.pem
    
    # Cambiar permisos
    sudo chown $USER:$USER docker/ssl/cert.pem docker/ssl/key.pem
    chmod 644 docker/ssl/cert.pem
    chmod 600 docker/ssl/key.pem
    
    echo "✅ Certificados SSL configurados correctamente!"
    echo "📁 Certificados guardados en: docker/ssl/"
    
    # Crear renovación automática
    echo "⏰ Configurando renovación automática..."
    (crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet && cp /etc/letsencrypt/live/3210.efdiaz.xyz/fullchain.pem $(pwd)/docker/ssl/cert.pem && cp /etc/letsencrypt/live/3210.efdiaz.xyz/privkey.pem $(pwd)/docker/ssl/key.pem && docker-compose -f docker-compose.landing-ssl.yml restart nginx-landing-ssl") | crontab -
    
else
    echo "❌ Error: No se pudieron generar los certificados SSL"
    echo "Verifica que:"
    echo "1. El dominio 3210.efdiaz.xyz apunte a esta IP (167.172.150.250)"
    echo "2. Los puertos 80 y 443 estén abiertos"
    echo "3. No haya otros servicios usando estos puertos"
    exit 1
fi

echo ""
echo "🎉 ¡Configuración SSL completada!"
echo "Ahora puedes ejecutar:"
echo "  docker-compose -f docker-compose.landing-ssl.yml up -d --build"
echo ""
echo "Tu sitio estará disponible en:"
echo "  🌐 https://3210.efdiaz.xyz"
echo "  🌐 https://www.3210.efdiaz.xyz"

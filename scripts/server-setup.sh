#!/bin/bash
# =====================================================
# TwoLifeCar - Setup completo del servidor SSH
# Instala Docker, clona el repo y despliega la landing
# =====================================================

set -e

# Configuración
DOMAIN="3910.efdiaz.xyz"
REPO_URL="https://github.com/Jomaruwu03/TwoLifeCar.git"
BRANCH="JomarRama"
INSTALL_DIR="/opt/twolifecar"
SETUP_SSL=false

echo "🚀 TwoLifeCar - Setup Completo del Servidor"
echo "==========================================="
echo "Dominio: $DOMAIN"
echo "Directorio: $INSTALL_DIR"

# Verificar si somos root o tenemos sudo
if [ "$EUID" -ne 0 ] && ! sudo -n true 2>/dev/null; then
    echo "❌ Este script necesita permisos de administrador"
    echo "Ejecuta con: sudo $0 o como root"
    exit 1
fi

# Detectar sistema operativo
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
    VERSION=$VERSION_ID
else
    echo "❌ No se pudo detectar el sistema operativo"
    exit 1
fi

echo "✅ Sistema detectado: $OS $VERSION"

# Función para instalar Docker en Ubuntu/Debian
install_docker_ubuntu() {
    echo "📦 Instalando Docker en Ubuntu/Debian..."
    
    # Actualizar paquetes
    apt-get update
    
    # Instalar dependencias
    apt-get install -y ca-certificates curl gnupg lsb-release git
    
    # Agregar clave GPG de Docker
    mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    
    # Agregar repositorio
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Instalar Docker
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    # Instalar docker-compose standalone
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
}

# Función para instalar Docker en CentOS/RHEL
install_docker_centos() {
    echo "📦 Instalando Docker en CentOS/RHEL..."
    
    # Instalar dependencias
    yum install -y yum-utils git curl
    
    # Agregar repositorio
    yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
    
    # Instalar Docker
    yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    # Instalar docker-compose standalone
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
}

# Instalar Docker según el SO
if ! command -v docker &> /dev/null; then
    case $OS in
        ubuntu|debian)
            install_docker_ubuntu
            ;;
        centos|rhel|rocky|almalinux)
            install_docker_centos
            ;;
        *)
            echo "❌ Sistema operativo $OS no soportado automáticamente"
            echo "Instala Docker manualmente y vuelve a ejecutar este script"
            exit 1
            ;;
    esac
else
    echo "✅ Docker ya está instalado"
fi

# Iniciar y habilitar Docker
systemctl start docker
systemctl enable docker

# Verificar instalación
if docker --version && docker-compose --version; then
    echo "✅ Docker instalado correctamente"
else
    echo "❌ Error en la instalación de Docker"
    exit 1
fi

# Crear directorio de instalación
echo "📁 Creando directorio de instalación..."
mkdir -p "$INSTALL_DIR"
cd "$INSTALL_DIR"

# Clonar o actualizar repositorio
if [ -d ".git" ]; then
    echo "📥 Actualizando repositorio existente..."
    git fetch origin
    git checkout "$BRANCH"
    git pull origin "$BRANCH"
else
    echo "📥 Clonando repositorio..."
    git clone "$REPO_URL" .
    git checkout "$BRANCH"
fi

# Hacer ejecutables los scripts
chmod +x scripts/*.sh

# Configurar firewall (si está disponible)
if command -v ufw &> /dev/null; then
    echo "🔥 Configurando firewall UFW..."
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw --force enable
elif command -v firewall-cmd &> /dev/null; then
    echo "🔥 Configurando firewall firewalld..."
    firewall-cmd --permanent --add-service=http
    firewall-cmd --permanent --add-service=https
    firewall-cmd --permanent --add-service=ssh
    firewall-cmd --reload
fi

# Preguntar si configurar SSL
echo ""
read -p "¿Configurar SSL automáticamente? (El dominio DEBE apuntar a este servidor) [y/N]: " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    SETUP_SSL=true
fi

# Desplegar la landing
echo "🚀 Desplegando Landing Page..."
if [ "$SETUP_SSL" = true ]; then
    ./scripts/deploy-landing-ssh.sh --ssl --domain "$DOMAIN"
else
    ./scripts/deploy-landing-ssh.sh --domain "$DOMAIN"
fi

# Crear servicio systemd para auto-inicio
echo "🔧 Creando servicio systemd..."
cat > /etc/systemd/system/twolifecar-landing.service << EOF
[Unit]
Description=TwoLifeCar Landing Page
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$INSTALL_DIR
ExecStart=/usr/local/bin/docker-compose -f docker-compose.landing.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.landing.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

# Habilitar servicio
systemctl daemon-reload
systemctl enable twolifecar-landing.service

# Crear script de renovación SSL
if [ "$SETUP_SSL" = true ]; then
    echo "📝 Configurando renovación automática de SSL..."
    cat > /etc/cron.d/twolifecar-ssl << EOF
# Renovar certificados SSL cada 30 días a las 3:00 AM
0 3 */30 * * root cd $INSTALL_DIR && ./docker/ssl/renew-ssl.sh
EOF
fi

# Resumen final
echo ""
echo "================================================="
echo "🎉 ¡Setup completo del servidor finalizado!"
echo ""
echo "📊 Información del despliegue:"
echo "   - Directorio: $INSTALL_DIR"
echo "   - Dominio: https://www.$DOMAIN"
echo "   - SSL: $(if [ "$SETUP_SSL" = true ]; then echo "Configurado"; else echo "No configurado"; fi)"
echo "   - Auto-inicio: Habilitado"
echo ""
echo "📋 Comandos útiles:"
echo "   systemctl status twolifecar-landing    # Estado del servicio"
echo "   systemctl restart twolifecar-landing   # Reiniciar servicio"
echo "   cd $INSTALL_DIR && docker-compose -f docker-compose.landing.yml logs -f"
echo ""
echo "🌐 Tu Landing Page está disponible en:"
if [ "$SETUP_SSL" = true ]; then
    echo "   https://www.$DOMAIN"
else
    echo "   http://www.$DOMAIN"
fi
echo ""
echo "✅ Servidor configurado y listo para producción!"

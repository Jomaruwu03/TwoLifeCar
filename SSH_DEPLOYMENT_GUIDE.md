# 🔐 Guía de Despliegue SSH - TwoLifeCar Landing

## Para subir la Landing Page a un servidor Linux via SSH

### 🚀 Opción 1: Setup Automático Completo (Recomendado)

```bash
# 1. Conectar al servidor SSH
ssh root@tu-servidor-ip

# 2. Descargar y ejecutar setup automático
curl -fsSL https://raw.githubusercontent.com/Jomaruwu03/TwoLifeCar/JomarRama/scripts/server-setup.sh | bash

# ¡Listo! Todo se instala y configura automáticamente
```

### 🔧 Opción 2: Setup Manual Paso a Paso

#### 1. Conectar al servidor
```bash
ssh root@tu-servidor-ip
# o
ssh usuario@tu-servidor-ip
sudo su -
```

#### 2. Instalar dependencias (Ubuntu/Debian)
```bash
# Actualizar sistema
apt update && apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar docker-compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Instalar git
apt install -y git
```

#### 3. Clonar el repositorio
```bash
# Crear directorio
mkdir -p /opt/twolifecar
cd /opt/twolifecar

# Clonar repositorio
git clone https://github.com/Jomaruwu03/TwoLifeCar.git .
git checkout JomarRama

# Hacer ejecutables los scripts
chmod +x scripts/*.sh
```

#### 4. Configurar firewall
```bash
# UFW (Ubuntu)
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable

# O Firewalld (CentOS/RHEL)
firewall-cmd --permanent --add-service=ssh
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload
```

#### 5. Desplegar Landing Page
```bash
# Con SSL (el dominio DEBE apuntar al servidor)
./scripts/deploy-landing-ssh.sh --ssl --domain 3910.efdiaz.xyz

# O sin SSL (para pruebas)
./scripts/deploy-landing-ssh.sh --domain 3910.efdiaz.xyz
```

### 📋 Comandos de Administración SSH

#### Verificar estado
```bash
# Estado de contenedores
docker-compose -f docker-compose.landing.yml ps

# Logs en tiempo real
docker-compose -f docker-compose.landing.yml logs -f

# Logs de nginx específicamente
docker-compose -f docker-compose.landing.yml logs nginx

# Test de conectividad
curl -I https://www.3910.efdiaz.xyz
```

#### Gestionar servicios
```bash
# Reiniciar servicios
docker-compose -f docker-compose.landing.yml restart

# Parar servicios
docker-compose -f docker-compose.landing.yml down

# Iniciar servicios
docker-compose -f docker-compose.landing.yml up -d

# Reconstruir y reiniciar
docker-compose -f docker-compose.landing.yml build --no-cache
docker-compose -f docker-compose.landing.yml up -d
```

#### Actualizar aplicación
```bash
# Actualizar código
git pull origin JomarRama

# Reconstruir y desplegar
./scripts/deploy-landing-ssh.sh --skip-build --domain 3910.efdiaz.xyz
```

### 🔄 Automatización con Systemd

#### Crear servicio para auto-inicio
```bash
cat > /etc/systemd/system/twolifecar-landing.service << 'EOF'
[Unit]
Description=TwoLifeCar Landing Page
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/twolifecar
ExecStart=/usr/local/bin/docker-compose -f docker-compose.landing.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.landing.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

# Habilitar servicio
systemctl daemon-reload
systemctl enable twolifecar-landing.service
systemctl start twolifecar-landing.service
```

#### Comandos del servicio
```bash
# Estado del servicio
systemctl status twolifecar-landing

# Reiniciar servicio
systemctl restart twolifecar-landing

# Ver logs del servicio
journalctl -u twolifecar-landing -f
```

### 🔐 Renovación Automática de SSL

```bash
# Crear tarea cron para renovación automática
echo "0 3 */30 * * root cd /opt/twolifecar && ./docker/ssl/renew-ssl.sh" > /etc/cron.d/twolifecar-ssl

# Verificar renovación manual
cd /opt/twolifecar && ./docker/ssl/renew-ssl.sh
```

### 🛠️ Troubleshooting SSH

#### Verificar DNS
```bash
# Verificar que el dominio apunta al servidor
nslookup 3910.efdiaz.xyz
dig 3910.efdiaz.xyz

# Debe devolver la IP de tu servidor
```

#### Verificar puertos
```bash
# Verificar que los puertos están abiertos
netstat -tlnp | grep :80
netstat -tlnp | grep :443

# Test desde el servidor
curl -I http://localhost
curl -I https://localhost
```

#### Verificar Docker
```bash
# Estado de Docker
systemctl status docker

# Información de Docker
docker info

# Espacio en disco
df -h
docker system df
```

#### Logs detallados
```bash
# Logs completos de nginx
docker-compose -f docker-compose.landing.yml logs nginx --tail=100

# Logs de landing
docker-compose -f docker-compose.landing.yml logs landing --tail=100

# Logs del sistema
journalctl -xe
```

### 📊 Monitoreo

#### Script de monitoreo automático
```bash
# Crear script de health check
cat > /opt/twolifecar/health-monitor.sh << 'EOF'
#!/bin/bash
URL="https://www.3910.efdiaz.xyz"
if ! curl -f -s $URL > /dev/null; then
    echo "$(date): Landing Page no accesible - Reiniciando servicios"
    cd /opt/twolifecar
    docker-compose -f docker-compose.landing.yml restart
fi
EOF

chmod +x /opt/twolifecar/health-monitor.sh

# Agregar a cron cada 5 minutos
echo "*/5 * * * * root /opt/twolifecar/health-monitor.sh" >> /etc/crontab
```

### 🎯 Ejemplo de Sesión SSH Completa

```bash
# 1. Conectar al servidor
ssh root@mi-servidor.com

# 2. Setup automático
curl -fsSL https://raw.githubusercontent.com/Jomaruwu03/TwoLifeCar/JomarRama/scripts/server-setup.sh | bash

# 3. Verificar que funciona
curl -I https://www.3910.efdiaz.xyz

# 4. Ver logs si es necesario
cd /opt/twolifecar
docker-compose -f docker-compose.landing.yml logs -f

# ¡Listo! Landing funcionando en https://www.3910.efdiaz.xyz
```

---

**✅ Con estos scripts tu Landing Page estará funcionando automáticamente en tu servidor SSH**

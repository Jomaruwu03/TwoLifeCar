# 🚀 TwoLifeCar - Despliegue a Producción

## Configuración para https://www.3210.efdiaz.xyz

### 📋 Prerequisitos

1. **Servidor con Docker** instalado y funcionando
2. **Dominio configurado**: `3210.efdiaz.xyz` debe apuntar a tu servidor IP
3. **Puertos abiertos**: 80 (HTTP) y 443 (HTTPS)
4. **Firewall configurado** para permitir tráfico web

### 🎯 Despliegue Rápido (Recomendado)

```powershell
# 1. Clonar el repositorio
git clone https://github.com/Jomaruwu03/TwoLifeCar.git
cd TwoLifeCar

# 2. Cambiar a la rama JomarRama
git checkout JomarRama

# 3. Despliegue completo con SSL automático
.\scripts\deploy-production.ps1 -SetupSSL
```

### 🔧 Despliegue Manual Paso a Paso

#### 1. Preparar el Entorno
```powershell
# Copiar y configurar variables de entorno
Copy-Item .env.production .env
# Editar .env con tus valores reales
```

#### 2. Configurar SSL
```powershell
# Método automático
.\scripts\setup-ssl.ps1

# Método manual
docker run --rm -it -v "$PWD\docker\ssl:/etc/letsencrypt" -p 80:80 certbot/certbot certonly --standalone --email admin@3210.efdiaz.xyz --agree-tos -d 3210.efdiaz.xyz -d www.3210.efdiaz.xyz
```

#### 3. Levantar Servicios
```powershell
# Construir y levantar todos los servicios
docker-compose build
docker-compose up -d
```

### 🌐 URLs de Acceso

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Landing** | https://www.3210.efdiaz.xyz | Página principal |
| **Dashboard** | https://www.3210.efdiaz.xyz/dashboard | Panel de administración |
| **API** | https://www.3210.efdiaz.xyz/api/ | API REST |
| **Health** | https://www.3210.efdiaz.xyz/health | Estado de servicios |

### 🏗️ Arquitectura de Producción

```
Internet
    ↓
┌─────────────────┐
│   Nginx:443     │ ← SSL Termination
│  (Reverse Proxy)│ ← Rate Limiting
└─────────────────┘ ← Security Headers
    ↓
┌─────────────────┐
│ Docker Network  │
│  172.20.0.0/16  │
└─────────────────┘
    ↓
┌─────┬──────┬────────┐
│ API │Dashboard│Landing│
│:5001│  :80  │  :80  │
└─────┴──────┴────────┘
```

### 🔐 Configuración SSL

- **Certificados**: Let's Encrypt (renovación automática)
- **Protocolos**: TLS 1.2, TLS 1.3
- **HSTS**: Habilitado con preload
- **Redirect**: HTTP → HTTPS automático

### 📊 Monitoreo y Logs

```powershell
# Estado de servicios
docker-compose ps

# Logs en tiempo real
docker-compose logs -f

# Health check automático
.\health-check.ps1

# Verificar SSL
curl -I https://www.3210.efdiaz.xyz
```

### 🔄 Mantenimiento

#### Renovación de SSL (Automática)
```powershell
# Manual
.\docker\ssl\renew-ssl.ps1

# Programar en Windows Task Scheduler
# Ejecutar cada 30 días: .\docker\ssl\renew-ssl.ps1
```

#### Actualización de Servicios
```powershell
# Pull de cambios
git pull origin JomarRama

# Reconstruir y reiniciar
docker-compose build --no-cache
docker-compose up -d
```

#### Backup
```powershell
# Backup de certificados SSL
Copy-Item -Recurse docker\ssl ssl-backup-$(Get-Date -Format "yyyy-MM-dd")

# Backup de base de datos (si usas MongoDB local)
docker-compose exec mongo mongodump --db twolifecar_prod --out /backup
```

### 🛡️ Seguridad Configurada

- ✅ **SSL/TLS**: Certificados válidos de Let's Encrypt
- ✅ **Headers de Seguridad**: HSTS, X-Frame-Options, CSP
- ✅ **Rate Limiting**: 10 req/s en API, 20 req/s global
- ✅ **CORS**: Configurado para el dominio
- ✅ **Firewall**: Solo puertos 80/443 expuestos

### 🚨 Troubleshooting

#### Problema: DNS no resuelve
```powershell
# Verificar DNS
nslookup 3210.efdiaz.xyz
# Debe devolver la IP de tu servidor
```

#### Problema: Certificados SSL fallan
```powershell
# Verificar puertos
netstat -an | findstr ":80"
# Puerto 80 debe estar libre

# Verificar conectividad
Test-NetConnection 3210.efdiaz.xyz -Port 80
```

#### Problema: Servicios no inician
```powershell
# Ver logs detallados
docker-compose logs api
docker-compose logs nginx

# Verificar configuración
docker run --rm -v "$PWD\docker\nginx\prod.conf:/etc/nginx/nginx.conf:ro" nginx:alpine nginx -t
```

### 📞 Soporte

Si encuentras problemas:

1. **Revisa los logs**: `docker-compose logs`
2. **Verifica la configuración**: Usa los scripts de health-check
3. **Consulta la documentación**: `STACK_DOCUMENTATION.md`
4. **Estado de servicios**: `docker-compose ps`

### 🎯 Próximos Pasos

1. **Monitoreo**: Configurar alertas de uptime
2. **CDN**: Considerar CloudFlare para mejor rendimiento
3. **Backup automático**: Implementar respaldos programados
4. **CI/CD**: Automatizar despliegues desde Git

---

**🎉 ¡Tu aplicación TwoLifeCar está lista para producción en https://www.3210.efdiaz.xyz!**

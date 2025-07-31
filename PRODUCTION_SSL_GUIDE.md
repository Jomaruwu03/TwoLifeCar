# =====================================================
# TwoLifeCar - Configuración de Producción SSL
# =====================================================

## 🔐 Configuración SSL para https://www.3910.efdiaz.xyz

### Prerrequisitos
1. **Dominio configurado**: `3910.efdiaz.xyz` debe apuntar a tu servidor
2. **Puertos abiertos**: 80 (HTTP) y 443 (HTTPS) en tu servidor/firewall
3. **Docker instalado** y corriendo

### 🚀 Pasos para Despliegue

#### 1. Verificar DNS
```bash
# Verificar que el dominio apunta a tu servidor
nslookup 3910.efdiaz.xyz
ping 3910.efdiaz.xyz
```

#### 2. Configurar SSL Automáticamente
```bash
# En el directorio del proyecto
cd TwoLifeCar
chmod +x scripts/setup-ssl.sh
./scripts/setup-ssl.sh
```

#### 3. Despliegue Manual (Alternativo)
```bash
# Paso 1: Obtener certificados SSL
docker run --rm -it \
    -v "$PWD/docker/ssl:/etc/letsencrypt" \
    -p 80:80 \
    certbot/certbot certonly \
    --standalone \
    --email admin@3910.efdiaz.xyz \
    --agree-tos \
    --no-eff-email \
    -d 3910.efdiaz.xyz \
    -d www.3910.efdiaz.xyz

# Paso 2: Copiar certificados
cp docker/ssl/live/3910.efdiaz.xyz/fullchain.pem docker/ssl/
cp docker/ssl/live/3910.efdiaz.xyz/privkey.pem docker/ssl/

# Paso 3: Levantar servicios
docker-compose up -d
```

### 🌐 URLs de Acceso
- **Producción**: https://www.3910.efdiaz.xyz
- **API**: https://www.3910.efdiaz.xyz/api/
- **Dashboard**: https://www.3910.efdiaz.xyz/dashboard
- **Health Check**: https://www.3910.efdiaz.xyz/health

### 🔄 Renovación de Certificados
```bash
# Renovación manual
docker/ssl/renew-ssl.sh

# Renovación automática (agregar a crontab)
0 12 * * * cd /path/to/TwoLifeCar && docker/ssl/renew-ssl.sh
```

### 🛠️ Troubleshooting

#### Problema: Certificados no se generan
```bash
# Verificar que el dominio apunta a tu servidor
dig 3910.efdiaz.xyz +short

# Verificar que no hay otros servicios en puerto 80
sudo netstat -tlnp | grep :80
```

#### Problema: Nginx no inicia
```bash
# Verificar configuración de nginx
docker run --rm -v "$PWD/docker/nginx/prod.conf:/etc/nginx/nginx.conf:ro" nginx:alpine nginx -t

# Ver logs de nginx
docker-compose logs nginx
```

#### Problema: Servicios no accesibles
```bash
# Verificar estado de contenedores
docker-compose ps

# Verificar conectividad de red
docker-compose exec nginx ping api
docker-compose exec nginx ping dashboard
```

### 📊 Monitoreo de Servicios
```bash
# Health check completo
curl -f https://www.3910.efdiaz.xyz/health

# Status de API
curl -f https://www.3910.efdiaz.xyz/api/

# Logs en tiempo real
docker-compose logs -f nginx
docker-compose logs -f api
```

### 🔒 Configuración de Seguridad
- ✅ HTTPS forzado (redirect automático)
- ✅ Headers de seguridad configurados
- ✅ Rate limiting en API
- ✅ HSTS habilitado
- ✅ Gzip compression activado
- ✅ SSL moderno (TLS 1.2+)

### 📁 Estructura de Archivos SSL
```
docker/ssl/
├── fullchain.pem      # Certificado completo
├── privkey.pem        # Clave privada
├── renew-ssl.sh       # Script de renovación
└── live/              # Archivos originales de certbot
    └── 3910.efdiaz.xyz/
        ├── fullchain.pem
        ├── privkey.pem
        └── ...
```

### 🚨 Notas Importantes
1. **Backup**: Respalda regularmente los certificados SSL
2. **Firewall**: Asegúrate de que los puertos 80 y 443 estén abiertos
3. **DNS**: El dominio debe apuntar a tu servidor antes de generar certificados
4. **Recursos**: El servidor debe tener suficiente memoria para todos los servicios

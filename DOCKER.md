# TwoLifeCar Docker Setup

Este proyecto incluye una configuración completa de Docker para desarrollo, testing y producción de los servicios TwoLifeCar.

## 🏗️ Arquitectura

```
TwoLifeCar/
├── api/                    # Backend API (Node.js/Express)
├── dashboard-twolifecar/   # Dashboard frontend (React/Vite)
├── landing-twolifecar/     # Landing page (React/Vite)
├── docker/                 # Configuraciones Docker
│   └── nginx/             # Configuraciones Nginx
├── docker-compose.yml      # Producción
├── docker-compose.dev.yml  # Desarrollo
├── docker-compose.test.yml # Testing
└── docker.ps1/.sh        # Scripts de administración
```

## 🚀 Servicios

| Servicio | Puerto Dev | Puerto Test | Puerto Prod | Descripción |
|----------|------------|-------------|-------------|-------------|
| API | 5001 | 5002 | 5001 | Backend Express.js |
| Dashboard | 3001 | 3002 | 3001 | React Dashboard |
| Landing | 3000 | 3003 | 3000 | React Landing Page |
| MongoDB | 27017 | 27018 | - | Base de datos |
| Redis | - | 6380 | - | Cache (solo testing) |
| Nginx | 80 | - | 80 | Load balancer |

## 📋 Prerrequisitos

- Docker Engine 20.10+
- Docker Compose 2.0+
- Git

## ⚙️ Configuración Inicial

1. **Clonar y configurar variables de entorno:**
   ```bash
   cd TwoLifeCar
   cp .env.example .env
   # Editar .env con tus valores reales
   ```

2. **Verificar archivo .env:**
   ```env
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/twolifecar
   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
   RECAPTCHA_SECRET_KEY=your-secret-key
   # ... otros valores
   ```

## 🔧 Comandos de Administración

### Windows (PowerShell)
```powershell
# Desarrollo
.\docker.ps1 -Command dev:up
.\docker.ps1 -Command dev:down
.\docker.ps1 -Command dev:logs

# Testing
.\docker.ps1 -Command test:up
.\docker.ps1 -Command test:run
.\docker.ps1 -Command test:down

# Producción
.\docker.ps1 -Command prod:deploy
.\docker.ps1 -Command prod:down

# Utilidades
.\docker.ps1 -Command status
.\docker.ps1 -Command logs -Environment dev -Service api
.\docker.ps1 -Command cleanup
```

### Linux/Mac (Bash)
```bash
# Desarrollo
./docker.sh dev:up
./docker.sh dev:down
./docker.sh dev:logs

# Testing
./docker.sh test:up
./docker.sh test:run
./docker.sh test:down

# Producción
./docker.sh prod:deploy
./docker.sh prod:down

# Utilidades
./docker.sh status
./docker.sh logs dev api
./docker.sh cleanup
```

## 🛠️ Entornos

### Desarrollo (`docker-compose.dev.yml`)

**Características:**
- Hot reload habilitado
- Volúmenes montados para desarrollo en tiempo real
- MongoDB local
- Logs detallados
- Sin optimizaciones de producción

**Servicios disponibles:**
- Landing: http://localhost:3000
- Dashboard: http://localhost:3001  
- API: http://localhost:5001
- MongoDB: localhost:27017
- Nginx: http://localhost:80

**Iniciar desarrollo:**
```bash
.\docker.ps1 -Command dev:up
```

### Testing (`docker-compose.test.yml`)

**Características:**
- Base de datos de testing separada
- Redis para cache de testing
- Variables de entorno específicas para testing
- Test runner con Playwright/Jest
- Sin persistencia de datos

**Servicios disponibles:**
- Landing: http://localhost:3003
- Dashboard: http://localhost:3002
- API: http://localhost:5002
- MongoDB: localhost:27018
- Redis: localhost:6380

**Ejecutar tests:**
```bash
.\docker.ps1 -Command test:up
.\docker.ps1 -Command test:run
```

### Producción (`docker-compose.yml`)

**Características:**
- Imágenes optimizadas multi-stage
- Nginx como load balancer
- Límites de recursos configurados
- SSL ready (configuración incluida)
- Health checks
- Rate limiting

**Servicios disponibles:**
- Todo a través de Nginx: http://localhost:80
- API directa: http://localhost:5001
- Dashboard directa: http://localhost:3001
- Landing directa: http://localhost:3000

**Deploy a producción:**
```bash
.\docker.ps1 -Command prod:deploy
```

## 🔗 Redes

Cada entorno utiliza su propia red Docker:

- **Desarrollo:** `twolifecar-network` (172.20.0.0/16)
- **Testing:** `twolifecar-test-network` (172.21.0.0/16)
- **Producción:** `twolifecar-network` (172.20.0.0/16)

## 💾 Volúmenes

### Desarrollo
- `mongodb_data`: Datos de MongoDB persistentes
- `api_logs`: Logs de la API
- Código fuente montado como volúmenes

### Testing  
- `mongodb_test_data`: Datos temporales de testing
- `redis_test_data`: Cache temporal de Redis
- `test_results`: Resultados de tests

### Producción
- `api_logs`: Logs de la API en producción

## 🔍 Monitoreo y Logs

**Ver logs de todos los servicios:**
```bash
.\docker.ps1 -Command logs -Environment dev
```

**Ver logs de un servicio específico:**
```bash
.\docker.ps1 -Command logs -Environment dev -Service api
```

**Estado de todos los entornos:**
```bash
.\docker.ps1 -Command status
```

## 🚨 Troubleshooting

### Error: Puerto en uso
```bash
# Verificar qué está usando el puerto
netstat -ano | findstr :3000
# Matar proceso si es necesario
taskkill /PID [PID] /F
```

### Error: Variables de entorno
```bash
# Verificar que .env existe y tiene las variables correctas
Get-Content .env
```

### Error: Falta de espacio en disco
```bash
# Limpiar recursos Docker
.\docker.ps1 -Command cleanup
docker system df
docker system prune -a
```

### Reiniciar completamente
```bash
.\docker.ps1 -Command cleanup
.\docker.ps1 -Command dev:up
```

## 🔐 Seguridad

### Desarrollo
- Contraseñas por defecto (cambiar en producción)
- CORS permisivo
- Logs detallados

### Producción
- Variables de entorno seguras requeridas
- Rate limiting configurado
- Security headers habilitados
- SSL ready (descomentar configuración)
- Usuarios no-root en contenedores

## 📈 Escalabilidad

Para escalar servicios en producción:

```bash
# Escalar API a 3 instancias
docker-compose up -d --scale api=3

# Verificar balanceador de carga
curl http://localhost/api/health
```

## 🔄 CI/CD

El setup está preparado para integración con:
- GitHub Actions
- GitLab CI
- Jenkins
- Azure DevOps

Ejemplo de pipeline básico incluido en cada Dockerfile.

## 📞 Soporte

Para problemas específicos:
1. Verificar logs: `.\docker.ps1 -Command logs`
2. Verificar estado: `.\docker.ps1 -Command status`
3. Limpiar y reiniciar: `.\docker.ps1 -Command cleanup && .\docker.ps1 -Command dev:up`

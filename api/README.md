# TwoLifeCar API

Backend API para el sistema TwoLifeCar.

## Deployment en Vercel

### Variables de Entorno Requeridas:
- `MONGODB_URI`: URI de conexión a MongoDB
- `JWT_SECRET`: Secret para JWT
- `RECAPTCHA_SECRET_KEY`: Key secreta de Google reCAPTCHA
- `SLACK_WEBHOOK_URL`: URL del webhook de Slack (opcional)

### Configuración:
1. Conectar repositorio a Vercel
2. Agregar variables de entorno
3. Deploy automático

## Endpoints:
- `POST /api/leads` - Crear nuevo lead
- `GET /api/leads` - Obtener leads (requiere autenticación)
- `DELETE /api/leads/:id` - Eliminar lead (requiere autenticación)
- `POST /api/login` - Login de usuario
- `GET /api/create-admin` - Crear usuario admin

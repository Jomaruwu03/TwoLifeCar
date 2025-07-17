# 📊 Monitoreo de Discord en Producción

## URLs de Verificación en Vercel

Una vez que despliegues tu API en Vercel, podrás usar estas URLs para verificar el estado:

### 🏥 Estado General de la API
```
https://tu-api.vercel.app/
```
**Respuesta esperada:**
```json
{
  "message": "🚗 TwoLifeCar API is running",
  "status": "healthy",
  "timestamp": "2025-01-16T...",
  "environment": "production",
  "services": {
    "discord": "configured",
    "slack": "configured", 
    "mongodb": "connected",
    "recaptcha": "configured"
  },
  "endpoints": {
    "leads": "/api/leads",
    "discord_status": "/api/discord/status",
    "discord_test": "/api/discord/test"
  }
}
```

### 🔍 Estado Específico de Discord
```
https://tu-api.vercel.app/api/discord/status
```
**Respuesta esperada:**
```json
{
  "status": "Discord service is running",
  "configured": true,
  "webhookUrl": "https://discord.com/api/webhooks/123456789...",
  "timestamp": "2025-01-16T...",
  "environment": "production"
}
```

### 🧪 Prueba de Notificación Discord
```
https://tu-api.vercel.app/api/discord/test
```
**Respuesta esperada:**
```json
{
  "message": "Test notification sent to Discord"
}
```

## 📝 Scripts de Verificación

### Verificación Local
```bash
npm run test:discord
```

### Verificación de Producción
```bash
# Configura la URL de tu API
export API_URL=https://tu-api.vercel.app
npm run test:discord:prod
```

## 🚨 Troubleshooting

### Si Discord no está configurado
- Verifica que `DISCORD_WEBHOOK_URL` esté en las variables de entorno de Vercel
- Ve a Settings > Environment Variables en tu dashboard de Vercel

### Si las notificaciones fallan
1. Verifica que el webhook de Discord sea válido
2. Comprueba que el canal del webhook exista
3. Revisa los logs en Vercel Dashboard > Functions > View Function Logs

### Logs a monitorear
```
📢 Preparando notificación a Discord...
📢 Enviando notificación a Discord...
✅ Notificación enviada a Discord exitosamente
```

## 🔧 Variables de Entorno Requeridas

En Vercel, configura estas variables:

```env
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN
MONGODB_URI=mongodb+srv://...
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
RECAPTCHA_SECRET_KEY=your_secret_key
JWT_SECRET=your_jwt_secret
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_USER_ID=your_user_id
PRIVATE_API_KEY=your_private_key
```

## 📈 Monitoreo Continuo

### Verificación automática con curl
```bash
# Verificar cada 5 minutos
watch -n 300 curl -s https://tu-api.vercel.app/api/discord/status
```

### Webhook de Discord para monitoreo
Puedes configurar un webhook separado solo para logs de monitoreo y usar el endpoint de prueba regularmente.

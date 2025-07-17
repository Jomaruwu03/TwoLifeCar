# Configuración de Discord para TwoLifeCar API

## Cómo configurar Discord Webhooks

### 1. Crear un Webhook en Discord

1. Ve a tu servidor de Discord
2. Haz clic derecho en el canal donde quieres recibir las notificaciones
3. Selecciona "Editar Canal"
4. Ve a la pestaña "Integraciones"
5. Haz clic en "Crear Webhook"
6. Personaliza el nombre del webhook (ej: "TwoLifeCar Notifications")
7. Copia la URL del webhook

### 2. Configurar las variables de entorno

Agrega la URL del webhook a tu archivo `.env`:

```env
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/TU_WEBHOOK_ID/TU_WEBHOOK_TOKEN
```

### 3. Endpoints disponibles

#### Probar la conexión
```http
GET /api/discord/test
```

#### Enviar mensaje personalizado
```http
POST /api/discord/send
Content-Type: application/json

{
  "title": "Título del mensaje",
  "message": "Contenido del mensaje",
  "color": 16711680
}
```

#### Colores disponibles
- Verde: `0x00ff00` o `65280`
- Rojo: `0xff0000` o `16711680`
- Azul: `0x0099ff` o `39423`
- Amarillo: `0xffff00` o `16776960`
- Naranja: `0xff9900` o `16750848`

### 4. Notificaciones automáticas

Las notificaciones se envían automáticamente cuando:
- Se crea un nuevo lead (formulario de contacto)

### 5. Estructura del mensaje de lead

```json
{
  "embeds": [{
    "title": "🚗 Nuevo Lead de TwoLifeCar",
    "color": 65280,
    "fields": [
      {
        "name": "👤 Nombre",
        "value": "Nombre del cliente",
        "inline": true
      },
      {
        "name": "📧 Email",
        "value": "email@cliente.com",
        "inline": true
      },
      {
        "name": "💬 Mensaje",
        "value": "Mensaje del cliente",
        "inline": false
      }
    ],
    "timestamp": "2025-01-16T10:30:00.000Z",
    "footer": {
      "text": "TwoLifeCar CRM"
    }
  }]
}
```

## Troubleshooting

### Error: Discord webhook URL not configured
- Verifica que `DISCORD_WEBHOOK_URL` esté configurado en tu `.env`
- Asegúrate de que la URL del webhook sea válida

### Error: Unauthorized
- Verifica que la URL del webhook sea correcta
- Asegúrate de que el webhook no haya sido eliminado del servidor Discord

### No se reciben notificaciones
- Verifica que el canal del webhook exista
- Comprueba que el bot tenga permisos para enviar mensajes
- Revisa los logs del servidor para errores

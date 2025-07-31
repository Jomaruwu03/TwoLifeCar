# Dockerfile para API de TwoLifeCar
FROM node:20-alpine AS base

# Instalar dumb-init para manejo de señales
RUN apk add --no-cache dumb-init

# Crear directorio de trabajo
WORKDIR /usr/src/app

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production && npm cache clean --force

# Copiar código fuente
COPY . .

# Cambiar propiedad de archivos al usuario nodejs
RUN chown -R nodejs:nodejs /usr/src/app
USER nodejs

# Exponer puerto
EXPOSE 5001

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=5001

# Comando de inicio con dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]

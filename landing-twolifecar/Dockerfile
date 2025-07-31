# Multi-stage build para Landing TwoLifeCar
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copiar package.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Build del proyecto
RUN npm run build

# Imagen de producción con nginx
FROM nginx:alpine

# Copiar archivos estáticos desde el builder
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Crear usuario no-root
RUN addgroup -g 1001 -S nginx
RUN adduser -S nginx -u 1001

# Exponer puerto
EXPOSE 80

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]

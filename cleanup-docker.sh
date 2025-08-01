#!/bin/bash

echo "🧹 Limpiando Docker completamente..."

# Detener todos los contenedores de TwoLifeCar
echo "Deteniendo contenedores..."
docker stop $(docker ps -q --filter "name=twolifecar") 2>/dev/null || true

# Eliminar todos los contenedores de TwoLifeCar
echo "Eliminando contenedores..."
docker rm $(docker ps -aq --filter "name=twolifecar") 2>/dev/null || true

# Eliminar redes personalizadas de TwoLifeCar
echo "Eliminando redes personalizadas..."
docker network ls --filter "name=twolifecar" --format "{{.Name}}" | xargs -r docker network rm 2>/dev/null || true

# Limpiar sistema Docker
echo "Limpiando sistema Docker..."
docker system prune -f

# Verificar que no queden contenedores
echo "✅ Contenedores restantes:"
docker ps --filter "name=twolifecar"

# Verificar puertos
echo "✅ Puertos 80 y 443:"
netstat -tlnp | grep -E ":(80|443)" || echo "Puertos libres"

echo "🎉 Limpieza completada"

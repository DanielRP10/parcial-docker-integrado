# Imagen base específica y ligera
FROM node:18-alpine

# Crear usuario no-root (opcional extra de seguridad)
# node:18-alpine ya trae usuario 'node', lo usaremos.
# Si quisieras crear uno propio: RUN addgroup -S app && adduser -S app -G app

# Directorio de trabajo
WORKDIR /app

# Copiar solo manifest de dependencias para aprovechar cache
COPY package*.json ./

# Instalar dependencias sin dev (más ligero)
RUN npm ci --omit=dev

# Copiar el resto del código
COPY . .

# Exponer puerto del servicio
EXPOSE 3000

# Ejecutar como usuario no-root
USER node

# Comando por defecto
CMD ["npm", "start"]


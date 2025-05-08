# Etapa de construcción
FROM node:16-alpine as build

# Directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Crear directorio para los archivos de la aplicación
RUN mkdir -p /usr/share/nginx/html

# Copiar la configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos de construcción al directorio de nginx
COPY --from=build /app/build /usr/share/nginx/html

# Establecer permisos correctos para los archivos
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Exponer el puerto 4000
EXPOSE 4000

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"] 
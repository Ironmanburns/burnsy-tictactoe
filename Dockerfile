FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
RUN printf 'add_header Cache-Control "public, max-age=3600, must-revalidate";\n' \
    > /etc/nginx/conf.d/cache.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

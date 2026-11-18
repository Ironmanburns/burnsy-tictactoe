FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.29-alpine
# Pick up Alpine security fixes before the image is scanned.
# nginx:1.29-alpine has shipped brotli-libs 1.2.0-r0 (CVE-2026-111497); 1.2.1-r0 fixes it.
RUN apk upgrade --no-cache
COPY --from=builder /app/dist /usr/share/nginx/html
RUN printf 'add_header Cache-Control "public, max-age=3600, must-revalidate";\n' \
    > /etc/nginx/conf.d/cache.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

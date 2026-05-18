FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:stable-alpine
RUN addgroup -g 101 -S nginx && \
    adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -c "Nginx user" -G nginx nginx
WORKDIR /app
COPY --from=builder /app/dist /usr/share/nginx/html
RUN echo 'add_header Cache-Control "public, max-age=3600, must-revalidate";' \
    > /etc/nginx/conf.d/cache.conf && \
    chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/run/nginx
USER nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

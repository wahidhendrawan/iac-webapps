# Build Stage
FROM public.ecr.aws/docker/library/node:26-alpine@sha256:58865c57a5a3cbfa476dd057be7bd96e2d08a7a8e5393ae9089247d478ed1e7f AS build

WORKDIR /app

# Install the locked dependency tree, including build-time dependencies.
# Dependencies remain in this disposable builder stage only.
COPY package*.json ./
RUN npm ci --ignore-scripts && npm cache clean --force

# Copy source code and build
COPY . .
RUN npm run build

# Production Stage
FROM public.ecr.aws/nginx/nginx:alpine@sha256:bc604ee39ac5d5339934146d6ba0005471b6edcd1dd83b670c59bb6f5bafc9d3 AS runtime

# Nginx listens on an unprivileged port and writes its pid/cache under /tmp.
# This permits a non-root runtime without granting extra capabilities.
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup && \
    mkdir -p /tmp/nginx/client_temp /tmp/nginx/proxy_temp /tmp/nginx/fastcgi_temp /tmp/nginx/uwsgi_temp /tmp/nginx/scgi_temp && \
    chown -R appuser:appgroup /tmp/nginx

# Copy custom nginx config overwriting default
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built artifacts from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Set ownership to non-root user
RUN chown -R appuser:appgroup /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Switch to non-root user
USER appuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
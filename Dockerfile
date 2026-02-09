# Build Stage
FROM public.ecr.aws/docker/library/node:20-alpine AS build

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Production Stage
FROM public.ecr.aws/nginx/nginx:alpine

# Copy custom nginx config overwriting default
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built artifacts from build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

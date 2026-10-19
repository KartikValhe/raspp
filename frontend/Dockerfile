# ── Frontend Dockerfile (multi-stage) ───────────────────────────────────────
# Stage 1: Build the React + Vite app
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies (copy lock files first for better layer caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# ────────────────────────────────────────────────────────────────────────────
# Stage 2: Serve the static build with Nginx
FROM nginx:alpine AS production

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config (handles SPA routing + API proxy)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

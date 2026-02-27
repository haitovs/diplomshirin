# ── Stage 1: Build Frontend ──────────────────────────────
FROM node:20-alpine AS frontend-builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Stage 2: Production Runtime ─────────────────────────
FROM node:20-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /app

# Install backend dependencies
COPY backend/package.json ./backend/
RUN cd backend && npm install --omit=dev && apk del python3 make g++

# Copy backend code
COPY backend/ ./backend/

# Copy built frontend into backend's public directory
COPY --from=frontend-builder /app/dist ./backend/public

ENV NODE_ENV=production
ENV PORT=4085

EXPOSE 4085

CMD ["node", "backend/server.js"]

# Stage 1: build
FROM node:22-bullseye-slim AS builder

ENV NODE_OPTIONS="--max-old-space-size=1024"

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: production
FROM node:22-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

CMD ["node", "dist/main.js"]

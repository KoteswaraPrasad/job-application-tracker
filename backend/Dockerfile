# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .

# Stage 2: Production image
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app .

# Create uploads directory for Multer
RUN mkdir -p uploads

EXPOSE 5000

CMD ["node", "server.js"]

# ========== STAGE 1: Build ==========
FROM node:20.11.1-slim AS builder

# Установка зависимостей
WORKDIR /app

# Копируем package.json и lock-файл
COPY package*.json ./

# Установка зависимостей
RUN npm ci

# Копируем остальной код
COPY . .

# Генерация Prisma клиента
RUN npx prisma generate

# Сборка проекта (NestJS)
RUN npm run build


# ========== STAGE 2: Production ==========
FROM node:20.11.1-slim AS production

# Установка зависимостей
RUN apt update && \
    apt install -y dumb-init curl ca-certificates libssl3 && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Копируем только нужные файлы
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/.env .env

# Если нужен Prisma клиент, копируем его
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production
EXPOSE 4200

COPY entry.sh /app/entry.sh
RUN chmod +x /app/entry.sh

# Start the application using the entry script
CMD ["/app/entry.sh"]
# CMD ["dumb-init", "sh", "-c", "npx prisma migrate deploy && node dist/src/main"]


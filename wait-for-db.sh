#!/bin/sh
set -e
echo "Waiting for PostgreSQL to be available at db:5432..."

# Ждём, пока порт 5432 на контейнере `db` не станет доступен
while ! nc -z db 5432; do
  echo "Waiting for database connection..."
  sleep 1
done

echo "Database is up. Running Prisma migration and seed..."

# Запускаем переданную в CMD команду (например, npm run start:prod)
npx prisma migrate deploy
npx prisma db seed

npm node dist/src.js
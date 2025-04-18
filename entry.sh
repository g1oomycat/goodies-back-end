#!/bin/sh

# Безопасное чтение секрета и экспорта как переменной окружения
read_secret() {
  local secret_name=$1
  local env_var_name=$2
  local secret_path="/run/secrets/${secret_name}"

  if [ -f "${secret_path}" ]; then
    # Удаляем лишние символы \r и \n
    value=$(tr -d '\r' < "${secret_path}" | tr -d '\n')
    export "${env_var_name}"="${value}"
  else
    echo "❌ Secret file ${secret_path} not found"
    exit 1
  fi
}

# Применяем к каждому секрету
read_secret "database_url" "DATABASE_URL"
read_secret "jwt_secret" "JWT_SECRET"
read_secret "aws_access_key_id" "AWS_ACCESS_KEY_ID"
read_secret "aws_secret_access_key" "AWS_SECRET_ACCESS_KEY"
read_secret "aws_region" "AWS_REGION"
read_secret "aws_bucket_name" "AWS_BUCKET_NAME"

# Миграции
npx prisma migrate deploy
if [ $? -ne 0 ]; then
  echo "❌ Ошибка при миграции базы данных. Завершаем работу."
  exit 1
fi

# Запуск приложения
echo "🚀 Запуск приложения"
exec node dist/main.js

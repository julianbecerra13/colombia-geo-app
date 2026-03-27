#!/bin/sh

echo "Esperando a que la base de datos esté lista..."
sleep 3

echo "Ejecutando migraciones..."
npx prisma migrate deploy

echo "Ejecutando seed..."
npx prisma db seed

echo "Iniciando servidor..."
node dist/main

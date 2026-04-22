#!/bin/sh
set -e

echo "⏳ Pushing database schema..."
npx prisma db push --skip-generate

echo "🌱 Seeding database..."
npx prisma db seed

echo "🚀 Starting Next.js server..."
exec npm start

#!/bin/bash
# Deploy do front-end (Vercel ou Netlify)
set -e

cd frontend

echo "Installing dependencies..."
npm ci

echo "Building for production..."
VITE_API_URL="${VITE_API_URL:-https://api.seudominio.com/api}" npm run build

echo "Build output: frontend/dist/"

# Tenta deploy via Vercel ou Netlify se o CLI estiver instalado
if command -v vercel &> /dev/null; then
  echo "Vercel CLI found, deploying..."
  vercel --prod --yes
  echo "Vercel deploy complete."
elif command -v netlify &> /dev/null; then
  echo "Netlify CLI found, deploying..."
  netlify deploy --prod --dir=dist
  echo "Netlify deploy complete."
else
  echo "No deploy CLI found (vercel/netlify)."
  echo "Build available at frontend/dist/ for manual deploy."
fi

echo "Frontend deploy finished."

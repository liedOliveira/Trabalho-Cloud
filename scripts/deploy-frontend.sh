#!/bin/bash
# ==============================================
#  Script de Deploy — Front-end (Vercel / Netlify)
# ==============================================
set -e

echo "🚀 Iniciando deploy do front-end..."

cd frontend

echo "📦 Instalando dependências..."
npm ci

echo "🔨 Gerando build de produção..."
VITE_API_URL="${VITE_API_URL:-https://api.seudominio.com/api}" npm run build

echo "📁 Build gerado em: frontend/dist/"

# --- Deploy para Vercel (se CLI disponível) ---
if command -v vercel &> /dev/null; then
  echo "🔺 Vercel CLI detectado — executando deploy..."
  vercel --prod --yes
  echo "✅ Deploy Vercel concluído!"
# --- Deploy para Netlify (se CLI disponível) ---
elif command -v netlify &> /dev/null; then
  echo "🔷 Netlify CLI detectado — executando deploy..."
  netlify deploy --prod --dir=dist
  echo "✅ Deploy Netlify concluído!"
else
  echo "⚠️  Nenhum CLI de deploy detectado (vercel/netlify)."
  echo "   O build está disponível em frontend/dist/ para deploy manual."
fi

echo ""
echo "✅ Deploy do front-end concluído!"

#!/bin/bash
# ==============================================
#  Script de Deploy — Back-end (Docker)
# ==============================================
set -e

echo "🚀 Iniciando deploy do back-end..."

# Variáveis
IMAGE_NAME="reservas-api"
IMAGE_TAG="${1:-latest}"
REGISTRY="${DOCKER_REGISTRY:-}"

echo "📦 Building Docker image: ${IMAGE_NAME}:${IMAGE_TAG}"
docker build -t "${IMAGE_NAME}:${IMAGE_TAG}" ./backend

if [ -n "$REGISTRY" ]; then
  FULL_IMAGE="${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
  echo "🏷️  Tagging: ${FULL_IMAGE}"
  docker tag "${IMAGE_NAME}:${IMAGE_TAG}" "${FULL_IMAGE}"

  echo "📤 Pushing para registry: ${REGISTRY}"
  docker push "${FULL_IMAGE}"
  echo "✅ Imagem enviada: ${FULL_IMAGE}"
else
  echo "⚠️  DOCKER_REGISTRY não definido — imagem mantida apenas localmente."
fi

echo ""
echo "✅ Deploy do back-end concluído!"
echo "   Imagem: ${IMAGE_NAME}:${IMAGE_TAG}"

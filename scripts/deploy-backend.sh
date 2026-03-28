#!/bin/bash
# Deploy do back-end via Docker
set -e

IMAGE_NAME="reservas-api"
IMAGE_TAG="${1:-latest}"
REGISTRY="${DOCKER_REGISTRY:-}"

echo "Building Docker image: ${IMAGE_NAME}:${IMAGE_TAG}"
docker build -t "${IMAGE_NAME}:${IMAGE_TAG}" ./backend

if [ -n "$REGISTRY" ]; then
  FULL_IMAGE="${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
  echo "Tagging: ${FULL_IMAGE}"
  docker tag "${IMAGE_NAME}:${IMAGE_TAG}" "${FULL_IMAGE}"

  echo "Pushing to registry..."
  docker push "${FULL_IMAGE}"
  echo "Done: ${FULL_IMAGE}"
else
  echo "DOCKER_REGISTRY not set, image kept locally only."
fi

echo "Backend deploy finished. Image: ${IMAGE_NAME}:${IMAGE_TAG}"

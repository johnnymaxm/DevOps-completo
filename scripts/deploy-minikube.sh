#!/usr/bin/env bash
set -euo pipefail

PRIMARY_IMAGE="johnnymaxm/devops-app:latest"
FALLBACK_IMAGE="devops-app:local"
DEPLOYMENT_NAME="devops-app"
CONTAINER_NAME="devops-app"
ROLLOUT_TIMEOUT="120s"

echo "==> Validando contexto do kubectl"
kubectl cluster-info >/dev/null

echo "==> Usando Docker do minikube para build local"
eval "$(minikube docker-env)"

echo "==> Build da imagem fallback local: ${FALLBACK_IMAGE}"
docker build -t "${FALLBACK_IMAGE}" .

echo "==> Aplicando manifests base"
kubectl apply -f k8s/

echo "==> Tentando imagem primaria: ${PRIMARY_IMAGE}"
kubectl set image "deployment/${DEPLOYMENT_NAME}" "${CONTAINER_NAME}=${PRIMARY_IMAGE}"

if kubectl rollout status "deployment/${DEPLOYMENT_NAME}" --timeout="${ROLLOUT_TIMEOUT}"; then
  echo "==> Sucesso com imagem primaria: ${PRIMARY_IMAGE}"
  exit 0
fi

echo "==> Falha com imagem primaria. Aplicando fallback: ${FALLBACK_IMAGE}"
kubectl set image "deployment/${DEPLOYMENT_NAME}" "${CONTAINER_NAME}=${FALLBACK_IMAGE}"
kubectl rollout status "deployment/${DEPLOYMENT_NAME}" --timeout="${ROLLOUT_TIMEOUT}"
echo "==> Sucesso com fallback local: ${FALLBACK_IMAGE}"

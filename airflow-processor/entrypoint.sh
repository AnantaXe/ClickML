#!/usr/bin/env bash
set -euo pipefail

echo "Waiting for PostgreSQL..."
RETRIES=30
until pg_isready -h "${POSTGRES_HOST:-postgres}" -p "${POSTGRES_PORT:-5432}" -U "${POSTGRES_USER:-airflow}" >/dev/null 2>&1; do
  ((RETRIES--)) || { echo "Postgres is unavailable - giving up"; exit 1; }
  echo "Postgres not ready yet. Retrying... ($RETRIES left)"
  sleep 2
done
echo "Postgres is ready."

echo "Applying DB migrations..."
if airflow db upgrade >/dev/null 2>&1; then
  echo "airflow db upgrade succeeded."
else
  echo "airflow db migrate >/dev/null 2>&1" && airflow db migrate || airflow db init
fi

airflow connections create-default-connections || true

airflow users create \
  --username "${AIRFLOW__WEBSERVER__RBAC_USER:-admin}" \
  --firstname Admin --lastname User --role Admin \
  --email admin@example.com \
  --password "${AIRFLOW_ADMIN_PASSWORD:-admin}" 2>/dev/null || true

airflow webserver --port 8080 &
sleep 2
exec airflow scheduler

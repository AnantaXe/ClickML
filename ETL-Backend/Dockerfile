# Use the Astronomer Airflow base image (compatible with Astro CLI)
FROM astrocrpublic.azurecr.io/runtime:3.1-2

USER root

RUN apt-get update && apt-get install -y bash

# COPY requirements.txt ./

RUN pip install --no-cache-dir fastapi uvicorn jinja2 pydantic paramiko apache-airflow-providers-ssh apache-airflow-providers-dbt-cloud apache-airflow-providers-sftp[common.compat] apache-airflow-providers-amazon requests boto3

WORKDIR /


EXPOSE 8000


USER astro

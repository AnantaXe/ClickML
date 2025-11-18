# Use the Astronomer Airflow base image (compatible with Astro CLI)
FROM astrocrpublic.azurecr.io/runtime:3.1-2

USER root

ENV DEBIAN_FRONTEND=noninteractive

# 1. CRITICAL FIX: Install build tools for PyArrow compilation fallback.
RUN apt-get update && apt-get install -y --no-install-recommends \
    cmake \
    build-essential \
    python3-dev libssl-dev libbz2-dev liblz4-dev libzstd-dev \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip (Good practice)
RUN python -m pip install --upgrade pip setuptools wheel

# 2. CRITICAL FIX: PyArrow C++ core bundle flag.
ENV PYARROW_BUNDLE_ARROW_CPP=1

# 3. Installation Step with Pinned Versions for Stability
RUN pip install --no-cache-dir \
    # Pin these to roll back to a known working state:
    "pyarrow==15.0.0" \
    "apache-airflow-providers-amazon==9.15.0" \
    "apache-airflow-providers-dbt-cloud==3.1.1" \
    \
    # Install the rest of your packages unpinned (or pin them too for maximum stability):
    fastapi uvicorn jinja2 pydantic paramiko \
    apache-airflow-providers-ssh \
    "apache-airflow-providers-sftp[common.compat]" \
    requests boto3

WORKDIR /

EXPOSE 8000

USER astro
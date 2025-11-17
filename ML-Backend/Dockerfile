FROM postgres:latest

# Set environment variables for PostgreSQL
# These variables are used by the entrypoint script of the official PostgreSQL image
ENV POSTGRES_DB=mydatabase
ENV POSTGRES_USER=myuser
ENV POSTGRES_PASSWORD=mypassword

# Copy SQL initialization scripts into the container
# Scripts in /docker-entrypoint-initdb.d/ are executed when the container starts for the first time
# Ensure your 'init.sql' file is in the same directory as your Dockerfile
COPY init.sql /docker-entrypoint-initdb.d/

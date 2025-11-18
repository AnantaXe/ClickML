FROM apache/airflow:2.7.3-python3.11

USER root

# copy the entrypoint script and make it executable inside the image
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# revert to airflow user
USER airflow

# set the entrypoint so the container runs our script (not the airflow CLI)
ENTRYPOINT ["/entrypoint.sh"]

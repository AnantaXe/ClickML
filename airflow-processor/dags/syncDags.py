from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.providers.amazon.aws.hooks.s3 import S3Hook
from datetime import datetime, timedelta, timezone
import os
import tempfile

# --- Config --- #
S3_CONN_ID = "aws-s3-clickml"       # Airflow connection id (do NOT hardcode keys in code)
S3_BUCKET_NAME = "clickml-etl-storage"
S3_PREFIX = ""                      # adjust if you store dags under a prefix/folder
LOCAL_DAGS_FOLDER = "/opt/airflow/dags"  # typical mount path in docker-compose

def sync_dags_from_s3(**context):
    """Download updated DAG .py files from S3 to the local DAGs folder atomically."""
    print("Starting S3 -> local DAG sync")

    hook = S3Hook(aws_conn_id=S3_CONN_ID)
    s3_client = hook.get_conn()
    bucket = S3_BUCKET_NAME

    paginator = s3_client.get_paginator('list_objects_v2')

    os.makedirs(LOCAL_DAGS_FOLDER, exist_ok=True)

    pages = paginator.paginate(Bucket=bucket, Prefix=S3_PREFIX)
    for page in pages:
        contents = page.get('Contents') or []
        for obj in contents:
            key = obj.get('Key')
            if not key or not key.endswith('.py'):
                continue

            filename = os.path.basename(key)
            local_file_path = os.path.join(LOCAL_DAGS_FOLDER, filename)

            # S3 LastModified is a datetime with tzinfo
            s3_last_modified = obj.get('LastModified')
            s3_ts = None
            if s3_last_modified:
                # normalize to timestamp (seconds since epoch)
                if isinstance(s3_last_modified, datetime):
                    # ensure timezone-aware
                    if s3_last_modified.tzinfo is None:
                        s3_last_modified = s3_last_modified.replace(tzinfo=timezone.utc)
                    s3_ts = s3_last_modified.timestamp()

            try:
                need_download = False
                if not os.path.exists(local_file_path):
                    need_download = True
                elif s3_ts is not None:
                    local_mtime = os.path.getmtime(local_file_path)
                    if s3_ts > local_mtime:
                        need_download = True

                if not need_download:
                    print(f"Skipped {key} (no change)")
                    continue

                print(f"Downloading s3://{bucket}/{key} -> {local_file_path}")

                # Download to a temporary file then atomically move into place
                with tempfile.NamedTemporaryFile(dir=LOCAL_DAGS_FOLDER, delete=False) as tmpf:
                    tmp_path = tmpf.name
                try:
                    s3_client.download_file(bucket, key, tmp_path)
                    # atomic replace
                    os.replace(tmp_path, local_file_path)
                    print(f"✅ Synced {filename} successfully")
                finally:
                    # cleanup tmp_path if it still exists
                    if os.path.exists(tmp_path) and tmp_path != local_file_path:
                        try:
                            os.remove(tmp_path)
                        except Exception:
                            pass

            except Exception as e:
                print(f"Error syncing {key}: {e}")

default_args = {
    "owner": "airflow",
    "depends_on_past": False,
    "retries": 1,
    "retry_delay": timedelta(minutes=5),
}

with DAG(
    dag_id="sync_s3_dags",
    default_args=default_args,
    description="Sync DAGs from S3 to local folder",
    start_date=datetime(2025, 1, 1),
    schedule_interval="*/5 * * * *",
    catchup=False,
    is_paused_upon_creation=False,
    tags=["infrastructure"],
) as dag:

    sync_dags_from_s3_task = PythonOperator(
        task_id="sync_dags_from_s3",
        python_callable=sync_dags_from_s3,
        provide_context=True,
    )

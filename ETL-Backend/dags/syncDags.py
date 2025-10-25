from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.providers.amazon.aws.hooks.s3 import S3Hook
from datetime import datetime, timedelta
import os


# --- Config --- #
S3_CONN_ID = "aws-s3-clickml"
S3_BUCKET_NAME = "clickml-etl-storage"
S3_PREFIX = ""
LOCAL_DAGS_FOLDER = "/usr/local/airflow/dags"

def sync_dags_from_s3(**context):

    """ 
    Download updated DAGs from S3 to the local DAGs folder.
    """

    hook = S3Hook(aws_conn_id=S3_CONN_ID)
    s3_client = hook.get_conn()
    bucket = S3_BUCKET_NAME

    paginator = s3_client.get_paginator('list_objects_v2')

    os.makedirs(LOCAL_DAGS_FOLDER, exist_ok=True)

    for page in paginator.paginate(Bucket=bucket, Prefix=S3_PREFIX):
        for obj in page.get('Contents', []):
            key = obj['Key']
            if not key.endswith('.py'):
                continue

            
            filename = os.path.basename(key)
            local_file_path = os.path.join(LOCAL_DAGS_FOLDER, filename)
            # Only download if the file does not exist or newer in S3

            if not os.path.exists(local_file_path) or \
               obj['LastModified'].timestamp() > os.path.getmtime(local_file_path):

                print(f"Downloading {key} to {local_file_path}")
                s3_client.download_file(bucket, key, local_file_path)

                print(f"Downloaded {key} to {local_file_path}")

                # Move from temp to target file
                temp_path = os.path.join(LOCAL_DAGS_FOLDER, filename)
                if os.path.exists(temp_path):
                    print(f"✅ Synced {filename} successfully")

            else:
                print(f"Skipped {key}, no changes detected.")

defualt_args = {
    "owner": "airflow",
    "depends_on_past": False,
    "retries": 1,
    "retry_delay": timedelta(minutes=5),
}

with DAG(
    dag_id="sync_s3_dags",
    default_args=defualt_args,
    description="Sync DAGs from S3 to local folder",
    start_date=datetime(2025, 1, 1),
    schedule="*/5 * * * *",
    catchup=False,
    is_paused_upon_creation=False,
) as dag:
    
    sync_dags_from_s3_task = PythonOperator(
        task_id="sync_dags_from_s3",
        python_callable=sync_dags_from_s3,
    )

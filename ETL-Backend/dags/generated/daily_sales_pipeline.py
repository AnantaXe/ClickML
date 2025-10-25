from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta

default_args = {
    "owner": "airflow",
    "depends_on_past": False,
    "start_date": datetime(2025, 1, 1),
    "email_on_failure": False,
    "email_on_retry": False,
    "retries": 1,
    "retry_delay": timedelta(minutes=5),
}

def extract(**context):
    print("Extracting data from PostgreSQL")

def transform(**context):
    print("Transforming data with columns: ['order_id', 'amount', 'region']")

def load(**context):
    print("Loading data to S3")

with DAG(
    dag_id="daily_sales_pipeline",
    default_args=default_args,
    description="ETL pipeline for daily_sales_pipeline",
    schedule="0 2 * * *",
    catchup=False,
) as dag:
    t1 = PythonOperator(task_id="extract", python_callable=extract)
    t2 = PythonOperator(task_id="transform", python_callable=transform)
    t3 = PythonOperator(task_id="load", python_callable=load)

    t1 >> t2 >> t3
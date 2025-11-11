from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta
import pandas as pd
import psycopg2
import mysql.connector

default_args = {
    "owner": "airflow",
    "start_date": datetime(2025, 1, 1),
    "retries": 1,
    "retry_delay": timedelta(minutes=5),
}

def get_connection(db_type, config):
    if db_type.lower() == "postgres":
        return psycopg2.connect(
            host=config["host"],
            user=config["user"],
            password=config["password"],
            dbname=config["database"],
            port=config.get("port", 5432)
        )
    elif db_type.lower() == "mysql":
        return mysql.connector.connect(
            host=config["host"],
            user=config["user"],
            password=config["password"],
            database=config["database"],
            port=config.get("port", 3306)
        )
    else:
        raise ValueError(f"Unsupported DB type: {db_type}")

def extract(**context):
    src = {
  "host": "source-db.company.com",
  "port": 3306,
  "user": "source_user",
  "password": "source_pass",
  "database": "sales_db"
}
    conn = get_connection("mysql", src)
    df = pd.read_sql("SELECT id, amount, region, date FROM transactions;", conn)
    conn.close()
    return df.to_dict(orient="records")

def transform(**context):
    data = context["ti"].xcom_pull(task_ids="extract")
    df = pd.DataFrame(data)

    
    df = df[id,amount,region,date]
    

    
    
    df = df.query("amount > 0")
    
    df = df.query("region != 'TEST'")
    
    

    
    exec("""def custom_transform(df):
    df['amount'] = df['amount'] * 1.1
    return df""", globals())
    df = custom_transform(df)
    

    return df.to_dict(orient="records")

def load(**context):
    dest = {
  "host": "warehouse-db.company.com",
  "port": 5432,
  "user": "warehouse_user",
  "password": "warehouse_pass",
  "database": "analytics"
}
    df = pd.DataFrame(context["ti"].xcom_pull(task_ids="transform"))
    conn = get_connection("postgres", dest)
    cursor = conn.cursor()

    for _, row in df.iterrows():
        placeholders = ','.join(['%s'] * len(row))
        sql = f"INSERT INTO sales_fact VALUES ({placeholders})"
        cursor.execute(sql, tuple(row))
    conn.commit()
    conn.close()

with DAG(
    dag_id="db_to_db_sales_etl",
    default_args=default_args,
    schedule="0 3 * * *",
    description="ETL from MySQL sales DB to PostgreSQL warehouse",
    catchup=False,
    is_paused_upon_creation=False,
) as dag:
    t1 = PythonOperator(task_id="extract", python_callable=extract)
    t2 = PythonOperator(task_id="transform", python_callable=transform)
    t3 = PythonOperator(task_id="load", python_callable=load)

    t1 >> t2 >> t3

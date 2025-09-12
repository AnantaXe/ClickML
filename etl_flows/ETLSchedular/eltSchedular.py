from prefect import flow, task
import requests
import psycopg2

@task
def fetch_data():
    resp = requests.get("https://example.com/api")
    return resp.json()

@task
def transform(data):
    # Your transform logic
    return [{"id": d["id"], "value": d["value"]} for d in data]

@task
def load(data):
    conn = psycopg2.connect("dbname=etl user=postgres password=secret host=db")
    cur = conn.cursor()
    for row in data:
        cur.execute("INSERT INTO my_table (id, value) VALUES (%s, %s)", (row["id"], row["value"]))
    conn.commit()
    cur.close()
    conn.close()

@flow(name="daily-etl")
def etl_flow():
    raw = fetch_data()
    cleaned = transform(raw)
    load(cleaned)

if __name__ == "__main__":
    etl_flow()

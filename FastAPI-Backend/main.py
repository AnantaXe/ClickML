from fastapi import FastAPI, Request
from jinja2 import Environment, FileSystemLoader
from dotenv import load_dotenv
import boto3
import os


load_dotenv()

app = FastAPI()

# Setup template loader
TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), "templates")
OUTPUT_DIR = "/usr/local/airflow/dags"
# os.makedirs(OUTPUT_DIR, exist_ok=True)

env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))

AWS_BUCKET = os.getenv("AWS_S3_BUCKET")
AWS_FOLDER = os.getenv("AWS_S3_FOLDER")

@app.post("/create-etl-pipeline")
async def create_etl_pipeline(request: Request):
    cfg = await request.json()
    print(env.list_templates())

    template = env.get_template("etl_dag_template.j2")
    rendered = template.render(
        dag_id=cfg["pipeline_name"],
        description="ETL pipeline for " + cfg["pipeline_name"],
        source=cfg["source"],
        input_features=cfg.get("input_features", []),
        destination=cfg["destination"],
        schedule=cfg.get("cron", "@daily"),
    )

    # output_path = os.path.join(OUTPUT_DIR, f"{cfg['pipeline_name']}.py")
    # with open(output_path, "w") as f:
    #     f.write(rendered)

    # Upload to S3
    s3 = boto3.client("s3")
    s3.put_object(
        Bucket=AWS_BUCKET,
        Key=f"{AWS_FOLDER}/{cfg['pipeline_name']}.py",
        Body=rendered,
    )

    return {"status": "success",
            "dag_file": f"s3://{AWS_BUCKET}/{AWS_FOLDER}/{cfg['pipeline_name']}.py"
            }

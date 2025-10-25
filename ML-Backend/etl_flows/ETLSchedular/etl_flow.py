from prefect import flow, task
import requests
# import os
import json
from pathlib import Path


@task
def extract(endpoint: str, features: list[str]):
    resp = requests.get(endpoint, timeout=30)
    resp.raise_for_status()
    data = resp.json()

    # Filter only the requested columns
    return [{col: row.get(col) for col in features} for row in data]


@task
def transform(data: list[dict]):
    # Placeholder for transformation logic
    return data


@task
def load(data: list[dict], destination: str):
    # Placeholder for loading logic
    print(f"📥 Loading data to {destination}")

    

    return True


@flow
def etl_flow(pipelinename: str, endpoint: str,
             input_features: list[str]):
    print(f"🚀 Running pipeline: {pipelinename}")
    transformed = extract(endpoint, input_features)
    print(f"✅ {len(transformed)} records transformed.")
    return transformed


# ---------------- Local execution helper ----------------
if __name__ == "__main__":
    """
    Run locally with a JSON file named 'config.json' in the same directory:
    {
      "pipelinename": "mypipeline",
      "endpoint": "https://api.example.com",
      "input_features": ["Col1", "Col2"],
      "api_secret_key": "your-real-key"
    }
    """
    cfg_path = Path(__file__).parent / "config.json"
    if not cfg_path.exists():
        raise FileNotFoundError("Please create config.json with your pipeline details")

    with cfg_path.open() as f:
        cfg = json.load(f)

    etl_flow(
        pipelinename=cfg["pipelinename"],
        endpoint=cfg["endpoint"],
        input_features=cfg["input_features"],
        # api_secret_key=cfg.get("api_secret_key", ""),
    )

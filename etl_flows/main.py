from fastapi import FastAPI, Request
from prefect import flow
# from prefect.deployments import Deployment
# from prefect.filesystems import GitHub
from prefect_github import GitHubRepository

from fastapi.concurrency import run_in_threadpool
# from prefect.server.schemas.schedules import CronSchedule
# from prefect.schedules import CronSchedule 
from ETLSchedular.etl_flow import etl_flow   # <-- import the flow

app = FastAPI()

@app.post("/create-etl-pipeline")
async def create_pipeline(request: Request):
    cfg = await request.json()

    # cron_schedule = CronSchedule(cron=cfg["cron"])
    # every_three_min = IntervalSchedule(interval=timedelta(minutes=3))
    cron_expr = cfg.get("cron")

    
    schedule = None
    if cron_expr:
        schedule = {
            "cron": cron_expr,
            "timezone": "UTC"
        }

    # storage = GitHubRepository(
    #     repository_url="https://github.com/AnantaXe/ClickML.git",  # your GitHub repo
    #     path="etl_flows/ETLSchedular/etl_flow.py",  # relative path inside repo
    #     ref="main",  # branch
    # )

    # create the deployment directly from the flow
    await run_in_threadpool(
        etl_flow.deploy,
        name=cfg["pipelinename"],
        parameters={
            "pipelinename": cfg["pipelinename"],
            "endpoint": cfg["endpoint"],
            "input_features": cfg["input_features"],
        },
        work_pool_name="default",
        schedule={
            "cron": cron_expr,
            "timezone": "UTC"
        },
        image="prefecthq/prefect-client:3-latest",
        # storage=storage,  # <-- key to avoid FileNotFound
        entrypoint="ETLSchedular/etl_flow.py:etl_flow"
    )


    return {"status": "scheduled"}

from fastapi import FastAPI, Request
# from prefect import flow
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

    # create the deployment directly from the flow
    await etl_flow.deploy(
        name=cfg["pipelinename"],
        parameters={
            "pipelinename": cfg["pipelinename"],
            "endpoint": cfg["endpoint"],
            "input_features": cfg["input_features"],
        },
        # schedule=cron_schedule,
        schedule={       # <- pass a schedule dictionary
            "cron": cron_expr,
            "timezone": "UTC"
        },
        work_pool_name="myworkpool", 

        image="imckr/my-prefect-image:latest",
        # storage="github/AnantaXe/ClickML@main",
    )

    return {"status": "scheduled"}

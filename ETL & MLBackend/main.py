from fastapi import FastAPI, Request
from fastapi.concurrency import run_in_threadpool
# from prefect import flow
# from prefect.server.schemas.schedules import CronSchedule
# from prefect.schedules import CronSchedule 
from etl_flows.ETLSchedular.etl_flow import etl_flow   # <-- import the flow

from Machine_learning.Components.Model_trainer import ModelTrainer
# from fastapi import FastAPI
from pydantic import BaseModel

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

    # create the deployment directly from the flow
    await run_in_threadpool(
        etl_flow.deploy,
        name=cfg["pipelinename"],
        parameters={
            "pipelinename": cfg["pipelinename"],
            "endpoint": cfg["endpoint"],
            "input_features": cfg["input_features"],
        },
        work_pool_name="myworkpool",
        schedule=schedule,
        image="imckr/my-prefect-image:latest",
        # image="prefecthq/prefect-client:3-latest",
    )

    return {"status": "scheduled"}

class Item(BaseModel):
    data:str
    input_features:list|None
    target_features:str
    model:str
    model_params:dict
    user_database:dict|None

@app.post("/model_training")
async def create_item(item: Item):
    data=item.data
    input_features=item.input_features
    target_feature=item.target_features
    model=item.model
    params=item.model_params
    user_database=item.user_database #Database credentials

    report,file_path=ModelTrainer.model_training_initiate(data,input_features,target_feature,model,params,user_database)
    
    return {"report": report, "file_path": file_path}

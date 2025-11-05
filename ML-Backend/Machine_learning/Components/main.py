from Machine_learning.Components.Model_trainer import ModelTrainer
from dataclasses import dataclass
from fastapi import FastAPI
import json
from pydantic import BaseModel

app=FastAPI()
class Item(BaseModel):
    user_name:str
    DBsource:dict # Data source dict format
    modelConfig:dict
     

@app.post("/model_training")
async def create_item(item: Item):
    user_name=item.user_name
    DBsource=item.DBsource
    target_feature=item.DBsource.get("features",{}).get("targetf",{})
    model_type=item.modelConfig.get("modelType")
    params=item.modelConfig.get("modelparams")
    model_name=item.modelConfig.get("modelName")

    model_path_s3,report_path_s3=ModelTrainer.model_training_initiate(DBsource,target_feature,model_type,params,user_name,model_name)
    
    return model_path_s3,report_path_s3


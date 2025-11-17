from fastapi import FastAPI, Request
from Machine_learning.Components.Model_trainer import ModelTrainer
from pydantic import BaseModel

app = FastAPI()

# class Item(BaseModel):
#     user_name:str
#     DBsource:dict # Data source dict format
#     modelConfig:dict
     
@app.post("/model_training")
async def create_item(request: Request):
    try:
        req = await request.json()
        user_name = req.get("user_name")

        DBsource = req.get("DBsource", {})
        target_feature = DBsource.get("features", {}).get("targetf")
        modelConfig = req.get("modelConfig", {})
        model_type = modelConfig.get("modelType")
        params = modelConfig.get("modelparams")
        model_name = modelConfig.get("modelName")
    
        model_path_s3, report_path_s3 = ModelTrainer.model_training_initiate(DBsource, target_feature, model_type, params, user_name, model_name)

    except Exception as e:
        return  {"status":"failure","message":str(e)}
    
    return {"status": "success", "model_path_s3": model_path_s3, "report_path_s3": report_path_s3}


from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from Machine_learning.Components.Model_trainer import ModelTrainer
from pydantic import BaseModel

origins = ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:8000"]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
# class Item(BaseModel):
#     user_name:str
#     DBsource:dict # Data source dict format
#     modelConfig:dict
     
@app.post("/linear_regression")
async def create_item(request: Request):
    try:
        req: dict = (await request.json()) or {}
        user_name = "user_name"

        DBsource: dict = req.get("DBsource", {})
        target_feature = DBsource.get("features", {}).get("targetf")
        modelConfig: dict = req.get("modelConfig", {})
        model_type = modelConfig.get("modelType")
        params = modelConfig.get("modelParams") or modelConfig.get("modelparams")
        model_name = modelConfig.get("modelName")
    
        model_path_s3, report_path_s3 = ModelTrainer.model_training_initiate(DBsource, target_feature, "Linear_regression", params, user_name, model_name)

    except Exception as e:
        print(e)
        return  {"status":"failure","message":str(e)}
    
    return {"status": "success", "model_path_s3": model_path_s3, "report_path_s3": report_path_s3}

@app.post("/decision_tree_regressor")
async def create_item(request: Request):
    try:
        req = (await request.json()) or {}
        user_name = req.get("user_name", "user_name")

        DBsource = req.get("DBsource", {})
        target_feature = DBsource.get("features", {}).get("targetf")
        modelConfig = req.get("modelConfig", {})
        model_type = modelConfig.get("modelType")
        params = modelConfig.get("modelparams") or modelConfig.get("modelParams")
        model_name = modelConfig.get("modelName")
    
        model_path_s3, report_path_s3 = ModelTrainer.model_training_initiate(DBsource, target_feature, "Decision_tree_Regression", params, user_name, model_name)

    except Exception as e:
        return  {"status":"failure","message":str(e)}
    
    return {"status": "success", "model_path_s3": model_path_s3, "report_path_s3": report_path_s3}

@app.post("/random_forest_regressor")
async def create_item(request: Request):
    try:
        req = (await request.json()) or {}
        user_name = req.get("user_name", "user_name")

        DBsource = req.get("DBsource", {})
        target_feature = DBsource.get("features", {}).get("targetf")
        modelConfig = req.get("modelConfig", {})
        model_type = modelConfig.get("modelType")
        params = modelConfig.get("modelparams") or modelConfig.get("modelParams")
        model_name = modelConfig.get("modelName")
    
        model_path_s3, report_path_s3 = ModelTrainer.model_training_initiate(DBsource, target_feature, "Random_forest_Regression", params, user_name, model_name)

    except Exception as e:
        return  {"status":"failure","message":str(e)}
    
    return {"status": "success", "model_path_s3": model_path_s3, "report_path_s3": report_path_s3}

@app.post("/decision_tree_classifier")
async def create_item(request: Request):
    try:
        req = (await request.json()) or {}
        
        user_name = req.get("user_name", "user_name")

        DBsource = req.get("DBSource", {})
        target_feature = DBsource.get("features", {}).get("targetf")
        modelConfig = req.get("modelConfig", {})
        model_type = modelConfig.get("modelType")
        params = modelConfig.get("modelParams") or modelConfig.get("modelParams")
        model_name = modelConfig.get("modelName")
    
        model_path_s3, report_path_s3 = ModelTrainer.model_training_initiate(DBsource, target_feature, "Decision_tree_Classifier", params, user_name, model_name)

    except Exception as e:
        return  {"status":"failure","message":str(e)}
    
    return {"status": "success", "model_path_s3": model_path_s3, "report_path_s3": report_path_s3}

@app.post("/random_forest_classifier")
async def create_item(request: Request):
    try:
        req = (await request.json()) or {}
        user_name = req.get("user_name", "user_name")

        DBsource = req.get("DBsource", {})
        target_feature = DBsource.get("features", {}).get("targetf")
        modelConfig = req.get("modelConfig", {})
        model_type = modelConfig.get("modelType")
        params = modelConfig.get("modelparams") or modelConfig.get("modelParams")
        model_name = modelConfig.get("modelName")
    
        model_path_s3, report_path_s3 = ModelTrainer.model_training_initiate(DBsource, target_feature, "Random_forest_Classifier", params, user_name, model_name)

    except Exception as e:
        return  {"status":"failure","message":str(e)}
    
    return {"status": "success", "model_path_s3": model_path_s3, "report_path_s3": report_path_s3}
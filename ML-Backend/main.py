from fastapi import FastAPI, Request
from Machine_learning.Components.Model_trainer import ModelTrainer
from pydantic import BaseModel

app = FastAPI()

# class Item(BaseModel):
#     user_name:str
#     DBsource:dict # Data source dict format
#     modelConfig:dict
     
# @app.post("/model_training")
# async def create_item(request: Request):
#     try:
#         req = await request.json()
#         user_name = req.get("user_name")

#         DBsource = req.get("DBsource", {})
#         target_feature = DBsource.get("features", {}).get("targetf")
#         modelConfig = req.get("modelConfig", {})
#         model_type = modelConfig.get("modelType")
#         params = modelConfig.get("modelparams")
#         model_name = modelConfig.get("modelName")
    
#         model_path_s3, report_path_s3 = ModelTrainer.model_training_initiate(DBsource, target_feature, model_type, params, user_name, model_name)

#     except Exception as e:
#         return  {"status":"failure","message":str(e)}
    
#     return {"status": "success", "model_path_s3": model_path_s3, "report_path_s3": report_path_s3}

#separte route for all the models
@app.post("/linear_regression")
async def create_item(request: Request):
    try:
        req:dict= await request.json()
        user_name = "Trainer"

        DBsource: dict= req.get("DBSource",{})
        target_feature = DBsource.get("features",{}).get("targetf")
        modelConfig:dict = req.get("modelConfig",{})
        # model_type = modelConfig.get("modelType")
        params = modelConfig.get("modelParams",{})
        model_name = modelConfig.get("modelName")
    
        model_path_s3, report_path_s3 = ModelTrainer.model_training_initiate(DBsource, target_feature, "Linear_regression", params, user_name, model_name,False)
    
        return {"status": "success", "model_path_s3": model_path_s3, "report_path_s3": report_path_s3}
    except Exception as e:
        return  {"status":"failure","message":str(e)}

@app.post("/decision_tree_regressor")
async def create_item(request: Request):
    try:
        req = await request.json()
        user_name = "Trainer2"

        DBsource = req.get("DBSource", {})
        target_feature = DBsource.get("features", {}).get("targetf")
        modelConfig = req.get("modelConfig", {})
        model_type = modelConfig.get("modelType")
        params = modelConfig.get("modelParams")
        model_name = modelConfig.get("modelName")
    
        model_path_s3, report_path_s3 = ModelTrainer.model_training_initiate(DBsource, target_feature, "Decision_tree_Regression", params, user_name, model_name,False)

    except Exception as e:
        return  {"status":"failure","message":str(e)}
    
    return {"status": "success", "model_path_s3": model_path_s3, "report_path_s3": report_path_s3}

@app.post("/random_forest_regressor")
async def create_item(request: Request):
    try:
        req = await request.json()
        user_name = "Trainer3"

        DBsource = req.get("DBSource", {})
        target_feature = DBsource.get("features", {}).get("targetf")
        modelConfig = req.get("modelConfig", {})
        model_type = modelConfig.get("modelType")
        params = modelConfig.get("modelParams", {})
        model_name = modelConfig.get("modelName")
    
        model_path_s3, report_path_s3 = ModelTrainer.model_training_initiate(DBsource, target_feature, "Random_forest_Regression", params, user_name, model_name,False)

    except Exception as e:
        return  {"status":"failure","message":str(e)}
    
    return {"status": "success", "model_path_s3": model_path_s3, "report_path_s3": report_path_s3}

@app.post("/decision_tree_classifier")
async def create_item(request: Request):
    try:
        req = await request.json()
        user_name="regghdb"
        DBsource = req.get("DBSource", {})
        target_feature = DBsource.get("features", {}).get("targetf")
        modelConfig = req.get("modelConfig", {})
        model_type = modelConfig.get("modelType")
        params = modelConfig.get("modelParams")
        model_name = modelConfig.get("modelName")
    
        model_path_s3, report_path_s3 = ModelTrainer.model_training_initiate(DBsource, target_feature, "Decision_tree_Classifier", params, user_name, model_name,True)

    except Exception as e:
        return  {"status":"failure","message":str(e)}
    
    return {"status": "success", "model_path_s3": model_path_s3, "report_path_s3": report_path_s3}

@app.post("/random_forest_classifier")
async def create_item(request: Request):
    try:
        req = await request.json()
        user_name = "Trainer2"

        DBsource = req.get("DBSource", {})
        target_feature = DBsource.get("features", {}).get("targetf")
        modelConfig = req.get("modelConfig", {})
        model_type = modelConfig.get("modelType")
        params = modelConfig.get("modelParams")
        model_name = modelConfig.get("modelName")
    
        model_path_s3, report_path_s3 = ModelTrainer.model_training_initiate(DBsource, target_feature, "Random_forest_Classifier", params, user_name, model_name,True)

    except Exception as e:
        return  {"status":"failure","message":str(e)}
    
    return {"status": "success", "model_path_s3": model_path_s3, "report_path_s3": report_path_s3}

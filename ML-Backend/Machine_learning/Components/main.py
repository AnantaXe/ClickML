from Machine_learning.Components.Model_trainer import ModelTrainer
from dataclasses import dataclass
from fastapi import FastAPI
import json
from pydantic import BaseModel

app=FastAPI()
class Item(BaseModel):
    data:str
    input_features:list|None
    target_features:str
    model:str
    model_params:dict
    user_database:dict|None

@app.post("/model_training/")
async def create_item(item: Item):
    data=item.data
    input_features=item.input_features
    target_feature=item.target_features
    model=item.model
    params=item.model_params
    user_database=item.user_database #Database credentials

    report,file_path=ModelTrainer.model_training_initiate(data,input_features,target_feature,model,params,user_database)
    
    return report,file_path

# def model_training_initiate(Data1,Target_feature,model,params):
#     d1=Data1
# Data=pd.read_csv(r"E:\projects\College_Project\phisingData.csv") # from configuration file
# Target_feature="Results"
# Data=Preprocess(Data)# returns preprocessed train and test dataset

# DataTransformation=DataTransformation()
# Trans_Train,Trans_Test=DataTransformation.initiate_data_transformation(Data,Target_feature) # returns transformed Data

# model=RandomForestRegressor()
# params= param_grid = {
# 'n_estimators': [100, 200, 500]
# }

# ModelTrain=ModelTrainer()
# Model_report,file_path=ModelTrain.initiate_model_trainer(Trans_Train,Trans_Test,model,params)
# print(Model_report,file_path)


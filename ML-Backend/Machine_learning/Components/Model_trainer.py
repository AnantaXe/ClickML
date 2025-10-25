
import os
from dataclasses import dataclass
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score
from Machine_learning.Components.utils import evaluate_model,save_object
from Machine_learning.Components.Data_preprocess import Preprocess
from Machine_learning.Components.data_transformation import DataTransformation
import numpy as np 
import pandas as pd
# from src.Components.Exception.exception import CustomException
# from src.Components.Logger.logger import logging


# Data=pd.read_csv(r"E:\projects\College_Project\phisingData.csv") # from configuration file
# Target_columns="Result"

# Data=Preprocess(Data)# returns preprocessed train and test dataset

# DataTransformation=DataTransformation()
# Trans_Train,Trans_Test=DataTransformation.initiate_data_transformation(Data) # returns transformed Data

# print("Training shape:",Trans_Train.shape,"Test Shape:",Trans_Test.shape)
# print("data shape:",Data.shape)
# print(Trans_Train[8])

@dataclass
class ModelTrainerConfig:
    trained_model_file_path=os.path.join("artifacts","model.pkl")#Database file location 
    trained_model_params_path=os.path.join("artifacts","Params.pkl")

class ModelTrainer:
    def __init__(self):
        self.model_trainer_config=ModelTrainerConfig

    def model_object_saving(self,train_array,test_array,model,params:dict):
    
            X_train,y_train,X_test,y_test=(
                train_array[:,:-1],
                train_array[:,-1],
                test_array[:,:-1],
                test_array[:,-1]
            )
#evaluate models is a function in utils
            model_report : dict = evaluate_model(X_train=X_train,y_train=y_train,X_test=X_test,y_test=y_test,
                                               model=model,param=params)
            
# # To get best model score from dict
#             best_model_score=max(sorted(model_report.values()))

# # To get best model name from dict
#             best_model_name=list(model_report.keys())[list(model_report.values()).index(best_model_score)]

#             best_model = models[best_model_name]

#             if best_model_score<0.6:
#                 raise CustomException("No best Model Found")
#             logging.info(f"Best Found Model on both training and testing dataset")

            save_object(
                file_path=self.model_trainer_config.trained_model_file_path,
                obj=model
            )#Database location or server
            
            save_object(
                file_path=self.model_trainer_config.trained_model_params_path,
                obj=params
            )
            return model_report,ModelTrainerConfig.trained_model_file_path
    

    def model_training_initiate(Data_url,Input_features,Target_feature,model,params,user_database):
        
        Data=pd.read_csv(Data_url) # from configuration file
        Data=Preprocess(Data)# returns preprocessed train and test dataset

        Data_Transformation=DataTransformation()
        Trans_Train,Trans_Test=Data_Transformation.initiate_data_transformation(Data,Target_feature) # returns transformed Data

        model=ModelTrainer.Getting_model_object(model)
        # params= param_grid = {
        # 'n_estimators': [100, 200, 500]
        # }

        ModelTrain=ModelTrainer()
        Model_report,file_path=ModelTrain.model_object_saving(Trans_Train,Trans_Test,model,params)
        return Model_report,file_path
        
    def Getting_model_object(model_name:str):
        model_names={
            "Linear_regression":LinearRegression(),
            "Random_forest":RandomForestRegressor()
        }
        model=model_names.get(model_name)
        return model
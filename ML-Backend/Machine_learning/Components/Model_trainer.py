
import os
from dataclasses import dataclass
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor,RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier,DecisionTreeRegressor
from Machine_learning.Components.utils import evaluate_model,fetch_data_postgresql
from Machine_learning.Components.Data_preprocess import Preprocess
from Machine_learning.Components.data_transformation import DataTransformation
from Machine_learning.Components.utils import upload_to_s3

@dataclass
class ModelTrainerConfig:
    trained_model_file_path=os.path.join("artifacts","model.pkl")#Database file location 
    trained_model_params_path=os.path.join("artifacts","Params.pkl")

class ModelTrainer:
    def __init__(self):
        self.model_trainer_config=ModelTrainerConfig

    def model_object_saving_to_s3(self,train_array,test_array,model,params:dict,user_name,Model_name):
    
            X_train,y_train,X_test,y_test=(
                train_array[:,:-1],
                train_array[:,-1],
                test_array[:,:-1],
                test_array[:,-1]
            )
#evaluate models is a function in utils that returns the model and its report local path
            model_report_path,Trained_model = evaluate_model(X_train=X_train,y_train=y_train,X_test=X_test,y_test=y_test,
                                               model=model,param=params)
            
            #updating the user name in the s3 bucket
            dir_path:str= f"Users_models/{user_name}/Models/{Model_name}" 
            model_path_s3,report_path_s3=upload_to_s3(model_obj=Trained_model,report_path=model_report_path,bucket_name="clickml-model",s3_directory=dir_path,filename=Model_name)
                
            return model_path_s3,report_path_s3
            
    

    def model_training_initiate(DBsource,Target_feature,model,params,user_name,model_name):
        
        Data=fetch_data_postgresql(DBsource) # from configuration file
        Data=Preprocess(Data)# returns preprocessed train and test dataset

        Data_Transformation=DataTransformation()
        Trans_Train,Trans_Test=Data_Transformation.initiate_data_transformation(Data,Target_feature) # returns transformed Data

        model=ModelTrainer.Getting_model_object(model)

        ModelTrain=ModelTrainer()
        model_path_s3,report_path_s3=ModelTrain.model_object_saving_to_s3(Trans_Train,Trans_Test,model,params,user_name,model_name)
        return model_path_s3,report_path_s3
        
        
    def Getting_model_object(model_name:str):
        model_names={
            "Linear_regression":LinearRegression(),
            "Random_forest_Regression":RandomForestRegressor(),
            "Random_forest_Classifier":RandomForestClassifier(),
            "Decision_tree_Regression":DecisionTreeRegressor(),
            "Decision_tree_Classifier":DecisionTreeClassifier()
        }
        model=model_names.get(model_name)
        return model

    
import os
import sys

import numpy as np
import pandas as pd
import dill
# from Exception.exception import CustomException
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import r2_score
def evaluate_model(X_train,y_train,X_test,y_test,model,param):
            report = {}

            gs = GridSearchCV(model,param,cv=3)
            gs.fit(X_train,y_train)

            model.set_params(**gs.best_params_)
            model.fit(X_train,y_train)
            
            #Making Predictions
            y_train_pred=model.predict(X_train)
            y_test_pred=model.predict(X_test)

            train_model_score=r2_score(y_train,y_train_pred)
            test_model_score=r2_score(y_test,y_test_pred)

            report[model.__class__.__name__] = train_model_score,test_model_score

            return report
    


def save_object(file_path,obj):
    
        dir_path = os.path.dirname(file_path)

        os.makedirs(dir_path,exist_ok=True)

        with open(file_path,"wb") as file_obj:
            dill.dump(obj,file_obj)
    

import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder,StandardScaler
from sklearn.model_selection import train_test_split

##these class is for all the inputs/paths for the data transformation components to be used

class DataTransformation:

    def get_data_transformer_object(self,Data,Target_feature):
        '''
        This function is responsible for data transformation based on different types of data
        '''
       
        numerical_columns=list(Data.select_dtypes(int).columns)

        categorical_columns=list(Data.select_dtypes(object).columns)

        #To remove target column from getting transfromed
        
        if Target_feature in numerical_columns:
            numerical_columns.remove(Target_feature)
        else:
            categorical_columns.remove(Target_feature)

        num_pipeline=Pipeline(
                steps=[
                    ("imputer",SimpleImputer(strategy="median")),
                    ("scaler",StandardScaler())
                ]
            )

        cat_pipeline=Pipeline(
                steps=[
                    ("imputer",SimpleImputer(strategy="most_frequent")),
                    ("one_hot_encoder",OneHotEncoder(handle_unknown='ignore')),
                    ("scaler",StandardScaler(with_mean=False))
                ]
            )
            
        preprocessor=ColumnTransformer(
                [
                    ("num pipeline",num_pipeline,numerical_columns),
                    ("catergorial pipeline",cat_pipeline,categorical_columns)
                ]
            )

        return preprocessor
        

    def initiate_data_transformation(self,Data,target_feature):

            train_df,test_df=train_test_split(Data,test_size=0.2,random_state=42)
            target_feature= "result" #from configuration file

            preprocessing_obj=self.get_data_transformer_object(Data,target_feature)

            input_feature_train_df=train_df.drop(columns=[target_feature],axis=1)
            target_features_train_df=train_df[target_feature]

            input_feature_test_df=test_df.drop(columns=[target_feature],axis=1)
            target_features_test_df=test_df[target_feature]

            input_feature_train_arr=preprocessing_obj.fit_transform(input_feature_train_df)
            input_feature_test_arr=preprocessing_obj.transform(input_feature_test_df)

            train_arr = np.c_[input_feature_train_arr,np.array(target_features_train_df)]
            test_arr = np.c_[input_feature_test_arr,np.array(target_features_test_df)]

            return(
                train_arr,
                test_arr,
                )
        







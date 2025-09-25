import numpy as np
import pandas as pd

def Preprocess(Data):
        #Removing Duplicate Rows
        Data=Data.drop_duplicates()

        #Function to handle categorial and numerical features
        Numerical_features=list(Data.select_dtypes(int).columns)

        Categorial_features=list(Data.select_dtypes(object).columns)

        # To handle missing values
        for columns in Numerical_features:
            Data[columns].fillna(Data[columns].mean())
                    
        for columns in Categorial_features:
            Data[columns].fillna(Data[columns].mode())

        ## To convert data into lower case

        Data=Data.map(lambda s: s.lower() if type(s) == str else s)

        return Data


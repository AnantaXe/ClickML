"""Data preprocessing components"""

from typing import Any, Dict, List
import pandas as pd
import numpy as np
from clickml.core.base import BaseComponent


class PreprocessingComponent(BaseComponent):
    """Data preprocessing component for ML pipelines"""
    
    def __init__(self, name: str, config: Dict[str, Any] = None):
        super().__init__(name, config)
        self.scaler = None
        self.encoder = None
    
    def scale_features(self, data: pd.DataFrame, columns: List[str] = None) -> pd.DataFrame:
        """Scale numerical features"""
        from sklearn.preprocessing import StandardScaler
        
        if columns is None:
            columns = data.select_dtypes(include=[np.number]).columns.tolist()
        
        scaled_data = data.copy()
        
        if self.scaler is None:
            self.scaler = StandardScaler()
            scaled_data[columns] = self.scaler.fit_transform(data[columns])
        else:
            scaled_data[columns] = self.scaler.transform(data[columns])
        
        return scaled_data
    
    def encode_categorical(self, data: pd.DataFrame, columns: List[str] = None) -> pd.DataFrame:
        """Encode categorical features"""
        from sklearn.preprocessing import LabelEncoder
        
        if columns is None:
            columns = data.select_dtypes(include=['object']).columns.tolist()
        
        encoded_data = data.copy()
        
        if self.encoder is None:
            self.encoder = {}
        
        for col in columns:
            if col not in self.encoder:
                self.encoder[col] = LabelEncoder()
                encoded_data[col] = self.encoder[col].fit_transform(data[col].astype(str))
            else:
                encoded_data[col] = self.encoder[col].transform(data[col].astype(str))
        
        return encoded_data
    
    def handle_outliers(self, data: pd.DataFrame, method: str = "iqr") -> pd.DataFrame:
        """Handle outliers in the data"""
        cleaned_data = data.copy()
        
        if method == "iqr":
            # Use IQR method for outlier detection
            numeric_columns = data.select_dtypes(include=[np.number]).columns
            
            for col in numeric_columns:
                Q1 = data[col].quantile(0.25)
                Q3 = data[col].quantile(0.75)
                IQR = Q3 - Q1
                
                lower_bound = Q1 - 1.5 * IQR
                upper_bound = Q3 + 1.5 * IQR
                
                cleaned_data[col] = np.where(
                    (cleaned_data[col] < lower_bound) | (cleaned_data[col] > upper_bound),
                    cleaned_data[col].median(),
                    cleaned_data[col]
                )
        
        return cleaned_data
    
    def feature_selection(self, data: pd.DataFrame, target_col: str = None) -> pd.DataFrame:
        """Basic feature selection"""
        # Remove columns with too many missing values
        threshold = self.config.get("missing_threshold", 0.5)
        missing_ratio = data.isnull().sum() / len(data)
        cols_to_keep = missing_ratio[missing_ratio <= threshold].index.tolist()
        
        # Remove columns with low variance
        if self.config.get("remove_low_variance", True):
            numeric_cols = data.select_dtypes(include=[np.number]).columns
            for col in numeric_cols:
                if data[col].var() < 0.01:  # Very low variance
                    if col in cols_to_keep:
                        cols_to_keep.remove(col)
        
        return data[cols_to_keep]
    
    def execute(self, data: Any) -> pd.DataFrame:
        """Execute preprocessing steps"""
        if not isinstance(data, pd.DataFrame):
            data = pd.DataFrame(data)
        
        processed_data = data.copy()
        
        # Apply preprocessing steps based on configuration
        if self.config.get("scale_features", True):
            processed_data = self.scale_features(processed_data)
        
        if self.config.get("encode_categorical", True):
            processed_data = self.encode_categorical(processed_data)
        
        if self.config.get("handle_outliers", False):
            method = self.config.get("outlier_method", "iqr")
            processed_data = self.handle_outliers(processed_data, method)
        
        if self.config.get("feature_selection", False):
            processed_data = self.feature_selection(processed_data)
        
        return processed_data
    
    def validate(self) -> bool:
        """Validate preprocessing component"""
        if not self.name:
            return False
        
        return True
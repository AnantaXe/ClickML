"""Model training components"""

from typing import Any, Dict, Union
import pandas as pd
import numpy as np
from clickml.core.base import BaseComponent
from clickml.core.model import MLModel


class TrainingComponent(BaseComponent):
    """Component for training machine learning models"""
    
    def __init__(self, name: str, config: Dict[str, Any] = None):
        super().__init__(name, config)
        self.model = None
        self.target_column = config.get("target_column") if config else None
        self.model_type = config.get("model_type", "regression") if config else "regression"
        self.algorithm = config.get("algorithm", "linear_regression") if config else "linear_regression"
    
    def create_model(self):
        """Create the ML model based on configuration"""
        if self.model_type == "regression":
            if self.algorithm == "linear_regression":
                from sklearn.linear_model import LinearRegression
                return LinearRegression()
            elif self.algorithm == "random_forest":
                from sklearn.ensemble import RandomForestRegressor
                return RandomForestRegressor(**self.config.get("model_params", {}))
            elif self.algorithm == "xgboost":
                try:
                    from xgboost import XGBRegressor
                    return XGBRegressor(**self.config.get("model_params", {}))
                except ImportError:
                    raise ImportError("XGBoost not installed. Install with: pip install xgboost")
        
        elif self.model_type == "classification":
            if self.algorithm == "logistic_regression":
                from sklearn.linear_model import LogisticRegression
                return LogisticRegression(**self.config.get("model_params", {}))
            elif self.algorithm == "random_forest":
                from sklearn.ensemble import RandomForestClassifier
                return RandomForestClassifier(**self.config.get("model_params", {}))
            elif self.algorithm == "xgboost":
                try:
                    from xgboost import XGBClassifier
                    return XGBClassifier(**self.config.get("model_params", {}))
                except ImportError:
                    raise ImportError("XGBoost not installed. Install with: pip install xgboost")
        
        else:
            raise ValueError(f"Unsupported model type: {self.model_type}")
    
    def split_data(self, data: pd.DataFrame) -> tuple:
        """Split data into features and target"""
        if self.target_column is None:
            raise ValueError("Target column must be specified for training")
        
        if self.target_column not in data.columns:
            raise ValueError(f"Target column '{self.target_column}' not found in data")
        
        X = data.drop(columns=[self.target_column])
        y = data[self.target_column]
        
        return X, y
    
    def train_model(self, X: pd.DataFrame, y: pd.Series) -> MLModel:
        """Train the model"""
        # Create sklearn model
        sklearn_model = self.create_model()
        
        # Train the model
        sklearn_model.fit(X, y)
        
        # Create ClickML MLModel wrapper
        clickml_model = MLModel(
            name=f"{self.name}_model",
            model_type=self.model_type,
            config=self.config
        )
        clickml_model.model = sklearn_model
        clickml_model.is_trained = True
        
        return clickml_model
    
    def evaluate_model(self, model: MLModel, X: pd.DataFrame, y: pd.Series) -> Dict[str, float]:
        """Evaluate the trained model"""
        predictions = model.predict(X)
        
        if self.model_type == "regression":
            from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
            
            metrics = {
                "mse": float(mean_squared_error(y, predictions)),
                "rmse": float(np.sqrt(mean_squared_error(y, predictions))),
                "mae": float(mean_absolute_error(y, predictions)),
                "r2": float(r2_score(y, predictions))
            }
        
        elif self.model_type == "classification":
            from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
            
            metrics = {
                "accuracy": float(accuracy_score(y, predictions)),
                "precision": float(precision_score(y, predictions, average="weighted")),
                "recall": float(recall_score(y, predictions, average="weighted")),
                "f1": float(f1_score(y, predictions, average="weighted"))
            }
        
        else:
            metrics = {"sample_count": len(y)}
        
        return metrics
    
    def execute(self, data: Any) -> MLModel:
        """Execute the training process"""
        if not isinstance(data, pd.DataFrame):
            data = pd.DataFrame(data)
        
        # Split data into features and target
        X, y = self.split_data(data)
        
        # Optionally split into train/test sets
        if self.config.get("test_size", 0) > 0:
            from sklearn.model_selection import train_test_split
            test_size = self.config["test_size"]
            random_state = self.config.get("random_state", 42)
            
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=test_size, random_state=random_state
            )
        else:
            X_train, y_train = X, y
            X_test, y_test = None, None
        
        # Train the model
        model = self.train_model(X_train, y_train)
        
        # Evaluate the model
        train_metrics = self.evaluate_model(model, X_train, y_train)
        model.metrics["train"] = train_metrics
        
        if X_test is not None and y_test is not None:
            test_metrics = self.evaluate_model(model, X_test, y_test)
            model.metrics["test"] = test_metrics
        
        self.model = model
        return model
    
    def validate(self) -> bool:
        """Validate training component configuration"""
        if not self.name:
            return False
        
        if not self.target_column:
            return False
        
        if self.model_type not in ["regression", "classification"]:
            return False
        
        return True
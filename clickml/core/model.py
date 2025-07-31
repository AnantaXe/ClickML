"""Machine Learning model management"""

from typing import Any, Dict, Optional, Union
import joblib
import pandas as pd
from datetime import datetime
import logging
from .base import BaseComponent

logger = logging.getLogger(__name__)


class MLModel(BaseComponent):
    """Represents a machine learning model in ClickML"""
    
    def __init__(self, name: str, model_type: str, config: Optional[Dict[str, Any]] = None):
        super().__init__(name, config)
        self.model_type = model_type
        self.model = None
        self.is_trained = False
        self.created_at = datetime.utcnow()
        self.metrics: Dict[str, float] = {}
    
    def load_model(self, model_path: str) -> None:
        """Load a pre-trained model from file"""
        try:
            self.model = joblib.load(model_path)
            self.is_trained = True
            logger.info(f"Model {self.name} loaded from {model_path}")
        except Exception as e:
            logger.error(f"Failed to load model {self.name}: {str(e)}")
            raise
    
    def save_model(self, model_path: str) -> None:
        """Save the trained model to file"""
        if not self.is_trained or self.model is None:
            raise ValueError("Model must be trained before saving")
        
        try:
            joblib.dump(self.model, model_path)
            logger.info(f"Model {self.name} saved to {model_path}")
        except Exception as e:
            logger.error(f"Failed to save model {self.name}: {str(e)}")
            raise
    
    def train(self, X: Union[pd.DataFrame, Any], y: Union[pd.Series, Any]) -> None:
        """Train the model"""
        if self.model is None:
            raise ValueError("Model not initialized")
        
        try:
            self.model.fit(X, y)
            self.is_trained = True
            logger.info(f"Model {self.name} trained successfully")
        except Exception as e:
            logger.error(f"Failed to train model {self.name}: {str(e)}")
            raise
    
    def predict(self, X: Union[pd.DataFrame, Any]) -> Any:
        """Make predictions using the model"""
        if not self.is_trained or self.model is None:
            raise ValueError("Model must be trained before making predictions")
        
        try:
            predictions = self.model.predict(X)
            logger.info(f"Model {self.name} made predictions for {len(X)} samples")
            return predictions
        except Exception as e:
            logger.error(f"Failed to make predictions with model {self.name}: {str(e)}")
            raise
    
    def execute(self, data: Any) -> Any:
        """Execute the model component (make predictions)"""
        if isinstance(data, dict) and "X" in data:
            return self.predict(data["X"])
        else:
            return self.predict(data)
    
    def validate(self) -> bool:
        """Validate the model configuration"""
        if not self.name:
            logger.error("Model name is required")
            return False
        
        if not self.model_type:
            logger.error("Model type is required")
            return False
        
        return True
    
    def evaluate(self, X: Any, y: Any, metrics: Optional[List[str]] = None) -> Dict[str, float]:
        """Evaluate the model performance"""
        if not self.is_trained or self.model is None:
            raise ValueError("Model must be trained before evaluation")
        
        predictions = self.predict(X)
        
        # Calculate metrics (simplified - in practice would use sklearn.metrics)
        evaluation_results = {
            "sample_count": len(y),
            "prediction_count": len(predictions)
        }
        
        self.metrics.update(evaluation_results)
        return evaluation_results
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert model to dictionary representation"""
        return {
            "name": self.name,
            "model_type": self.model_type,
            "is_trained": self.is_trained,
            "created_at": self.created_at.isoformat(),
            "metrics": self.metrics,
            "config": self.config
        }
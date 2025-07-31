"""Model management endpoints"""

from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from clickml.core import MLModel
from clickml.config import Config
from backend.dependencies import get_config

router = APIRouter()

# In-memory storage for demo purposes
# TODO: Replace with database storage
models_storage = {}


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_model(
    name: str,
    model_type: str,
    config: Config = Depends(get_config)
):
    """Create a new ML model"""
    if name in models_storage:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Model '{name}' already exists"
        )
    
    model = MLModel(name=name, model_type=model_type)
    models_storage[name] = model
    
    return {
        "message": f"Model '{name}' created successfully",
        "model": model.to_dict()
    }


@router.get("/")
async def list_models():
    """List all models"""
    return {
        "models": [model.to_dict() for model in models_storage.values()]
    }


@router.get("/{model_name}")
async def get_model(model_name: str):
    """Get a specific model"""
    if model_name not in models_storage:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Model '{model_name}' not found"
        )
    
    return models_storage[model_name].to_dict()


@router.delete("/{model_name}")
async def delete_model(model_name: str):
    """Delete a model"""
    if model_name not in models_storage:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Model '{model_name}' not found"
        )
    
    del models_storage[model_name]
    return {"message": f"Model '{model_name}' deleted successfully"}


@router.post("/{model_name}/predict")
async def predict(model_name: str, data: dict):
    """Make predictions using a model"""
    if model_name not in models_storage:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Model '{model_name}' not found"
        )
    
    model = models_storage[model_name]
    
    if not model.is_trained:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Model '{model_name}' is not trained"
        )
    
    try:
        predictions = model.execute(data)
        return {
            "model_name": model_name,
            "predictions": predictions.tolist() if hasattr(predictions, 'tolist') else predictions
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {str(e)}"
        )
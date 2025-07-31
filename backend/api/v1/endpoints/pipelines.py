"""Pipeline management endpoints"""

from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from clickml.core import Pipeline
from clickml.config import Config
from backend.dependencies import get_config

router = APIRouter()

# In-memory storage for demo purposes
# TODO: Replace with database storage
pipelines_storage = {}


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_pipeline(
    name: str,
    description: str = None,
    config: Config = Depends(get_config)
):
    """Create a new pipeline"""
    if name in pipelines_storage:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Pipeline '{name}' already exists"
        )
    
    pipeline = Pipeline(name=name, description=description)
    pipelines_storage[name] = pipeline
    
    return {
        "message": f"Pipeline '{name}' created successfully",
        "pipeline": pipeline.to_dict()
    }


@router.get("/")
async def list_pipelines():
    """List all pipelines"""
    return {
        "pipelines": [pipeline.to_dict() for pipeline in pipelines_storage.values()]
    }


@router.get("/{pipeline_name}")
async def get_pipeline(pipeline_name: str):
    """Get a specific pipeline"""
    if pipeline_name not in pipelines_storage:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pipeline '{pipeline_name}' not found"
        )
    
    return pipelines_storage[pipeline_name].to_dict()


@router.delete("/{pipeline_name}")
async def delete_pipeline(pipeline_name: str):
    """Delete a pipeline"""
    if pipeline_name not in pipelines_storage:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pipeline '{pipeline_name}' not found"
        )
    
    del pipelines_storage[pipeline_name]
    return {"message": f"Pipeline '{pipeline_name}' deleted successfully"}


@router.post("/{pipeline_name}/execute")
async def execute_pipeline(pipeline_name: str, input_data: dict = None):
    """Execute a pipeline"""
    if pipeline_name not in pipelines_storage:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pipeline '{pipeline_name}' not found"
        )
    
    pipeline = pipelines_storage[pipeline_name]
    
    try:
        results = pipeline.execute(input_data)
        return {
            "message": f"Pipeline '{pipeline_name}' executed successfully",
            "results": results
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Pipeline execution failed: {str(e)}"
        )
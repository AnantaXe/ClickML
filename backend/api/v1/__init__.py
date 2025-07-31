"""API v1 routes"""

from fastapi import APIRouter

from .endpoints import pipelines, models, health

api_router = APIRouter()

api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(pipelines.router, prefix="/pipelines", tags=["pipelines"])
api_router.include_router(models.router, prefix="/models", tags=["models"])
"""Health check endpoints"""

from fastapi import APIRouter, Depends
from clickml.config import Config
from backend.dependencies import get_config

router = APIRouter()


@router.get("/")
async def health_check(config: Config = Depends(get_config)):
    """Basic health check"""
    return {
        "status": "healthy",
        "app_name": config.app_name,
        "version": config.version
    }


@router.get("/detailed")
async def detailed_health_check():
    """Detailed health check with system status"""
    # TODO: Add checks for database, redis, etc.
    return {
        "status": "healthy",
        "components": {
            "database": "unknown",  # TODO: Check database connection
            "redis": "unknown",     # TODO: Check redis connection
            "storage": "unknown"    # TODO: Check storage availability
        }
    }
"""FastAPI dependencies"""

from functools import lru_cache
from fastapi import Depends
from sqlalchemy.orm import Session

from clickml.config import Config
# from .database import SessionLocal  # Uncomment when database is implemented


@lru_cache()
def get_config() -> Config:
    """Get application configuration"""
    return Config.load()


def get_database() -> Session:
    """Get database session"""
    # TODO: Implement database session management
    # db = SessionLocal()
    # try:
    #     yield db
    # finally:
    #     db.close()
    pass


def get_current_user():
    """Get current authenticated user"""
    # TODO: Implement authentication
    pass
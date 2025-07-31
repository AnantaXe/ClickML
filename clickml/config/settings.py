"""ClickML configuration settings"""

import os
from typing import Optional
from pydantic import BaseSettings, Field


class DatabaseConfig(BaseSettings):
    """Database configuration"""
    url: str = Field(default="postgresql://user:password@localhost:5432/clickml", env="DATABASE_URL")
    echo: bool = Field(default=False, env="DATABASE_ECHO")
    
    class Config:
        env_prefix = "DB_"


class RedisConfig(BaseSettings):
    """Redis configuration for task queue"""
    url: str = Field(default="redis://localhost:6379/0", env="REDIS_URL")
    password: Optional[str] = Field(default=None, env="REDIS_PASSWORD")
    
    class Config:
        env_prefix = "REDIS_"


class MLConfig(BaseSettings):
    """Machine Learning configuration"""
    model_storage_path: str = Field(default="./models", env="MODEL_STORAGE_PATH")
    data_storage_path: str = Field(default="./data", env="DATA_STORAGE_PATH")
    max_model_size_mb: int = Field(default=100, env="MAX_MODEL_SIZE_MB")
    
    class Config:
        env_prefix = "ML_"


class Config(BaseSettings):
    """Main ClickML configuration"""
    
    # Application settings
    app_name: str = "ClickML"
    version: str = "0.1.0"
    debug: bool = Field(default=False, env="DEBUG")
    
    # API settings
    api_host: str = Field(default="0.0.0.0", env="API_HOST")
    api_port: int = Field(default=8000, env="API_PORT")
    api_workers: int = Field(default=1, env="API_WORKERS")
    
    # Security
    secret_key: str = Field(default="your-secret-key-change-in-production", env="SECRET_KEY")
    access_token_expire_minutes: int = Field(default=30, env="ACCESS_TOKEN_EXPIRE_MINUTES")
    
    # CORS
    allowed_origins: list = Field(default=["http://localhost:3000"], env="ALLOWED_ORIGINS")
    
    # Component configurations
    database: DatabaseConfig = DatabaseConfig()
    redis: RedisConfig = RedisConfig()
    ml: MLConfig = MLConfig()
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
    
    @classmethod
    def load(cls) -> "Config":
        """Load configuration from environment and .env file"""
        return cls()
    
    def create_directories(self) -> None:
        """Create necessary directories"""
        os.makedirs(self.ml.model_storage_path, exist_ok=True)
        os.makedirs(self.ml.data_storage_path, exist_ok=True)
        os.makedirs("logs", exist_ok=True)
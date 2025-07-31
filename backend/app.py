"""FastAPI application factory"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from clickml.config import Config
from .api.v1 import api_router
from .core.exceptions import setup_exception_handlers


def create_app(config: Config = None) -> FastAPI:
    """Create and configure FastAPI application"""
    if config is None:
        config = Config.load()
    
    app = FastAPI(
        title=config.app_name,
        version=config.version,
        debug=config.debug,
        openapi_url="/api/v1/openapi.json" if config.debug else None,
    )
    
    # Set up CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=config.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Add trusted host middleware
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["*"]  # Configure appropriately for production
    )
    
    # Include API routes
    app.include_router(api_router, prefix="/api/v1")
    
    # Set up exception handlers
    setup_exception_handlers(app)
    
    # Create necessary directories
    config.create_directories()
    
    @app.on_event("startup")
    async def startup_event():
        """Application startup event"""
        # Initialize database, cache, etc.
        pass
    
    @app.on_event("shutdown")
    async def shutdown_event():
        """Application shutdown event"""
        # Cleanup resources
        pass
    
    @app.get("/")
    async def root():
        """Root endpoint"""
        return {
            "message": f"Welcome to {config.app_name}",
            "version": config.version,
            "docs": "/docs" if config.debug else None
        }
    
    @app.get("/health")
    async def health_check():
        """Health check endpoint"""
        return {"status": "healthy"}
    
    return app
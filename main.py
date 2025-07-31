#!/usr/bin/env python3
"""
ClickML - Main entry point
Run the ClickML server directly
"""

import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    import uvicorn
    from backend.app import create_app
    from clickml.config import Config
    
    # Load configuration
    config = Config.load()
    
    # Create the FastAPI app
    app = create_app(config)
    
    # Run the server
    uvicorn.run(
        app,
        host=config.api_host,
        port=config.api_port,
        reload=config.debug
    )
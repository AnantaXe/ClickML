"""Pipeline management and execution"""

from typing import List, Dict, Any, Optional
from datetime import datetime
import logging
from .base import BaseComponent, ComponentConfig

logger = logging.getLogger(__name__)


class Pipeline:
    """Represents a ClickML pipeline"""
    
    def __init__(self, name: str, description: Optional[str] = None):
        self.name = name
        self.description = description
        self.components: List[BaseComponent] = []
        self.created_at = datetime.utcnow()
        self.status = "draft"
    
    def add_component(self, component: BaseComponent) -> None:
        """Add a component to the pipeline"""
        self.components.append(component)
        logger.info(f"Added component {component.name} to pipeline {self.name}")
    
    def remove_component(self, component_name: str) -> bool:
        """Remove a component from the pipeline"""
        for i, component in enumerate(self.components):
            if component.name == component_name:
                self.components.pop(i)
                logger.info(f"Removed component {component_name} from pipeline {self.name}")
                return True
        return False
    
    def validate(self) -> bool:
        """Validate the entire pipeline"""
        if not self.components:
            logger.error(f"Pipeline {self.name} has no components")
            return False
        
        for component in self.components:
            if not component.validate():
                logger.error(f"Component {component.name} validation failed")
                return False
        
        return True
    
    def execute(self, input_data: Any = None) -> Dict[str, Any]:
        """Execute the pipeline"""
        if not self.validate():
            raise ValueError("Pipeline validation failed")
        
        self.status = "running"
        results = {}
        current_data = input_data
        
        try:
            for component in self.components:
                logger.info(f"Executing component: {component.name}")
                current_data = component.execute(current_data)
                results[component.name] = current_data
            
            self.status = "completed"
            logger.info(f"Pipeline {self.name} executed successfully")
            
        except Exception as e:
            self.status = "failed"
            logger.error(f"Pipeline {self.name} execution failed: {str(e)}")
            raise
        
        return results
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert pipeline to dictionary representation"""
        return {
            "name": self.name,
            "description": self.description,
            "components": [comp.name for comp in self.components],
            "created_at": self.created_at.isoformat(),
            "status": self.status
        }
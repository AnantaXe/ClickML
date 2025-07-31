"""Base classes for ClickML components"""

from abc import ABC, abstractmethod
from typing import Any, Dict, Optional
from pydantic import BaseModel


class BaseComponent(ABC):
    """Base class for all ClickML components"""
    
    def __init__(self, name: str, config: Optional[Dict[str, Any]] = None):
        self.name = name
        self.config = config or {}
    
    @abstractmethod
    def execute(self, data: Any) -> Any:
        """Execute the component logic"""
        pass
    
    @abstractmethod
    def validate(self) -> bool:
        """Validate component configuration"""
        pass


class ComponentConfig(BaseModel):
    """Base configuration model for components"""
    name: str
    component_type: str
    parameters: Dict[str, Any] = {}
    inputs: Dict[str, str] = {}
    outputs: Dict[str, str] = {}
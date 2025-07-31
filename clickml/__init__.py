"""
ClickML - A low-code/no-code MLOps platform

ClickML helps MLOps engineers and data teams create end-to-end ML pipelines
through a simple, click-based interface.
"""

__version__ = "0.1.0"
__author__ = "ClickML Team"
__email__ = "team@clickml.com"

from clickml.core import Pipeline, MLModel
from clickml.config import Config

__all__ = [
    "Pipeline",
    "MLModel", 
    "Config",
]